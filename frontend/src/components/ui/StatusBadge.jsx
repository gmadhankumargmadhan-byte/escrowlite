import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return <span className="badge badge-neutral">N/A</span>;

  const normalized = status.toUpperCase();
  let badgeClass = 'badge-neutral';

  switch (normalized) {
    case 'CREATED':
      badgeClass = 'badge-created';
      break;
    case 'PENDING':
      badgeClass = 'badge-pending';
      break;
    case 'DELIVERED':
      badgeClass = 'badge-delivered';
      break;
    case 'APPROVED':
      badgeClass = 'badge-approved';
      break;
    case 'RELEASED':
    case 'COMPLETED':
      badgeClass = 'badge-released';
      break;
    case 'REWORK':
    case 'REWORK_REQUESTED':
      badgeClass = 'badge-rework';
      break;
    case 'CANCELLED':
      badgeClass = 'badge-cancelled';
      break;
    default:
      badgeClass = 'badge-neutral';
  }

  return <span className={`badge ${badgeClass}`}>{status.replace('_', ' ')}</span>;
}
