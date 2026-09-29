import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Unlock, DollarSign, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export default function EscrowReleasesPage({ releases = [], projects = [], loading }) {
  const totalProjectValue = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalReleased = releases.reduce((acc, r) => acc + (r.amount || 0), 0);
  const totalHeld = Math.max(0, totalProjectValue - totalReleased);

  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalProjectValue);
  const formattedHeld = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalHeld);
  const formattedReleased = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalReleased);

  return (
    <div className="directory-page-layout">
      {/* Header */}
      <div className="directory-header-bar">
        <div>
          <span className="surface-tag">Financial Vault</span>
          <h2>Escrow Disbursal Ledger</h2>
        </div>
      </div>

      {/* Financial Overview Spatial Cards */}
      <div className="spatial-financial-grid">
        <div className="financial-card total-card">
          <div className="card-icon-badge">
            <DollarSign size={20} />
          </div>
          <span className="fin-label">Total Contract Value</span>
          <h3 className="fin-value">{formattedTotal}</h3>
          <span className="fin-subtext">{projects.length} Total Contracts Secured</span>
        </div>

        <div className="financial-card held-card">
          <div className="card-icon-badge badge-indigo">
            <Lock size={20} />
          </div>
          <span className="fin-label">Escrow Held / Protected</span>
          <h3 className="fin-value font-indigo">{formattedHeld}</h3>
          <span className="fin-subtext">Active Funds Locked</span>
        </div>

        <div className="financial-card released-card">
          <div className="card-icon-badge badge-emerald">
            <Unlock size={20} />
          </div>
          <span className="fin-label">Released Disbursals</span>
          <h3 className="fin-value font-emerald">{formattedReleased}</h3>
          <span className="fin-subtext">{releases.length} Completed Transfers</span>
        </div>
      </div>

      {/* Disbursal Ledger Stream */}
      <div className="spatial-surface-card mt-4">
        <div className="surface-header">
          <div>
            <span className="surface-tag">Verified Transactions</span>
            <h3>Disbursal History Stream ({releases.length})</h3>
          </div>
        </div>

        {releases.length === 0 ? (
          <div className="empty-surface-note text-center py-5">
            No milestone payouts have been released yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="spatial-table">
              <thead>
                <tr>
                  <th>Release ID</th>
                  <th>Milestone & Project</th>
                  <th>Disbursed Amount</th>
                  <th>Execution Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {releases.map(r => (
                  <tr key={r.id}>
                    <td>
                      <span className="font-mono text-muted">#REL-{r.id}</span>
                    </td>
                    <td>
                      <div className="font-weight-600">{r.milestone?.title || 'Milestone Payout'}</div>
                      <div className="text-muted text-xs">Project #{r.milestone?.projectId || 'N/A'}</div>
                    </td>
                    <td>
                      <span className="font-emerald font-weight-700">
                        +${r.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted text-sm">
                        {r.releaseDate ? new Date(r.releaseDate).toLocaleString() : 'Just now'}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill status-approved">
                        <CheckCircle2 size={12} /> Disbursed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
