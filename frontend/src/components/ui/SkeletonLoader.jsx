import React from 'react';

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="skeleton-row">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-line" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="stat-card skeleton-card">
      <div className="skeleton-line short" />
      <div className="skeleton-line tall" />
    </div>
  );
}

export default function SkeletonLoader({ type = 'table', rows = 4, cols = 5 }) {
  if (type === 'card') {
    return (
      <div className="stats-grid">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </tbody>
  );
}
