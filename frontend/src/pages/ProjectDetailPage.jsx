import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Briefcase, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  DollarSign, 
  Target, 
  CheckCircle2, 
  Clock, 
  Activity 
} from 'lucide-react';
import MilestoneJourney from '../components/visualization/MilestoneJourney';
import ReleaseModalSequence from '../components/ui/ReleaseModalSequence';
import Modal from '../components/ui/Modal';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { projectApi, milestoneApi, releaseApi } from '../api/escrowApi';
import { useToast } from '../context/ToastContext';

export default function ProjectDetailPage({ projectId, onBack, clients = [], freelancers = [], onRefreshAll }) {
  const toast = useToast();

  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Release Modal
  const [releaseMilestone, setReleaseMilestone] = useState(null);
  const [isReleaseOpen, setIsReleaseOpen] = useState(false);

  // New Milestone Modal
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mAmount, setMAmount] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [savingMilestone, setSavingMilestone] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const [pRes, mRes] = await Promise.all([
        projectApi.getById(projectId),
        milestoneApi.getByProjectId(projectId)
      ]);
      setProject(pRes.data);
      setMilestones(mRes.data || []);
    } catch (err) {
      toast.error('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (milestoneId, newStatus) => {
    try {
      await milestoneApi.updateStatus(milestoneId, newStatus);
      toast.success(`Milestone status updated to ${newStatus}`);
      await loadProjectData();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      toast.error(err.message || 'Failed to update milestone status');
    }
  };

  const handleConfirmReleasePayment = async (milestoneId) => {
    try {
      await releaseApi.createRelease({ milestoneId });
      toast.success('Escrow payment disbursed successfully!');
      await loadProjectData();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      toast.error(err.message || 'Payment release failed');
      throw err;
    }
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    if (!mTitle || !mAmount) {
      toast.error('Title and amount are required');
      return;
    }

    setSavingMilestone(true);
    try {
      await milestoneApi.create({
        title: mTitle,
        amount: parseFloat(mAmount),
        description: mDesc,
        status: 'PENDING',
        projectId: parseInt(projectId)
      });
      toast.success('New milestone added to contract!');
      setIsAddMilestoneOpen(false);
      setMTitle('');
      setMAmount('');
      setMDesc('');
      await loadProjectData();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      toast.error(err.message || 'Failed to add milestone');
    } finally {
      setSavingMilestone(false);
    }
  };

  if (loading) {
    return (
      <div className="workspace-detail-layout">
        <SkeletonLoader type="text" count={3} />
        <SkeletonLoader type="card" height={300} count={1} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="workspace-detail-layout text-center py-5">
        <button className="btn btn-secondary mb-3" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <p>Project not found.</p>
      </div>
    );
  }

  const clientObj = clients.find(c => c.id === (project.client?.id || project.clientId));
  const freeObj = freelancers.find(f => f.id === (project.freelancer?.id || project.freelancerId));

  const totalMilestoneSum = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
  const releasedSum = milestones.filter(m => m.status === 'RELEASED').reduce((sum, m) => sum + (m.amount || 0), 0);

  return (
    <div className="workspace-detail-layout">
      {/* Back Button & Top Navigation */}
      <div className="workspace-top-bar">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Workspaces
        </button>
        <span className="workspace-tag">Escrow Contract Workspace #{project.id}</span>
      </div>

      {/* Main Workspace Hero Header */}
      <motion.div 
        className="workspace-hero-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-left-info">
          <div className="status-row">
            <span className={`status-pill status-${project.status?.toLowerCase()}`}>
              {project.status || 'ACTIVE'}
            </span>
            <span className="escrow-secured-badge">
              <ShieldCheck size={14} /> Escrow Secured
            </span>
          </div>

          <h2 className="workspace-project-title">{project.title}</h2>
          {project.description && <p className="workspace-desc">{project.description}</p>}

          <div className="workspace-parties-row">
            <div className="party-badge">
              <Users size={14} />
              <span>Client: <strong>{clientObj?.name || 'Assigned'}</strong></span>
            </div>
            <div className="party-badge">
              <UserCheck size={14} />
              <span>Freelancer: <strong>{freeObj?.name || 'Assigned'}</strong></span>
            </div>
          </div>
        </div>

        <div className="hero-right-financials">
          <div className="financial-stat-box">
            <span className="stat-label">Total Budget</span>
            <span className="stat-value font-emerald">${project.budget?.toLocaleString()}</span>
          </div>
          <div className="financial-stat-box">
            <span className="stat-label">Released Payouts</span>
            <span className="stat-value">${releasedSum.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Milestones Section Header */}
      <div className="workspace-section-header">
        <div>
          <span className="surface-tag">Contract Deliverables</span>
          <h3>Milestone Execution Journeys ({milestones.length})</h3>
        </div>

        <button className="btn btn-primary glowing-btn" onClick={() => setIsAddMilestoneOpen(true)}>
          <Plus size={16} /> Add Contract Milestone
        </button>
      </div>

      {/* Milestone Journeys Stack */}
      {milestones.length === 0 ? (
        <div className="empty-surface-note text-center py-5">
          No milestones defined for this contract yet. Click "Add Contract Milestone" to break down project deliverables.
        </div>
      ) : (
        <div className="milestone-journeys-stack">
          {milestones.map((m) => (
            <MilestoneJourney
              key={m.id}
              milestone={m}
              onDeliver={(id) => handleUpdateStatus(id, 'DELIVERED')}
              onApprove={(id) => handleUpdateStatus(id, 'APPROVED')}
              onRework={(id) => handleUpdateStatus(id, 'REWORK')}
              onRelease={(id) => {
                const targetM = milestones.find(item => item.id === id);
                setReleaseMilestone(targetM);
                setIsReleaseOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Multi-Step Payment Release Sequence Modal */}
      <ReleaseModalSequence
        milestone={releaseMilestone}
        isOpen={isReleaseOpen}
        onClose={() => {
          setIsReleaseOpen(false);
          setReleaseMilestone(null);
        }}
        onConfirmRelease={handleConfirmReleasePayment}
      />

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isAddMilestoneOpen}
        onClose={() => setIsAddMilestoneOpen(false)}
        title="Add Contract Milestone"
      >
        <form onSubmit={handleCreateMilestone}>
          <div className="form-group mb-3">
            <label>Milestone Title *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. UI/UX Prototype Design"
              value={mTitle}
              onChange={(e) => setMTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Escrow Amount ($ USD) *</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="1500"
              value={mAmount}
              onChange={(e) => setMAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label>Scope & Deliverable Description</label>
            <textarea 
              className="form-control" 
              rows={3}
              placeholder="Describe deliverables required for approval..."
              value={mDesc}
              onChange={(e) => setMDesc(e.target.value)}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddMilestoneOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary glowing-btn" disabled={savingMilestone}>
              {savingMilestone ? 'Adding...' : 'Add Milestone to Contract'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
