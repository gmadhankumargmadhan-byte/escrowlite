import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTilt } from '../hooks/useTilt';

export default function LoginPage({ onSwitchToRegister }) {
  const { login } = useAuth();
  const toast = useToast();
  const { tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useTilt(12);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setErrorMsg('Please enter your username/email and password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    try {
      const res = await login(usernameOrEmail, password);
      toast.success(`Welcome back, ${res.user.name || res.user.username}!`);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      toast.error(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setUsernameOrEmail('admin');
      setPassword('admin123');
    } else {
      setUsernameOrEmail('client_demo');
      setPassword('client123');
    }
  };

  return (
    <div className="login-page-container">
      {/* Dynamic Ambient Background Dots */}
      <div className="ambient-grid-bg" />

      {/* LEFT SIDE: Animated 2.5D Escrow Visualization */}
      <div className="login-left-brand">
        <div className="login-brand-content">
          <div className="login-brand-logo">
            <div className="brand-icon-lg">
              <ShieldCheck size={32} color="#fff" />
            </div>
            <span className="brand-title-lg">EscrowLite</span>
          </div>

          <h1 className="login-headline">
            Secure Work. <br />
            <span className="gradient-text">Protected Payments.</span>
          </h1>

          <p className="login-subtext">
            Enterprise freelance payment release tracker. Milestone-based escrow security connecting clients and developers transparently.
          </p>

          {/* 2.5D Floating Interactive Escrow Visualization Card */}
          <div 
            className="login-2d-visual-card"
            style={tiltStyle}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div style={glareStyle} />
            
            {/* SVG Connecting Flow Lines */}
            <svg className="visual-card-svg" viewBox="0 0 400 160">
              <path d="M 70 80 Q 200 20 330 80" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" strokeDasharray="4 4" className="animated-flow-dash" />
            </svg>

            {/* 3 Flow Nodes */}
            <div className="visual-nodes-row">
              <div className="visual-node client-node-mini">
                <Briefcase size={16} />
                <span>Client</span>
              </div>

              <motion.div 
                className="visual-node vault-node-center"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="vault-lock-ring">
                  <Lock size={18} className="lock-icon" />
                </div>
                <div className="vault-amount-tag">$5,000 ESCROW</div>
                <span className="vault-label">Protected</span>
              </motion.div>

              <div className="visual-node freelancer-node-mini">
                <UserCheck size={16} />
                <span>Freelancer</span>
              </div>
            </div>
          </div>

          <div className="login-features-list">
            <div className="feature-item">
              <CheckCircle2 size={18} className="feature-icon" />
              <span>Milestone-based automated fund locking & releases</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={18} className="feature-icon" />
              <span>Spring Boot 4 authenticated REST transaction engine</span>
            </div>
          </div>
        </div>

        <div className="login-footer-credits">
          © 2026 EscrowLite FinTech Platform. All Rights Reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Premium Login Form Card */}
      <div className="login-right-card-wrapper">
        <motion.div 
          className="login-card spatial-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="login-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your protected EscrowLite workspace</p>
          </div>

          {errorMsg && (
            <div className="login-error-banner">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username or Email</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-control with-icon"
                  placeholder="admin or admin@escrowlite.com"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block login-btn glowing-btn" disabled={loading}>
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  Sign In to EscrowLite <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Trigger */}
          <div className="demo-credentials-box">
            <span className="demo-title">Quick Demo Logins (Backend Authenticated):</span>
            <div className="demo-btn-group">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => fillDemoCredentials('admin')}>
                Admin User
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => fillDemoCredentials('client')}>
                Client User
              </button>
            </div>
          </div>

          {/* Switch to Registration Link */}
          <div className="auth-switch-footer">
            <span>Don't have an account?</span>
            <button type="button" className="auth-switch-link" onClick={onSwitchToRegister}>
              Create account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
