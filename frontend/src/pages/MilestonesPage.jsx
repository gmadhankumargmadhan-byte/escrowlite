import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Send, 
  CheckCircle2, 
  RotateCcw, 
  DollarSign, 
  Target, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Briefcase,
  Users,
  UserCheck
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import ReleaseModalSequence from '../components/ui/ReleaseModalSequence';
import { useToast } from '../context/ToastContext';
import { milestoneApi, releaseApi } from '../api/escrowApi';
import { useTilt } from '../hooks/useTilt';

function MilestoneCardItem({ 
  milestone, 
  project, 
  client, 
  freelancer, 
  onDeliver, 
  onApprove, 
  onRework, 
  onRelease, 
  onEdit, 
  onDelete, 
  loading 
}) {
  const [expanded, setExpanded] = useState(false);
  const { tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useTilt(5);

  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(milestone.amount || 0);

  const status = milestone.status || 'PENDING';

  const getStepIndex = (st) => {
    switch (st) {
      case 'PENDING': return 0;
      case 'DELIVERED': return 1;
      case 'APPROVED': return 2;
      case 'RELEASED': return 3;
      case 'REWORK': return 1;
      default: return 0;
    }
  };

  const activeStep = getStepIndex(status);

  return (
    <div 
      className="milestone-spatial-card"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={glareStyle} />

      <div className="milestone-card-main" onClick={() => setExpanded(!expanded)}>
        <div className="card-left-info">
          <div className="badge-row">
            <span className={`status-pill status-${status.toLowerCase()}`}>
              {status}
            </span>
            <span className="milestone-id-tag">#MS-{milestone.id}</span>
          </div>

          <h3 className="milestone-card-title">{milestone.title}</h3>
          
          <div className="milestone-project-sub">
            <Briefcase size={13} />
            <span>{project ? project.title : `Project #${milestone.projectId}`}</span>
          </div>
        </div>

        <div className="card-right-info">
          <span className="milestone-price-tag font-emerald">{formattedAmount}</span>
          <button className="expand-toggle-btn">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Smooth Expandable Workspace Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="milestone-card-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {milestone.description && (
              <p className="expanded-desc">{milestone.description}</p>
            )}

            {/* Connected Parties & Flow Nodes */}
            <div className="expanded-flow-box">
              <div className="flow-party-item">
                <Users size={14} className="text-indigo" />
                <span>Client: <strong>{client?.name || 'Unassigned'}</strong></span>
              </div>
              <div className="flow-party-item">
                <UserCheck size={14} className="text-emerald" />
                <span>Freelancer: <strong>{freelancer?.name || 'Unassigned'}</strong></span>
              </div>
            </div>

            {/* Interactive Step Progress Path */}
            <div className="expanded-steps-row">
              <div className={`mini-step ${activeStep >= 0 ? 'active' : ''}`}>
                <span className="mini-step-dot" /> <span>Pending</span>
              </div>
              <div className={`mini-step ${activeStep >= 1 ? 'active' : ''}`}>
                <span className="mini-step-dot" /> <span>Delivered</span>
              </div>
              <div className={`mini-step ${activeStep >= 2 ? 'active' : ''}`}>
                <span className="mini-step-dot" /> <span>Approved</span>
              </div>
              <div className={`mini-step ${activeStep >= 3 ? 'active' : ''}`}>
                <span className="mini-step-dot" /> <span>Released</span>
              </div>
            </div>

            {/* Status Dependent Actions Bar */}
            <div className="expanded-actions-bar">
              <div className="lifecycle-btn-group">
                {(status === 'PENDING' || status === 'REWORK') && (
                  <button 
                    className="btn btn-primary btn-sm glowing-btn"
                    onClick={(e) => { e.stopPropagation(); onDeliver(milestone.id); }}
                    disabled={loading}
                  >
                    <Send size={14} /> Deliver Deliverable
                  </button>
                )}

                {status === 'DELIVERED' && (
                  <>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={(e) => { e.stopPropagation(); onRework(milestone.id); }}
                      disabled={loading}
                    >
                      <RotateCcw size={14} /> Request Rework
                    </button>
                    <button 
                      className="btn btn-success btn-sm glowing-btn"
                      onClick={(e) => { e.stopPropagation(); onApprove(milestone.id); }}
                      disabled={loading}
                    >
                      <CheckCircle2 size={14} /> Approve Deliverable
                    </button>
                  </>
                )}

                {status === 'APPROVED' && (
                  <button 
                    className="btn btn-emerald btn-sm glowing-btn"
                    onClick={(e) => { e.stopPropagation(); onRelease(milestone); }}
                    disabled={loading}
                  >
                    <DollarSign size={14} /> Release Payment
                  </button>
                )}

                {status === 'RELEASED' && (
                  <span className="text-emerald font-size-sm font-weight-700 flex-align-center gap-1">
                    <CheckCircle2 size={16} /> Funds Disbursed to Freelancer
                  </span>
                )}
              </div>

              <div className="manage-btn-group">
                <button 
                  className="btn btn-secondary btn-xs" 
                  onClick={(e) => { e.stopPropagation(); onEdit(milestone); }}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button 
                  className="btn btn-danger btn-xs" 
                  onClick={(e) => { e.stopPropagation(); onDelete(milestone.id); }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MilestonesPage({ milestones = [], projects = [], clients = [], freelancers = [], loading, onRefresh, searchTerm: globalSearch }) {
  const toast = useToast();
  const [localSearch, setLocalSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingM, setEditingM] = useState(null);
  const [form, setForm] = useState({ projectId: '', title: '', description: '', amount: '' });
  const [saving, setSaving] = useState(false);

  // Release Modal Sequence State
  const [releaseMilestone, setReleaseMilestone] = useState(null);
  const [isReleaseOpen, setIsReleaseOpen] = useState(false);

  // Confirm Delete
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const query = (localSearch || globalSearch || '').toLowerCase();
  const filteredMilestones = milestones.filter((m) => 
    m.title?.toLowerCase().includes(query) ||
    m.description?.toLowerCase().includes(query) ||
    m.status?.toLowerCase().includes(query)
  );

  const handleOpenCreate = () => {
    setEditingM(null);
    setForm({ projectId: projects[0]?.id || '', title: '', description: '', amount: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (m) => {
    setEditingM(m);
    setForm({
      projectId: m.projectId || '',
      title: m.title || '',
      description: m.description || '',
      amount: m.amount || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) {
      toast.error('Title and amount are required');
      return;
    }

    setSaving(true);
    try {
      if (editingM) {
        await milestoneApi.update(editingM.id, {
          title: form.title,
          description: form.description,
          amount: parseFloat(form.amount),
        });
        toast.success(`Milestone "${form.title}" updated.`);
      } else {
        await milestoneApi.createForProject(parseInt(form.projectId), {
          title: form.title,
          description: form.description,
          amount: parseFloat(form.amount),
        });
        toast.success(`Milestone "${form.title}" created.`);
      }
      setShowModal(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save milestone');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await milestoneApi.delete(deletingId);
      toast.success('Milestone deleted.');
      setDeletingId(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete milestone');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeliver = async (id) => {
    try {
      await milestoneApi.deliver(id);
      toast.success('Deliverables submitted successfully!');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Action failed');
    }
  };

  const handleApprove = async (id) => {
    try {
      await milestoneApi.approve(id);
      toast.success('Deliverable approved by client!');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Action failed');
    }
  };

  const handleRework = async (id) => {
    try {
      await milestoneApi.rework(id);
      toast.warning('Revision requested from freelancer.');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Action failed');
    }
  };

  const handleConfirmReleasePayment = async (milestoneId) => {
    try {
      await releaseApi.createRelease({ milestoneId });
      toast.success('Escrow Payment RELEASED successfully!');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Payment release failed');
      throw err;
    }
  };

  return (
    <div className="directory-page-layout">
      {/* Header Bar */}
      <div className="directory-header-bar">
        <div>
          <span className="surface-tag">Interactive Workflow Hub</span>
          <h2>Milestone Deliverables Workspace</h2>
        </div>

        <div className="header-actions-group">
          <div className="directory-search-input">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search milestones by title, status..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <button className="btn btn-primary glowing-btn" onClick={handleOpenCreate}>
            <Plus size={16} /> Add Milestone
          </button>
        </div>
      </div>

      {/* Milestones Stack */}
      {loading && milestones.length === 0 ? (
        <SkeletonLoader type="card" height={100} count={4} />
      ) : filteredMilestones.length === 0 ? (
        <div className="empty-surface-note text-center py-5">
          No milestone deliverables match your search query.
        </div>
      ) : (
        <div className="milestones-spatial-stack">
          {filteredMilestones.map((m) => {
            const proj = projects.find((p) => p.id === (m.projectId || m.project?.id));
            const clientObj = clients.find((c) => c.id === (proj?.client?.id || proj?.clientId));
            const freeObj = freelancers.find((f) => f.id === (proj?.freelancer?.id || proj?.freelancerId));

            return (
              <MilestoneCardItem
                key={m.id}
                milestone={m}
                project={proj}
                client={clientObj}
                freelancer={freeObj}
                onDeliver={handleDeliver}
                onApprove={handleApprove}
                onRework={handleRework}
                onRelease={(item) => {
                  setReleaseMilestone(item);
                  setIsReleaseOpen(true);
                }}
                onEdit={handleOpenEdit}
                onDelete={(id) => setDeletingId(id)}
                loading={loading}
              />
            );
          })}
        </div>
      )}

      {/* Multi-Step Release Sequence Modal */}
      <ReleaseModalSequence
        milestone={releaseMilestone}
        isOpen={isReleaseOpen}
        onClose={() => {
          setIsReleaseOpen(false);
          setReleaseMilestone(null);
        }}
        onConfirmRelease={handleConfirmReleasePayment}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingM ? 'Edit Milestone' : 'Add New Milestone'}
      >
        <form onSubmit={handleSubmit}>
          {!editingM && (
            <div className="form-group mb-3">
              <label>Select Project Contract *</label>
              <select
                className="form-control"
                required
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              >
                <option value="">-- Choose Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (#{p.id})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group mb-3">
            <label>Milestone Title *</label>
            <input
              className="form-control"
              required
              placeholder="e.g. Backend API Endpoint Implementation"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label>Scope & Requirements Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Scope of work and deliverables..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-group mb-4">
            <label>Escrow Amount ($ USD) *</label>
            <input
              type="number"
              className="form-control"
              required
              placeholder="1500.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="modal-actions-row">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary glowing-btn" disabled={saving}>
              {saving ? 'Saving...' : editingM ? 'Update Milestone' : 'Create Milestone'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Milestone"
        message="Are you sure you want to delete this milestone? Escrow allocation will be released."
        confirmText="Delete"
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
}
