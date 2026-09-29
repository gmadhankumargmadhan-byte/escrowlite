import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'primary', subtext }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className={`stat-icon-container stat-icon-${color}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
  );
}
