import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Building, Briefcase, DollarSign, Calendar, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ClientDrawer({ client, projects = [], onClose, onNavigateToProject }) {
  if (!client) return null;

  const clientProjects = projects.filter(p => p.client?.id === client.id || p.clientId === client.id);
  const totalInvestment = clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const formattedInvestment = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalInvestment);

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
              <span className="drawer-tag">Client Profile</span>
              <h3>{client.name || 'Client Details'}</h3>
            </div>
            <button className="drawer-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="drawer-body">
            {/* Main Avatar & Summary */}
            <div className="drawer-profile-card">
              <div className="profile-avatar-xl client-avatar">
                {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="profile-info-main">
                <h4>{client.name}</h4>
                <div className="profile-detail-item">
                  <Mail size={14} /> <span>{client.email || 'No email specified'}</span>
                </div>
                {client.phone && (
                  <div className="profile-detail-item">
                    <Phone size={14} /> <span>{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="profile-detail-item">
                    <Building size={14} /> <span>{client.company}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Overview Metrics */}
            <div className="drawer-metrics-grid">
              <div className="drawer-metric-box">
                <span className="metric-title">Total Portfolio Value</span>
                <span className="metric-value font-emerald">{formattedInvestment}</span>
              </div>
              <div className="drawer-metric-box">
                <span className="metric-title">Contract Count</span>
                <span className="metric-value">{clientProjects.length} Projects</span>
              </div>
            </div>

            {/* Associated Projects Section */}
            <div className="drawer-section">
              <h5 className="section-subtitle">
                <Briefcase size={16} /> Commissioned Projects ({clientProjects.length})
              </h5>

              {clientProjects.length === 0 ? (
                <div className="drawer-empty-note">
                  No active projects associated with this client.
                </div>
              ) : (
                <div className="drawer-projects-list">
                  {clientProjects.map(proj => (
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
                          View Workspace <ExternalLink size={12} />
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
