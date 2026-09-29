import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { Plus, Trash2, Eye, FolderKanban, Calendar, DollarSign, User, UserCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { projectApi } from '../api/escrowApi';

export default function ProjectsPage({ 
  projects, 
  clients, 
  freelancers, 
  loading, 
  onRefresh, 
  searchTerm, 
  onNavigate 
}) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [form, setProjectForm] = useState({
    title: '',
    description: '',
    totalAmount: '',
    clientId: '',
    freelancerId: '',
  });
  const [saving, setSaving] = useState(false);

  // Confirm Delete
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = !searchTerm || (
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === 'ALL' || p.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setProjectForm({ title: '', description: '', totalAmount: '', clientId: '', freelancerId: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        totalAmount: parseFloat(form.totalAmount),
        clientId: parseInt(form.clientId),
        freelancerId: parseInt(form.freelancerId),
        milestones: [],
      };
      await projectApi.create(payload);
      toast.success(`Project "${form.title}" created successfully.`);
      setShowModal(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await projectApi.delete(deletingId);
      toast.success('Project deleted successfully.');
      setDeletingId(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="projects-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Project Workspace</h2>
            <p className="card-subtitle">Manage freelance projects, assignments, and budgets</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Create Project
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="filter-bar">
          {['ALL', 'CREATED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Project Title & Description</th>
                <th>Escrow Budget</th>
                <th>Client</th>
                <th>Freelancer</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading && projects.length === 0 ? (
              <SkeletonLoader type="table" rows={5} cols={8} />
            ) : (
              <tbody>
                {filteredProjects.map((p) => {
                  const client = clients.find((c) => c.id === p.clientId);
                  const freelancer = freelancers.find((f) => f.id === p.freelancerId);

                  return (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>
                        <div className="font-weight-600">{p.title}</div>
                        <div className="text-muted text-xs">{p.description || 'No description'}</div>
                      </td>
                      <td>
                        <div className="font-weight-600 color-success">
                          ${p.totalAmount?.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-icon">
                          <User size={14} className="text-muted" />
                          {client ? client.name : `Client #${p.clientId}`}
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-icon">
                          <UserCheck size={14} className="text-muted" />
                          {freelancer ? freelancer.name : `Freelancer #${p.freelancerId}`}
                        </div>
                      </td>
                      <td><StatusBadge status={p.status} /></td>
                      <td>
                        <div className="table-cell-icon text-muted text-xs">
                          <Calendar size={13} />
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onNavigate('project-detail', p.id)}
                            title="View Project Details"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeletingId(p.id)}
                            title="Delete Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredProjects.length === 0 && !loading && (
                  <tr>
                    <td colSpan="8">
                      <EmptyState
                        icon={FolderKanban}
                        title="No Projects Found"
                        message="Create a new milestone project to get started."
                        actionLabel="Create Project"
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

      {/* Create Project Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title <span className="text-danger">*</span></label>
            <input
              className="form-control"
              required
              placeholder="e.g. E-Commerce Payment Gateway Integration"
              value={form.title}
              onChange={(e) => setProjectForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Brief description of contract scope and deliverables..."
              value={form.description}
              onChange={(e) => setProjectForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Total Escrow Budget ($) <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              required
              placeholder="5000.00"
              value={form.totalAmount}
              onChange={(e) => setProjectForm({ ...form, totalAmount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Select Client <span className="text-danger">*</span></label>
            <select
              className="form-control"
              required
              value={form.clientId}
              onChange={(e) => setProjectForm({ ...form, clientId: e.target.value })}
            >
              <option value="">-- Choose Client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (#{c.id})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Assign Freelancer <span className="text-danger">*</span></label>
            <select
              className="form-control"
              required
              value={form.freelancerId}
              onChange={(e) => setProjectForm({ ...form, freelancerId: e.target.value })}
            >
              <option value="">-- Choose Freelancer --</option>
              {freelancers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} (#{f.id})
                </option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated milestones and escrow data will be permanently deleted."
        confirmText="Delete Project"
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
}
