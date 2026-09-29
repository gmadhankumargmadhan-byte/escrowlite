import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  title = 'No Data Found', 
  message = 'There are currently no records to display.',
  icon: Icon = Inbox,
  actionLabel,
  onAction 
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={36} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
