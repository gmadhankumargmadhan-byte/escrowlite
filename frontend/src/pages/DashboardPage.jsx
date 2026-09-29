import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Briefcase, 
  Users, 
  UserCheck, 
  Target, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Sparkles,
  ChevronRight,
  Send,
  DollarSign
} from 'lucide-react';
import EscrowVault2D from '../components/visualization/EscrowVault2D';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage({
  clients = [],
  freelancers = [],
  projects = [],
  milestones = [],
  releases = [],
  healthStatus,
  loading,
  onNavigate,
  onOpenCreateProject,
  onOpenCreateClient,
  onOpenCreateFreelancer,
}) {
  const { user } = useAuth();

  // Financial Computations from Real API Data
  const totalProjectBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const releasedAmount = releases.reduce((acc, r) => acc + (r.amount || 0), 0);
  const heldAmount = Math.max(0, totalProjectBudget - releasedAmount);

  const pendingMilestones = milestones.filter(m => m.status === 'PENDING' || m.status === 'DELIVERED');
  const activeProjects = projects.filter(p => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS');

  if (loading) {
    return (
      <div className="dashboard-spatial-layout">
        <SkeletonLoader type="card" height={220} count={1} />
        <SkeletonLoader type="card" height={340} count={1} />
      </div>
    );
  }

  return (
    <div className="dashboard-spatial-layout">
      {/* 1. Spatial Top Hero Greeting */}
      <motion.div 
        className="dashboard-hero-banner"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="hero-content-left">
          <div className="hero-badge">
            <Sparkles size={14} className="text-amber" />
            <span>Escrow Core Active</span>
          </div>
          <h1 className="hero-greeting">
            Good day, <span className="gradient-text">{user?.name || user?.username || 'Escrow Administrator'}</span>
          </h1>
          <p className="hero-subtitle">
            Your escrow operations are running seamlessly. {activeProjects.length} active project contracts currently secured.
          </p>

          <div className="hero-quick-pills">
            <div className="quick-pill">
              <Users size={14} /> <span>{clients.length} Clients</span>
            </div>
            <div className="quick-pill">
              <UserCheck size={14} /> <span>{freelancers.length} Freelancers</span>
            </div>
            <div className="quick-pill">
              <Briefcase size={14} /> <span>{projects.length} Total Projects</span>
            </div>
          </div>
        </div>

        <div className="hero-actions-right">
          <button 
            className="btn btn-primary glowing-btn flex-align-center gap-2"
            onClick={onOpenCreateProject}
          >
            <Plus size={16} /> New Project Contract
          </button>
        </div>
      </motion.div>

      {/* 2. Reimagined Central 2.5D Escrow Vault Visualization */}
      <EscrowVault2D
        totalAmount={totalProjectBudget}
        heldAmount={heldAmount}
        releasedAmount={releasedAmount}
        activeProjectsCount={activeProjects.length}
      />

      {/* 3. Connected Workflow Composition Section */}
      <div className="spatial-grid-2col">
        {/* Left Surface: Active Contracts Workspace */}
        <motion.div 
          className="spatial-surface-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="surface-header">
            <div>
              <span className="surface-tag">Live Workspaces</span>
              <h3>Active Project Contracts ({projects.length})</h3>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('projects')}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="empty-surface-note">
              No active project contracts available. Click "New Project Contract" to initiate.
            </div>
          ) : (
            <div className="spatial-projects-list">
              {projects.slice(0, 4).map((proj) => {
                const clientObj = clients.find(c => c.id === (proj.client?.id || proj.clientId));
                const freeObj = freelancers.find(f => f.id === (proj.freelancer?.id || proj.freelancerId));

                return (
                  <div 
                    key={proj.id} 
                    className="spatial-project-row"
                    onClick={() => onNavigate('project-detail', proj.id)}
                  >
                    <div className="row-left font-weight-600">
                      <div className="project-title-text">{proj.title}</div>
                      <div className="project-party-tags">
                        <span>Client: {clientObj?.name || 'Assigned'}</span>
                        <span className="divider">•</span>
                        <span>Freelancer: {freeObj?.name || 'Assigned'}</span>
                      </div>
                    </div>

                    <div className="row-right">
                      <span className="row-price">${proj.budget?.toLocaleString()}</span>
                      <span className={`status-pill status-${proj.status?.toLowerCase()}`}>
                        {proj.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Right Surface: Milestone Queue Stream */}
        <motion.div 
          className="spatial-surface-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="surface-header">
            <div>
              <span className="surface-tag">Delivery Queue</span>
              <h3>Pending Milestones ({pendingMilestones.length})</h3>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('milestones')}
            >
              Tracker <ChevronRight size={14} />
            </button>
          </div>

          {pendingMilestones.length === 0 ? (
            <div className="empty-surface-note">
              All milestones are delivered or approved!
            </div>
          ) : (
            <div className="spatial-milestones-stream">
              {pendingMilestones.slice(0, 4).map((m) => (
                <div key={m.id} className="stream-item">
                  <div className="stream-icon-badge">
                    {m.status === 'DELIVERED' ? <Send size={16} className="text-amber" /> : <Clock size={16} className="text-indigo" />}
                  </div>
                  <div className="stream-content">
                    <div className="stream-title">{m.title}</div>
                    <div className="stream-subtext">
                      Amount: ${m.amount?.toLocaleString()} • Status: {m.status}
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-xs"
                    onClick={() => onNavigate('milestones')}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
