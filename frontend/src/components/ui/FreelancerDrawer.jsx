import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Briefcase, Award, DollarSign, ExternalLink, Code2 } from 'lucide-react';

export default function FreelancerDrawer({ freelancer, projects = [], onClose, onNavigateToProject }) {
  if (!freelancer) return null;

  const freelancerProjects = projects.filter(p => p.freelancer?.id === freelancer.id || p.freelancerId === freelancer.id);
  const totalEarnings = freelancerProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const formattedEarnings = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalEarnings);

  const skillsList = freelancer.skills ? freelancer.skills.split(',').map(s => s.trim()) : ['Full-Stack', 'Java', 'React'];

  return (
    <AnimatePresence>
      <div className="drawer-backdrop" onClick={onClose}>
        <motion.div 
          className="spatial-drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="drawer-header">
            <div className="drawer-title-group">
              <span className="drawer-tag">Freelancer Profile</span>
              <h3>{freelancer.name || 'Freelancer Details'}</h3>
            </div>
            <button className="drawer-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="drawer-body">
            {/* Profile Hero */}
            <div className="drawer-profile-card">
              <div className="profile-avatar-xl freelancer-avatar">
                {freelancer.name ? freelancer.name.charAt(0).toUpperCase() : 'F'}
              </div>
              <div className="profile-info-main">
                <h4>{freelancer.name}</h4>
                <div className="profile-detail-item">
                  <Mail size={14} /> <span>{freelancer.email || 'No email specified'}</span>
                </div>
                {freelancer.hourlyRate && (
                  <div className="profile-detail-item">
                    <DollarSign size={14} /> <span>${freelancer.hourlyRate} / hour</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Tags */}
            <div className="drawer-section">
              <h5 className="section-subtitle">
                <Code2 size={16} /> Technical Skills
              </h5>
              <div className="drawer-skills-row">
                {skillsList.map((sk, idx) => (
                  <span key={idx} className="skill-badge-glow">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Financial Overview Metrics */}
            <div className="drawer-metrics-grid">
              <div className="drawer-metric-box">
                <span className="metric-title">Secured Escrow Value</span>
                <span className="metric-value font-emerald">{formattedEarnings}</span>
              </div>
              <div className="drawer-metric-box">
                <span className="metric-title">Active Contracts</span>
                <span className="metric-value">{freelancerProjects.length} Assigned</span>
              </div>
            </div>

            {/* Assigned Projects Section */}
            <div className="drawer-section">
              <h5 className="section-subtitle">
                <Briefcase size={16} /> Assigned Projects ({freelancerProjects.length})
              </h5>

              {freelancerProjects.length === 0 ? (
                <div className="drawer-empty-note">
                  No active projects assigned to this freelancer yet.
                </div>
              ) : (
                <div className="drawer-projects-list">
                  {freelancerProjects.map(proj => (
                    <div 
                      key={proj.id} 
                      className="drawer-project-item"
                      onClick={() => {
                        onClose();
                        if (onNavigateToProject) onNavigateToProject('project-detail', proj.id);
                      }}
                    >
                      <div className="project-item-head">
                        <h6>{proj.title}</h6>
                        <span className="item-price">
                          ${proj.budget?.toLocaleString()}
                        </span>
                      </div>
                      <div className="project-item-foot">
                        <span className={`status-pill status-${proj.status?.toLowerCase()}`}>
                          {proj.status}
                        </span>
                        <span className="link-text">
                          Open Workspace <ExternalLink size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
