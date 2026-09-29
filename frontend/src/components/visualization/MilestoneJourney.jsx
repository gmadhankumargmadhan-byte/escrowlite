import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  ThumbsUp, 
  DollarSign, 
  RotateCcw, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  FileCode
} from 'lucide-react';

export default function MilestoneJourney({ 
  milestone, 
  onDeliver, 
  onApprove, 
  onRework, 
  onRelease, 
  loading 
}) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!milestone) {
    return (
      <div className="milestone-journey-empty">
        <Clock size={32} className="text-muted" />
        <p>No milestone selected</p>
      </div>
    );
  }

  const currentStatus = milestone.status || 'PENDING';
  const amountFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(milestone.amount || 0);

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'DELIVERED': return 1;
      case 'APPROVED': return 2;
      case 'RELEASED': return 3;
      case 'REWORK': return 1; // branches off delivered
      default: return 0;
    }
  };

  const activeStep = getStepIndex(currentStatus);

  const steps = [
    { key: 'PENDING', label: 'Pending Work', icon: Clock, desc: 'Escrow locked. Freelancer actively developing.' },
    { key: 'DELIVERED', label: 'Delivered', icon: Send, desc: 'Deliverables submitted. Pending client review.' },
    { key: 'APPROVED', label: 'Approved', icon: ThumbsUp, desc: 'Client verified work. Ready for disbursement.' },
    { key: 'RELEASED', label: 'Funds Released', icon: DollarSign, desc: 'Escrow payout dispatched to freelancer.' },
  ];

  return (
    <div className="milestone-journey-card">
      <div className="journey-header">
        <div className="journey-title-area">
          <span className="journey-subtitle">Milestone Lifecycle Journey</span>
          <h3 className="journey-title">{milestone.title || 'Untitled Milestone'}</h3>
        </div>
        <div className="journey-amount-tag">
          <ShieldCheck size={16} />
          <span>{amountFormatted}</span>
        </div>
      </div>

      {milestone.description && (
        <p className="journey-desc">{milestone.description}</p>
      )}

      {/* Rework Notice Banner if status is REWORK */}
      {currentStatus === 'REWORK' && (
        <motion.div 
          className="rework-alert-banner"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={18} className="alert-icon" />
          <div>
            <strong>Revision Requested by Client</strong>
            <p>The client has requested modifications. Freelancer is updating deliverables before re-submitting.</p>
          </div>
        </motion.div>
      )}

      {/* Visual Journey Path */}
      <div className="journey-path-container">
        {/* Connection Progress Bar */}
        <div className="journey-track-bg">
          <div 
            className="journey-track-fill"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Nodes */}
        <div className="journey-nodes-row">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = activeStep > idx || currentStatus === 'RELEASED';
            const isActive = activeStep === idx && currentStatus !== 'RELEASED';

            return (
              <div 
                key={step.key} 
                className={`journey-node-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedNode(step.key)}
              >
                <motion.div 
                  className="node-circle"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </motion.div>

                <div className="node-label-group">
                  <span className="node-label">{step.label}</span>
                  <span className="node-status-dot" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Action Toolbar based on current status */}
      <div className="journey-actions-bar">
        <div className="actions-info">
          <span>Current Status:</span>
          <span className={`status-pill status-${currentStatus.toLowerCase()}`}>
            {currentStatus}
          </span>
        </div>

        <div className="actions-buttons-group">
          {(currentStatus === 'PENDING' || currentStatus === 'REWORK') && (
            <button 
              className="btn btn-primary btn-sm glowing-btn"
              onClick={() => onDeliver && onDeliver(milestone.id)}
              disabled={loading}
            >
              <Send size={15} /> Deliver Milestone Work
            </button>
          )}

          {currentStatus === 'DELIVERED' && (
            <>
              <button 
                className="btn btn-warning btn-sm"
                onClick={() => onRework && onRework(milestone.id)}
                disabled={loading}
              >
                <RotateCcw size={15} /> Request Rework
              </button>
              <button 
                className="btn btn-success btn-sm glowing-btn"
                onClick={() => onApprove && onApprove(milestone.id)}
                disabled={loading}
              >
                <ThumbsUp size={15} /> Approve Deliverable
              </button>
            </>
          )}

          {currentStatus === 'APPROVED' && (
            <button 
              className="btn btn-emerald btn-sm glowing-btn"
              onClick={() => onRelease && onRelease(milestone.id)}
              disabled={loading}
            >
              <DollarSign size={15} /> Release Escrow Payment
            </button>
          )}

          {currentStatus === 'RELEASED' && (
            <span className="text-success font-size-sm font-weight-600 flex-align-center gap-1">
              <CheckCircle2 size={16} /> Funds Transferred to Freelancer
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
