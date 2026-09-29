import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { Plus, Trash2, Edit2, Mail, Code, DollarSign, UserCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { freelancerApi } from '../api/escrowApi';

export default function FreelancersPage({ freelancers, loading, onRefresh, searchTerm }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingFreelancer, setEditingFreelancer] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', skills: '', hourlyRate: '' });
  const [saving, setSaving] = useState(false);

  // Confirm Delete
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredFreelancers = freelancers.filter((f) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      f.name?.toLowerCase().includes(term) ||
      f.email?.toLowerCase().includes(term) ||
      f.skills?.toLowerCase().includes(term)
    );
  });

  const handleOpenCreate = () => {
    setEditingFreelancer(null);
    setForm({ name: '', email: '', skills: '', hourlyRate: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (f) => {
    setEditingFreelancer(f);
    setForm({
      name: f.name || '',
      email: f.email || '',
      skills: f.skills || '',
      hourlyRate: f.hourlyRate || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : null,
      };

      if (editingFreelancer) {
        await freelancerApi.update(editingFreelancer.id, payload);
        toast.success(`Freelancer "${form.name}" updated successfully.`);
      } else {
        await freelancerApi.create(payload);
        toast.success(`Freelancer "${form.name}" registered successfully.`);
      }
      setShowModal(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save freelancer');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await freelancerApi.delete(deletingId);
      toast.success('Freelancer deleted successfully.');
      setDeletingId(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete freelancer');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="freelancers-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Freelancer Directory</h2>
            <p className="card-subtitle">Manage registered contractors, skills, and rates</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add Freelancer
          </button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Freelancer</th>
                <th>Email</th>
                <th>Skills & Tech Stack</th>
                <th>Hourly Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading && freelancers.length === 0 ? (
              <SkeletonLoader type="table" rows={5} cols={6} />
            ) : (
              <tbody>
                {filteredFreelancers.map((f) => (
                  <tr key={f.id}>
                    <td>#{f.id}</td>
                    <td>
                      <div className="font-weight-600">{f.name}</div>
                    </td>
                    <td>
                      <div className="table-cell-icon">
                        <Mail size={14} className="text-muted" /> {f.email}
                      </div>
                    </td>
                    <td>
                      {f.skills ? (
                        <div className="skills-badge-group">
                          {f.skills.split(',').map((skill, idx) => (
                            <span key={idx} className="skill-tag">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted text-xs">Unspecified</span>
                      )}
                    </td>
                    <td>
                      <div className="font-weight-600 color-success">
                        {f.hourlyRate ? `$${f.hourlyRate}/hr` : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(f)}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeletingId(f.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredFreelancers.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6">
                      <EmptyState
                        icon={UserCheck}
                        title="No Freelancers Found"
                        message="Register contractors to assign them to escrow projects."
                        actionLabel="Add Freelancer"
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

      {/* Add / Edit Freelancer Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingFreelancer ? 'Edit Freelancer' : 'Add New Freelancer'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Freelancer Name <span className="text-danger">*</span></label>
            <input
              className="form-control"
              required
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email Address <span className="text-danger">*</span></label>
            <input
              type="email"
              className="form-control"
              required
              placeholder="jane.doe@dev.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Skills & Tech Stack (Comma separated)</label>
            <input
              className="form-control"
              placeholder="Java, Spring Boot, React, TypeScript"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Hourly Rate ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="85.00"
              value={form.hourlyRate}
              onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingFreelancer ? 'Update Freelancer' : 'Register Freelancer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Freelancer"
        message="Are you sure you want to remove this freelancer from the platform?"
        confirmText="Delete"
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
}
