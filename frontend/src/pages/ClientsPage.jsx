import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { Plus, Trash2, Edit2, Mail, Phone, Users } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { clientApi } from '../api/escrowApi';

export default function ClientsPage({ clients, loading, onRefresh, searchTerm }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  // Confirm Delete
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filteredClients = clients.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term)
    );
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setForm({ name: '', email: '', phone: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingClient(c);
    setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingClient) {
        await clientApi.update(editingClient.id, form);
        toast.success(`Client "${form.name}" updated successfully.`);
      } else {
        await clientApi.create(form);
        toast.success(`Client "${form.name}" created successfully.`);
      }
      setShowModal(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save client');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await clientApi.delete(deletingId);
      toast.success('Client deleted successfully.');
      setDeletingId(null);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete client');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="clients-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Client Registry</h2>
            <p className="card-subtitle">Manage project clients and contact details</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add Client
          </button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading && clients.length === 0 ? (
              <SkeletonLoader type="table" rows={5} cols={5} />
            ) : (
              <tbody>
                {filteredClients.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>
                      <div className="font-weight-600">{c.name}</div>
                    </td>
                    <td>
                      <div className="table-cell-icon">
                        <Mail size={14} className="text-muted" /> {c.email}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-icon">
                        <Phone size={14} className="text-muted" /> {c.phone || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(c)}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeletingId(c.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5">
                      <EmptyState
                        icon={Users}
                        title="No Clients Found"
                        message="Get started by adding your first project client."
                        actionLabel="Add Client"
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

      {/* Add / Edit Client Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Client Name <span className="text-danger">*</span></label>
            <input 
              className="form-control" 
              required 
              placeholder="e.g. Acme Corporation"
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
              placeholder="client@acme.com"
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              className="form-control" 
              placeholder="+1 (555) 019-2834"
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingClient ? 'Update Client' : 'Create Client'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? Associated projects may be affected."
        confirmText="Delete"
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
}
