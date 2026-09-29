import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Briefcase, DollarSign, ChevronRight, UserCheck, Users, ShieldCheck } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { projectApi } from '../api/escrowApi';
import { useToast } from '../context/ToastContext';
import { useTilt } from '../hooks/useTilt';

function SpatialProjectCard({ project, client, freelancer, onNavigate }) {
  const { tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useTilt(8);
  const formattedBudget = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(project.budget || 0);

  return (
    <div 
      className="spatial-project-surface"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onNavigate('project-detail', project.id)}
    >
      <div style={glareStyle} />
      
      <div className="surface-top-bar">
        <span className={`status-pill status-${project.status?.toLowerCase()}`}>
          {project.status || 'ACTIVE'}
        </span>
        <span className="surface-price font-emerald">{formattedBudget}</span>
      </div>

      <h3 className="project-surface-title">{project.title}</h3>
      {project.description && (
        <p className="project-surface-desc">{project.description}</p>
      )}

      {/* Connected Parties Chips */}
      <div className="parties-chips-row">
        <div className="party-chip">
          <Users size={13} />
          <span>Client: {client?.name || 'Unassigned'}</span>
        </div>
        <div className="party-chip">
          <UserCheck size={13} />
          <span>Freelancer: {freelancer?.name || 'Unassigned'}</span>
        </div>
      </div>

      <div className="surface-footer-bar">
        <span className="open-workspace-btn">
          Open Workspace <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}

export default function ProjectsPage({ 
  projects = [], 
  clients = [], 
  freelancers = [], 
  loading, 
  onRefresh, 
  searchTerm: globalSearch, 
  onNavigate 
}) {
  const toast = useToast();
  const [localSearch, setLocalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [clientId, setClientId] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [saving, setSaving] = useState(false);

  const query = (localSearch || globalSearch || '').toLowerCase();
  const filtered = projects.filter(p => 
    p.title?.toLowerCase().includes(query) || 
    p.description?.toLowerCase().includes(query)
  );

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title || !budget) {
      toast.error('Title and budget are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        description,
        budget: parseFloat(budget),
        status: 'ACTIVE',
        clientId: clientId ? parseInt(clientId) : null,
        freelancerId: freelancerId ? parseInt(freelancerId) : null,
      };

      await projectApi.create(payload);
      toast.success('Project contract initiated successfully!');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setBudget('');
      setClientId('');
      setFreelancerId('');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to create project contract');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="directory-page-layout">
      {/* Page Header */}
      <div className="directory-header-bar">
        <div>
          <span className="surface-tag">Workspaces</span>
          <h2>Project Escrow Contracts</h2>
        </div>

        <div className="header-actions-group">
          <div className="directory-search-input">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search contracts by title, description..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <button className="btn btn-primary glowing-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Initiate Project Contract
          </button>
        </div>
      </div>

      {/* Projects Spatial Grid */}
      {filtered.length === 0 ? (
        <div className="empty-surface-note text-center py-5">
          No project contracts match your search filter.
        </div>
      ) : (
        <div className="projects-spatial-grid">
          {filtered.map(proj => {
            const clientObj = clients.find(c => c.id === (proj.client?.id || proj.clientId));
            const freeObj = freelancers.find(f => f.id === (proj.freelancer?.id || proj.freelancerId));

            return (
              <SpatialProjectCard
                key={proj.id}
                project={proj}
                client={clientObj}
                freelancer={freeObj}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      )}

      {/* Initiate Project Modal */}
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initiate New Project Contract"
      >
        <form onSubmit={handleCreateProject}>
          <div className="form-group mb-3">
            <label>Project Title *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Mobile App MVP Development"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Contract Budget ($ USD) *</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Select Client</label>
            <select 
              className="form-control"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">-- Choose Client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.company || c.email})</option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label>Assign Freelancer</label>
            <select 
              className="form-control"
              value={freelancerId}
              onChange={(e) => setFreelancerId(e.target.value)}
            >
              <option value="">-- Choose Freelancer --</option>
              {freelancers.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.skills || f.email})</option>
              ))}
            </select>
          </div>

          <div className="form-group mb-4">
            <label>Scope & Requirements Description</label>
            <textarea 
              className="form-control" 
              rows={3}
              placeholder="Briefly describe project scope and milestone breakdown..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary glowing-btn" disabled={saving}>
              {saving ? 'Initiating...' : 'Lock Escrow & Create Contract'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
