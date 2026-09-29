import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        let badgeClass = 'toast-info';
        if (toast.type === 'success') {
          Icon = CheckCircle2;
          badgeClass = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          badgeClass = 'toast-error';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          badgeClass = 'toast-warning';
        }

        return (
          <div key={toast.id} className={`toast-item ${badgeClass}`}>
            <Icon size={18} className="toast-icon" />
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
