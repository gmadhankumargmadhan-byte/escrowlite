import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { Plus, Trash2, Edit2, Send, CheckCircle2, RotateCcw, DollarSign, Target } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { milestoneApi } from '../api/escrowApi';

export default function MilestonesPage({ milestones, projects, loading, onRefresh, searchTerm }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingM, setEditingM] = useState(null);
  const [form, setForm] = useState({ projectId: '', title: '', description: '', amount: '' });
  const [saving, setSaving] = useState(false);

  // Confirm Delete
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredMilestones = milestones.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.title?.toLowerCase().includes(term) ||
      m.description?.toLowerCase().includes(term) ||
      m.status?.toLowerCase().includes(term)
    );
  });

  const handleOpenCreate = () => {
    setEditingM(null);
    setForm({ projectId: '', title: '', description: '', amount: '' });
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
      toast.error(err.response?.data?.message || 'Failed to save milestone');
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
      toast.error(err.response?.data?.message || 'Failed to delete milestone');
    } finally {
      setDeleting(false);
    }
  };

  // Actions
  const handleDeliver = async (id) => {
    try {
      await milestoneApi.deliver(id);
      toast.success('Milestone DELIVERED.');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleApprove = async (id) => {
    try {
      await milestoneApi.approve(id);
      toast.success('Milestone APPROVED.');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleRework = async (id) => {
    try {
      await milestoneApi.rework(id);
      toast.warning('REWORK requested.');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleRelease = async (id) => {
    try {
      await milestoneApi.release(id);
      toast.success('Escrow Payment RELEASED successfully!');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="milestones-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Milestones & Action Hub</h2>
            <p className="card-subtitle">Manage deliverable statuses and release escrow payments</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add Milestone
          </button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Milestone Deliverable</th>
                <th>Escrow Amount</th>
                <th>Status</th>
                <th>Lifecycle Action</th>
                <th>Manage</th>
              </tr>
            </thead>
            {loading && milestones.length === 0 ? (
              <SkeletonLoader type="table" rows={5} cols={7} />
            ) : (
              <tbody>
                {filteredMilestones.map((m) => {
                  const proj = projects.find((p) => p.id === m.projectId);

                  return (
                    <tr key={m.id}>
                      <td>#{m.id}</td>
                      <td>
                        <div className="font-weight-600">{proj ? proj.title : `Project #${m.projectId}`}</div>
                      </td>
                      <td>
                        <div className="font-weight-600">{m.title}</div>
                        <div className="text-muted text-xs">{m.description || 'No details'}</div>
                      </td>
                      <td>
                        <div className="font-weight-600 color-success">
                          ${m.amount?.toLocaleString()}
                        </div>
                      </td>
                      <td><StatusBadge status={m.status} /></td>
                      <td>
                        <div className="action-buttons">
                          {m.status === 'PENDING' && (
                            <button className="btn btn-secondary btn-sm" onClick={() => handleDeliver(m.id)}>
                              <Send size={12} /> Deliver
                            </button>
                          )}
                          {m.status === 'DELIVERED' && (
                            <>
                              <button className="btn btn-success btn-sm" onClick={() => handleApprove(m.id)}>
                                <CheckCircle2 size={12} /> Approve
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleRework(m.id)}>
                                <RotateCcw size={12} /> Rework
                              </button>
                            </>
                          )}
                          {m.status === 'APPROVED' && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleRelease(m.id)}>
                              <DollarSign size={12} /> Release Payment
                            </button>
                          )}
                          {m.status === 'RELEASED' && (
                            <span className="text-muted text-xs font-weight-600 color-success">
                              ✓ Disbursed
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(m)}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeletingId(m.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredMilestones.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7">
                      <EmptyState
                        icon={Target}
                        title="No Milestones Found"
                        message="Add milestones to project contracts to initiate deliverable tracking."
                        actionLabel="Add Milestone"
                        onAction={handleOpenCreate}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingM ? 'Edit Milestone' : 'Add New Milestone'}
      >
        <form onSubmit={handleSubmit}>
          {!editingM && (
            <div className="form-group">
              <label>Select Project <span className="text-danger">*</span></label>
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
          <div className="form-group">
            <label>Milestone Title <span className="text-danger">*</span></label>
            <input
              className="form-control"
              required
              placeholder="e.g. Backend API Endpoint Implementation"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Scope of work and deliverables..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Amount ($) <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              required
              placeholder="1500.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
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
        message="Are you sure you want to delete this milestone?"
        confirmText="Delete"
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
}
