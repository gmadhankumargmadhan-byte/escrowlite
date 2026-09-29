import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Mail, Phone, Building, Briefcase, ChevronRight, User } from 'lucide-react';
import ClientDrawer from '../components/ui/ClientDrawer';
import Modal from '../components/ui/Modal';
import { clientApi } from '../api/escrowApi';
import { useToast } from '../context/ToastContext';
import { useTilt } from '../hooks/useTilt';

function ClientCard({ client, projects, onOpenDrawer }) {
  const { tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useTilt(8);
  const clientProjects = projects.filter(p => p.client?.id === client.id || p.clientId === client.id);

  return (
    <div 
      className="spatial-directory-card"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenDrawer(client)}
    >
      <div style={glareStyle} />
      
      <div className="card-top-row">
        <div className="avatar-circle client-avatar">
          {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
        </div>
        <span className="badge badge-indigo">{clientProjects.length} Projects</span>
      </div>

      <h4 className="card-name-title">{client.name}</h4>

      <div className="card-details-stack">
        <div className="detail-line">
          <Mail size={14} /> <span>{client.email || 'No email specified'}</span>
        </div>
        {client.company && (
          <div className="detail-line">
            <Building size={14} /> <span>{client.company}</span>
          </div>
        )}
      </div>

      <div className="card-footer-action">
        <span>View Full Portfolio</span>
        <ChevronRight size={14} />
      </div>
    </div>
  );
}

export default function ClientsPage({ clients = [], projects = [], loading, onRefresh, searchTerm: globalSearch, onNavigate }) {
  const toast = useToast();
  const [localSearch, setLocalSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Client Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [saving, setSaving] = useState(false);

  const query = (localSearch || globalSearch || '').toLowerCase();
  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(query) || 
    c.email?.toLowerCase().includes(query) ||
    c.company?.toLowerCase().includes(query)
  );

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }

    setSaving(true);
    try {
      await clientApi.create({ name, email, phone, company });
      toast.success('Client registered successfully!');
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to create client');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="directory-page-layout">
      {/* Header Bar */}
      <div className="directory-header-bar">
        <div>
          <span className="surface-tag">Directory</span>
          <h2>Client Organizations</h2>
        </div>

        <div className="header-actions-group">
          <div className="directory-search-input">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search clients by name, email, company..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <button className="btn btn-primary glowing-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Register Client
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredClients.length === 0 ? (
        <div className="empty-surface-note text-center py-5">
          No client records match your search query.
        </div>
      ) : (
        <div className="directory-cards-grid">
          {filteredClients.map(client => (
            <ClientCard 
              key={client.id} 
              client={client} 
              projects={projects}
              onOpenDrawer={(c) => setSelectedClient(c)}
            />
          ))}
        </div>
      )}

      {/* Client Detail Side Drawer */}
      <ClientDrawer 
        client={selectedClient}
        projects={projects}
        onClose={() => setSelectedClient(null)}
        onNavigateToProject={onNavigate}
      />

      {/* Register Client Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Register New Client"
      >
        <form onSubmit={handleCreateClient}>
          <div className="form-group mb-3">
            <label>Full Name *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Email Address *</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="sarah@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Company / Organization</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Acme Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label>Phone Number</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="+1 (555) 019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary glowing-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Register Client'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
