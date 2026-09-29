import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Unlock, DollarSign, UserCheck, Briefcase, ArrowRight } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';

export default function EscrowVault2D({ totalAmount = 0, heldAmount = 0, releasedAmount = 0, activeProjectsCount = 0 }) {
  const { tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useTilt(8);

  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalAmount);
  const formattedHeld = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(heldAmount);
  const formattedReleased = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(releasedAmount);

  const percentHeld = totalAmount > 0 ? Math.round((heldAmount / totalAmount) * 100) : 0;
  const percentReleased = totalAmount > 0 ? Math.round((releasedAmount / totalAmount) * 100) : 100;

  return (
    <div className="escrow-spatial-wrapper">
      {/* Dynamic Ambient Glow Backdrop */}
      <div className="spatial-glow-bg" />

      {/* SVG Connecting Flow Beziers with Animated Particles */}
      <svg className="escrow-flow-svg" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradientFlow1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="gradientFlow2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Client to Vault Path */}
        <path d="M 170 120 Q 280 60 400 120" stroke="url(#gradientFlow1)" strokeWidth="3" strokeDasharray="6 6" className="animated-flow-dash" />
        
        {/* Vault to Freelancer Path */}
        <path d="M 400 120 Q 520 180 630 120" stroke="url(#gradientFlow2)" strokeWidth="3" strokeDasharray="6 6" className="animated-flow-dash-reverse" />
      </svg>

      <div className="escrow-flow-nodes-container">
        {/* Node 1: Client Node */}
        <motion.div 
          className="flow-node-card client-node"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <div className="node-icon-wrapper client-icon">
            <Briefcase size={20} />
          </div>
          <div className="node-info">
            <span className="node-tag">Funding Source</span>
            <h4 className="node-title">Verified Clients</h4>
            <div className="node-metric">
              <span className="dot dot-blue" /> Fund Escrow
            </div>
          </div>
        </motion.div>

        {/* Node 2: Central 2.5D Escrow Vault */}
        <div 
          className="escrow-vault-card-3d"
          style={tiltStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div style={glareStyle} />
          
          <div className="vault-header">
            <div className="vault-badge">
              <ShieldCheck size={16} />
              <span>Smart Escrow Core</span>
            </div>
            <span className="vault-live-pulse" title="Real-time MySQL Sync">
              <span className="pulse-dot" /> Live
            </span>
          </div>

          {/* Central Progress Ring & Figures */}
          <div className="vault-body">
            <div className="ring-container">
              <svg className="progress-ring" width="110" height="110" viewBox="0 0 110 110">
                <circle className="ring-bg" cx="55" cy="55" r="46" strokeWidth="8" />
                <circle 
                  className="ring-progress-released" 
                  cx="55" 
                  cy="55" 
                  r="46" 
                  strokeWidth="8" 
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * percentReleased) / 100}
                />
                <circle 
                  className="ring-progress-held" 
                  cx="55" 
                  cy="55" 
                  r="46" 
                  strokeWidth="8" 
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * percentHeld) / 100}
                  style={{ transform: `rotate(${percentReleased * 3.6}deg)`, transformOrigin: '55px 55px' }}
                />
              </svg>

              <div className="ring-center-content">
                <Lock size={22} className="vault-lock-icon" />
                <span className="vault-total-num">{formattedTotal}</span>
                <span className="vault-subtext">Total Value</span>
              </div>
            </div>

            {/* Split Breakdown stats */}
            <div className="vault-stats-split">
              <div className="stat-pill held">
                <div className="stat-pill-label">
                  <Lock size={12} /> Held in Escrow
                </div>
                <div className="stat-pill-val">{formattedHeld}</div>
                <div className="stat-pill-pct">{percentHeld}% Protected</div>
              </div>

              <div className="stat-pill released">
                <div className="stat-pill-label">
                  <Unlock size={12} /> Disbursed / Released
                </div>
                <div className="stat-pill-val">{formattedReleased}</div>
                <div className="stat-pill-pct">{percentReleased}% Completed</div>
              </div>
            </div>
          </div>

          <div className="vault-footer">
            <span>{activeProjectsCount} Active Contracts Secured</span>
            <div className="vault-security-tag">
              <ShieldCheck size={12} /> SHA-256 Verified
            </div>
          </div>
        </div>

        {/* Node 3: Freelancer Node */}
        <motion.div 
          className="flow-node-card freelancer-node"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <div className="node-icon-wrapper freelancer-icon">
            <UserCheck size={20} />
          </div>
          <div className="node-info">
            <span className="node-tag">Recipient</span>
            <h4 className="node-title">Freelancers</h4>
            <div className="node-metric">
              <span className="dot dot-green" /> Release Funds
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
