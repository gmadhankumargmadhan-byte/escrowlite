import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Lock, Unlock, ArrowRight, DollarSign, X, Loader2 } from 'lucide-react';

export default function ReleaseModalSequence({ milestone, isOpen, onClose, onConfirmRelease }) {
  const [step, setStep] = useState(1); // 1: Confirm, 2: Executing Sequence, 3: Success
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !milestone) return null;

  const amountFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(milestone.amount || 0);

  const handleStartRelease = async () => {
    setErrorMsg('');
    setLoading(true);
    setStep(2);

    try {
      // Perform sequence animation delay for high-trust user experience
      await new Promise(res => setTimeout(res, 1200));

      // Execute real Spring Boot API call
      await onConfirmRelease(milestone.id);

      setStep(3);
    } catch (err) {
      setErrorMsg(err.message || 'Payment release failed. Please try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div 
          className="spatial-modal-card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close-icon" onClick={onClose}>
            <X size={18} />
          </button>

          {/* STEP 1: Verification Confirmation */}
          {step === 1 && (
            <div className="release-step-container">
              <div className="modal-icon-badge badge-emerald">
                <ShieldCheck size={28} />
              </div>

              <h3>Authorize Escrow Disbursement</h3>
              <p className="modal-subtitle">
                You are releasing locked escrow funds to the freelancer for milestone:
              </p>

              <div className="release-details-summary">
                <div className="summary-title">{milestone.title}</div>
                <div className="summary-amount">{amountFormatted}</div>
              </div>

              {errorMsg && (
                <div className="error-banner mb-3">
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="release-steps-preview">
                <div className="preview-step active">
                  <span className="step-num">1</span>
                  <span>Approval Check</span>
                </div>
                <ArrowRight size={14} className="text-muted" />
                <div className="preview-step">
                  <span className="step-num">2</span>
                  <span>Vault Unlock</span>
                </div>
                <ArrowRight size={14} className="text-muted" />
                <div className="preview-step">
                  <span className="step-num">3</span>
                  <span>Payout Transfer</span>
                </div>
              </div>

              <div className="modal-actions-row">
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn btn-emerald glowing-btn" onClick={handleStartRelease}>
                  <DollarSign size={16} /> Confirm & Release Funds
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Executing Real Sequence */}
          {step === 2 && (
            <div className="release-step-container text-center py-4">
              <div className="vault-unlock-anim">
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="spinner-wrapper"
                >
                  <Loader2 size={42} className="text-emerald" />
                </motion.div>
                <Unlock size={24} className="unlock-overlay-icon" />
              </div>

              <h4 className="mt-3">Unlocking Escrow Vault...</h4>
              <p className="text-muted text-sm">
                Executing SHA-256 verified disbursement sequence via Spring Boot transaction engine.
              </p>

              <div className="animated-progress-dots">
                <span className="dot dot-1" />
                <span className="dot dot-2" />
                <span className="dot dot-3" />
              </div>
            </div>
          )}

          {/* STEP 3: Success Completed */}
          {step === 3 && (
            <div className="release-step-container text-center">
              <motion.div 
                className="modal-icon-badge badge-success-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 size={40} />
              </motion.div>

              <h3>Funds Successfully Released!</h3>
              <p className="modal-subtitle">
                Payment of <strong>{amountFormatted}</strong> has been disbursed to the freelancer.
              </p>

              <div className="modal-actions-row justify-center mt-4">
                <button 
                  className="btn btn-primary glowing-btn"
                  onClick={onClose}
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
