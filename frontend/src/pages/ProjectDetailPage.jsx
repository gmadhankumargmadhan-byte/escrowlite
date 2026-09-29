import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/ui/StatusBadge';
import MilestoneTimeline from '../components/ui/MilestoneTimeline';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { 
  ArrowLeft, 
  Plus, 
  DollarSign, 
  User, 
  UserCheck, 
  CheckCircle2, 
  Send, 
  RotateCcw, 
  Lock 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { projectApi, milestoneApi } from '../api/escrowApi';

export default function ProjectDetailPage({ projectId, onBack, clients, freelancers, onRefreshAll }) {
  const toast = useToast();
  const [project, setProject] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);

  // Milestone Add Modal
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [mForm, setMForm] = useState({ title: '', description: '', amount: '' });
  const [savingM, setSavingM] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectDetail();
    }
  }, [projectId]);

  const loadProjectDetail = async () => {
    setLoading(true);
    try {
      const [pRes, eRes] = await Promise.all([
        projectApi.getById(projectId),
        projectApi.getEscrow(projectId),
      ]);
      setProject(pRes.data);
      setEscrow(eRes.data);
    } catch (err) {
      toast.error('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    setSavingM(true);
    try {
      const payload = {
        title: mForm.title,
        description: mForm.description,
        amount: parseFloat(mForm.amount),
      };
      await milestoneApi.createForProject(projectId, payload);
      toast.success(`Milestone "${mForm.title}" added to project.`);
      setMForm({ title: '', description: '', amount: '' });
      setShowMilestoneModal(false);
      loadProjectDetail();
      onRefreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create milestone');
    } finally {
      setSavingM(false);
    }
  };

  const handleDeliver = async (mId) => {
    try {
      await milestoneApi.deliver(mId);
      toast.success('Milestone marked as DELIVERED.');
      loadProjectDetail();
      onRefreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleApprove = async (mId) => {
    try {
      await milestoneApi.approve(mId);
      toast.success('Milestone APPROVED by client.');
      loadProjectDetail();
      onRefreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleRework = async (mId) => {
    try {
      await milestoneApi.rework(mId);
      toast.warning('Rework requested for milestone.');
      loadProjectDetail();
      onRefreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleRelease = async (mId) => {
    try {
      await milestoneApi.release(mId);
      toast.success('Payment released from Escrow!');
      loadProjectDetail();
      onRefreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return (
      <div>
        <button className="btn btn-secondary mb-4" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <SkeletonLoader type="card" rows={3} />
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <button className="btn btn-secondary mb-4" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <EmptyState title="Project Not Found" message="The requested project details could not be retrieved." />
      </div>
    );
  }

  const client = clients.find((c) => c.id === project.clientId);
  const freelancer = freelancers.find((f) => f.id === project.freelancerId);

  return (
    <div className="project-detail-page">
      {/* Top Header */}
      <div className="mb-4">
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Projects
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 className="card-title">{project.title}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="card-subtitle">{project.description || 'No description provided.'}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowMilestoneModal(true)}>
            <Plus size={16} /> Add Milestone
          </button>
        </div>

        {/* Project Info Cards Grid */}
        <div className="stats-grid mb-4">
          <div className="stat-card">
            <div className="stat-title">Client Account</div>
            <div className="stat-value font-size-md">
              <User size={16} className="text-muted" /> {client ? client.name : `ID #${project.clientId}`}
            </div>
            <div className="stat-subtext">{client?.email || ''}</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Assigned Freelancer</div>
            <div className="stat-value font-size-md">
              <UserCheck size={16} className="text-muted" /> {freelancer ? freelancer.name : `ID #${project.freelancerId}`}
            </div>
            <div className="stat-subtext">{freelancer?.email || ''}</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Total Project Budget</div>
            <div className="stat-value color-success">${project.totalAmount?.toLocaleString()}</div>
            <div className="stat-subtext">Fixed Price Escrow</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Escrow Released / Remaining</div>
            <div className="stat-value">
              ${escrow?.totalReleased?.toLocaleString() || 0} / ${escrow?.remainingEscrow?.toLocaleString() || 0}
            </div>
            <div className="stat-subtext">Disbursed vs Held</div>
          </div>
        </div>

        {/* Milestones Timeline Breakdown */}
        <h3 className="section-heading mb-3">Project Milestones & Escrow Status</h3>

        {project.milestones && project.milestones.length > 0 ? (
          <div className="milestones-detail-list">
            {project.milestones.map((m) => (
              <div key={m.id} className="milestone-detail-card card">
                <div className="card-header mb-2">
                  <div>
                    <h4 className="font-weight-600">{m.title}</h4>
                    <p className="text-muted text-xs">{m.description}</p>
                  </div>
                  <div className="font-weight-700 color-success font-size-md">${m.amount?.toLocaleString()}</div>
                </div>

                {/* Milestone Lifecycle Timeline */}
                <MilestoneTimeline status={m.status} />

                {/* Context Action Buttons */}
                <div className="milestone-actions-row mt-3">
                  {m.status === 'PENDING' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleDeliver(m.id)}>
                      <Send size={14} /> Deliver Work
                    </button>
                  )}
                  {m.status === 'DELIVERED' && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => handleApprove(m.id)}>
                        <CheckCircle2 size={14} /> Approve Work
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRework(m.id)}>
                        <RotateCcw size={14} /> Request Rework
                      </button>
                    </>
                  )}
                  {m.status === 'APPROVED' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleRelease(m.id)}>
                      <DollarSign size={14} /> Release Payment from Escrow
                    </button>
                  )}
                  {m.status === 'RELEASED' && (
                    <div className="text-muted text-xs color-success font-weight-600">
                      ✓ Funds Disbursed to Freelancer
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Milestones Created"
            message="Add milestones to break down project deliverables and release escrow funds incrementally."
            actionLabel="Add First Milestone"
            onAction={() => setShowMilestoneModal(true)}
          />
        )}
      </div>

      {/* Add Milestone Modal */}
      <Modal isOpen={showMilestoneModal} onClose={() => setShowMilestoneModal(false)} title="Add Project Milestone">
        <form onSubmit={handleCreateMilestone}>
          <div className="form-group">
            <label>Milestone Title <span className="text-danger">*</span></label>
            <input
              className="form-control"
              required
              placeholder="e.g. Phase 1 Architecture Setup"
              value={mForm.title}
              onChange={(e) => setMForm({ ...mForm, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Deliverables for this milestone..."
              value={mForm.description}
              onChange={(e) => setMForm({ ...mForm, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Milestone Amount ($) <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              required
              placeholder="2500.00"
              value={mForm.amount}
              onChange={(e) => setMForm({ ...mForm, amount: e.target.value })}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowMilestoneModal(false)} disabled={savingM}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingM}>
              {savingM ? 'Adding...' : 'Add Milestone'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
