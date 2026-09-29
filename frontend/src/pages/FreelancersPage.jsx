import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Mail, Code2, DollarSign, ChevronRight, UserCheck } from 'lucide-react';
import FreelancerDrawer from '../components/ui/FreelancerDrawer';
import Modal from '../components/ui/Modal';
import { freelancerApi } from '../api/escrowApi';
import { useToast } from '../context/ToastContext';
import { useTilt } from '../hooks/useTilt';

function FreelancerCard({ freelancer, projects, onOpenDrawer }) {
  const { tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useTilt(8);
  const freelancerProjects = projects.filter(p => p.freelancer?.id === freelancer.id || p.freelancerId === freelancer.id);
  const skillsList = freelancer.skills ? freelancer.skills.split(',').slice(0, 3).map(s => s.trim()) : ['Full-Stack'];

  return (
    <div 
      className="spatial-directory-card"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenDrawer(freelancer)}
    >
      <div style={glareStyle} />
      
      <div className="card-top-row">
        <div className="avatar-circle freelancer-avatar">
          {freelancer.name ? freelancer.name.charAt(0).toUpperCase() : 'F'}
        </div>
        <span className="badge badge-emerald">{freelancerProjects.length} Assigned</span>
      </div>

      <h4 className="card-name-title">{freelancer.name}</h4>

      <div className="card-skills-row">
        {skillsList.map((sk, idx) => (
          <span key={idx} className="skill-badge-mini">
            {sk}
          </span>
        ))}
      </div>

      <div className="card-details-stack mt-2">
        <div className="detail-line">
          <Mail size={14} /> <span>{freelancer.email || 'No email specified'}</span>
        </div>
        {freelancer.hourlyRate && (
          <div className="detail-line">
            <DollarSign size={14} /> <span>${freelancer.hourlyRate} / hour</span>
          </div>
        )}
      </div>

      <div className="card-footer-action">
        <span>View Talent Profile</span>
        <ChevronRight size={14} />
      </div>
    </div>
  );
}

export default function FreelancersPage({ freelancers = [], projects = [], loading, onRefresh, searchTerm: globalSearch, onNavigate }) {
  const toast = useToast();
  const [localSearch, setLocalSearch] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [saving, setSaving] = useState(false);

  const query = (localSearch || globalSearch || '').toLowerCase();
  const filtered = freelancers.filter(f => 
    f.name?.toLowerCase().includes(query) || 
    f.email?.toLowerCase().includes(query) ||
    f.skills?.toLowerCase().includes(query)
  );

  const handleCreateFreelancer = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }

    setSaving(true);
    try {
      await freelancerApi.create({ 
        name, 
        email, 
        skills, 
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null 
      });
      toast.success('Freelancer registered successfully!');
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setSkills('');
      setHourlyRate('');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to create freelancer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="directory-page-layout">
      {/* Header Bar */}
      <div className="directory-header-bar">
        <div>
          <span className="surface-tag">Talent Network</span>
          <h2>Verified Freelancers</h2>
        </div>

        <div className="header-actions-group">
          <div className="directory-search-input">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search freelancers by name, skills, email..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          <button className="btn btn-primary glowing-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Freelancer
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      {filtered.length === 0 ? (
        <div className="empty-surface-note text-center py-5">
          No freelancer profiles match your search query.
        </div>
      ) : (
        <div className="directory-cards-grid">
          {filtered.map(f => (
            <FreelancerCard 
              key={f.id} 
              freelancer={f} 
              projects={projects}
              onOpenDrawer={(item) => setSelectedFreelancer(item)}
            />
          ))}
        </div>
      )}

      {/* Freelancer Detail Side Drawer */}
      <FreelancerDrawer 
        freelancer={selectedFreelancer}
        projects={projects}
        onClose={() => setSelectedFreelancer(null)}
        onNavigateToProject={onNavigate}
      />

      {/* Add Freelancer Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Register New Freelancer"
      >
        <form onSubmit={handleCreateFreelancer}>
          <div className="form-group mb-3">
            <label>Full Name *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. David Kim"
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
              placeholder="david.kim@developer.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Technical Skills (Comma Separated)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="React, Java Spring Boot, MySQL, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label>Hourly Rate ($ USD)</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="85"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary glowing-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Register Freelancer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
