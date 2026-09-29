import React from 'react';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import { 
  Users, 
  UserCheck, 
  FolderKanban, 
  DollarSign, 
  CheckCircle2, 
  Lock, 
  Plus, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Zap,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage({ 
  clients, 
  freelancers, 
  projects, 
  milestones, 
  releases, 
  healthStatus, 
  loading,
  onNavigate,
  onOpenCreateProject,
  onOpenCreateClient,
  onOpenCreateFreelancer 
}) {
  const { user } = useAuth();

  const totalBudget = projects.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalReleased = releases.reduce((sum, r) => sum + (r.amount || 0), 0);
  const remainingEscrow = totalBudget - totalReleased;
  const pendingMilestones = milestones.filter((m) => m.status === 'PENDING' || m.status === 'DELIVERED').length;

  // Real Escrow Chart Calculation (Percentage of released vs held)
  const releasedPercent = totalBudget > 0 ? Math.round((totalReleased / totalBudget) * 100) : 0;
  const heldPercent = 100 - releasedPercent;

  if (loading && projects.length === 0) {
    return <SkeletonLoader type="card" rows={6} />;
  }

  return (
    <div className="dashboard-page">
      {/* Hero Greeting Section */}
      <div className="dashboard-hero-card card">
        <div className="hero-content">
          <div>
            <h1 className="hero-greeting">Good morning, {user?.name || 'Admin'} 👋</h1>
            <p className="hero-subtitle">Here is what is happening across your EscrowLite freelance operations today.</p>
          </div>
          <div className="hero-quick-actions">
            <button className="btn btn-primary" onClick={onOpenCreateProject}>
              <Plus size={16} /> Create Project
            </button>
            <button className="btn btn-secondary" onClick={onOpenCreateClient}>
              <Plus size={16} /> Add Client
            </button>
            <button className="btn btn-secondary" onClick={onOpenCreateFreelancer}>
              <Plus size={16} /> Add Freelancer
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('milestones')}>
              <Zap size={16} /> Review Milestones
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Clients"
          value={clients.length}
          icon={Users}
          color="primary"
          subtext="Active contract partners"
        />
        <StatCard
          title="Total Freelancers"
          value={freelancers.length}
          icon={UserCheck}
          color="primary"
          subtext="Verified developers"
        />
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          color="primary"
          subtext="Active project workspaces"
        />
        <StatCard
          title="Total Escrow Budget"
          value={`$${totalBudget.toLocaleString()}`}
          icon={DollarSign}
          color="primary"
          subtext="Gross contract value"
        />
        <StatCard
          title="Released Payments"
          value={`$${totalReleased.toLocaleString()}`}
          icon={CheckCircle2}
          color="success"
          subtext={`${releasedPercent}% disbursed`}
        />
        <StatCard
          title="Held in Escrow"
          value={`$${remainingEscrow.toLocaleString()}`}
          icon={Lock}
          color="warning"
          subtext={`${heldPercent}% protected balance`}
        />
      </div>

      {/* Real Visualizations & Charts Grid */}
      <div className="grid-2 mb-4">
        {/* Escrow Distribution Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Escrow Capital Breakdown</h2>
              <p className="card-subtitle">Real-time allocation of disbursed vs protected funds</p>
            </div>
            <TrendingUp size={20} className="text-muted" />
          </div>

          <div className="chart-wrapper">
            <div className="chart-bar-container">
              <div 
                className="chart-bar-fill success" 
                style={{ width: `${releasedPercent}%` }} 
                title={`Released: ${releasedPercent}%`}
              />
              <div 
                className="chart-bar-fill warning" 
                style={{ width: `${heldPercent}%` }} 
                title={`Held: ${heldPercent}%`}
              />
            </div>
            <div className="chart-legend mt-3">
              <div className="legend-item">
                <span className="legend-dot success" />
                <span>Released Payments (${totalReleased.toLocaleString()})</span>
                <strong className="ml-auto">{releasedPercent}%</strong>
              </div>
              <div className="legend-item mt-2">
                <span className="legend-dot warning" />
                <span>Protected in Escrow (${remainingEscrow.toLocaleString()})</span>
                <strong className="ml-auto">{heldPercent}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Distribution Overview */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Milestone Status Distribution</h2>
              <p className="card-subtitle">Breakdown of deliverables across project lifecycle</p>
            </div>
            <Activity size={20} className="text-muted" />
          </div>

          <div className="milestone-distribution-grid">
            <div className="dist-box">
              <span className="dist-num">{milestones.filter(m => m.status === 'PENDING').length}</span>
              <span className="dist-label">Pending</span>
            </div>
            <div className="dist-box">
              <span className="dist-num">{milestones.filter(m => m.status === 'DELIVERED').length}</span>
              <span className="dist-label">Delivered</span>
            </div>
            <div className="dist-box">
              <span className="dist-num">{milestones.filter(m => m.status === 'APPROVED').length}</span>
              <span className="dist-label">Approved</span>
            </div>
            <div className="dist-box">
              <span className="dist-num">{milestones.filter(m => m.status === 'RELEASED').length}</span>
              <span className="dist-label">Released</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log & Projects Grid */}
      <div className="grid-2">
        {/* Recent Projects Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Active Projects Workspace</h2>
              <p className="card-subtitle">Recent contracts with live milestone tracking</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('projects')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-weight-600">{p.title}</div>
                    </td>
                    <td>${p.totalAmount?.toLocaleString()}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => onNavigate('project-detail', p.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      <EmptyState 
                        title="No Projects Yet" 
                        message="Create a project to start tracking escrow milestones."
                        actionLabel="Create Project"
                        onAction={onOpenCreateProject}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Release Activity Log */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Escrow Releases</h2>
              <p className="card-subtitle">Verified transaction activity log</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('escrow')}>
              Ledger <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="activity-timeline">
            {releases.slice(0, 5).map((r) => (
              <div key={r.id} className="activity-item">
                <div className="activity-icon success">
                  <CheckCircle2 size={16} />
                </div>
                <div className="activity-details">
                  <div className="activity-title">
                    Released <strong>${r.amount?.toLocaleString()}</strong> for Milestone #{r.milestone?.id || r.milestoneId}
                  </div>
                  <div className="activity-sub text-muted text-xs">
                    <Calendar size={12} /> {r.releasedAt ? new Date(r.releasedAt).toLocaleString() : 'Recent'}
                  </div>
                </div>
              </div>
            ))}
            {releases.length === 0 && (
              <EmptyState title="No Releases Yet" message="Released milestone funds will appear here in real time." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
