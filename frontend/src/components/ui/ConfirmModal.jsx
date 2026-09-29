import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  loading = false 
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="440px">
      <div className="confirm-modal-body">
        <div className={`confirm-icon-wrapper ${isDanger ? 'danger' : 'warning'}`}>
          <AlertTriangle size={24} />
        </div>
        <p className="confirm-message">{message}</p>
      </div>
      <div className="modal-footer">
        <button 
          className="btn btn-secondary" 
          onClick={onClose} 
          disabled={loading}
        >
          {cancelText}
        </button>
        <button 
          className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
