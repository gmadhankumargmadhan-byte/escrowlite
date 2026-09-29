import React from 'react';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { DollarSign, Lock, CheckCircle2, Calendar } from 'lucide-react';

export default function EscrowReleasesPage({ releases, projects, loading }) {
  const totalBudget = projects.reduce((acc, p) => acc + (p.totalAmount || 0), 0);
  const totalReleased = releases.reduce((acc, r) => acc + (r.amount || 0), 0);
  const remainingEscrow = totalBudget - totalReleased;

  return (
    <div className="escrow-releases-page">
      {/* Financial Overview Cards */}
      <div className="stats-grid mb-4">
        <StatCard
          title="Total Contract Value"
          value={`$${totalBudget.toLocaleString()}`}
          icon={DollarSign}
          color="primary"
          subtext="Cumulative project budgets"
        />
        <StatCard
          title="Total Released Payments"
          value={`$${totalReleased.toLocaleString()}`}
          icon={CheckCircle2}
          color="success"
          subtext="Disbursed to freelancers"
        />
        <StatCard
          title="Remaining Escrow Balance"
          value={`$${remainingEscrow.toLocaleString()}`}
          icon={Lock}
          color="warning"
          subtext="Currently protected in escrow"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Escrow Release History Ledger</h2>
            <p className="card-subtitle">Verified transaction log of milestone payment disbursements</p>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Release ID</th>
                <th>Project ID</th>
                <th>Milestone ID</th>
                <th>Amount Disbursed</th>
                <th>Disbursement Timestamp</th>
                <th>Verification</th>
              </tr>
            </thead>
            {loading && releases.length === 0 ? (
              <SkeletonLoader type="table" rows={5} cols={6} />
            ) : (
              <tbody>
                {releases.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-weight-600">#REL-{r.id}</div>
                    </td>
                    <td>
                      <div className="font-weight-600">Project #{r.project?.id || r.projectId}</div>
                    </td>
                    <td>
                      <div className="font-weight-600">Milestone #{r.milestone?.id || r.milestoneId}</div>
                    </td>
                    <td>
                      <div className="font-weight-700 color-success font-size-md">
                        +${r.amount?.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-icon text-muted text-xs">
                        <Calendar size={13} />
                        {r.releasedAt ? new Date(r.releasedAt).toLocaleString() : 'Just now'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-approved">✓ Verified</span>
                    </td>
                  </tr>
                ))}
                {releases.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6">
                      <EmptyState
                        icon={DollarSign}
                        title="No Payment Releases Recorded"
                        message="Released milestone funds will appear here as client approvals occur."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
