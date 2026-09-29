import React, { useState } from 'react';
import { authApi } from '../api/escrowApi';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Mail, 
  UserCheck, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function RegisterPage({ onSwitchToLogin }) {
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ROLE_CLIENT');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Strength Calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', percent: 0 };
    let score = 0;
    if (password.length >= 6) score += 30;
    if (password.length >= 10) score += 20;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    if (score < 40) return { label: 'Weak', color: '#ef4444', percent: 33 };
    if (score < 75) return { label: 'Medium', color: '#f59e0b', percent: 66 };
    return { label: 'Strong', color: '#10b981', percent: 100 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password entry.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: email,
        email: email,
        password: password,
        name: name,
        role: role,
      };

      const res = await authApi.register(payload);
      if (res.data && res.data.success) {
        toast.success('Account created successfully! Please sign in with your credentials.');
        onSwitchToLogin();
      } else {
        throw new Error(res.data?.message || 'Registration failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Left Brand Visual Side */}
      <div className="login-left-brand">
        <div className="login-brand-content">
          <div className="login-brand-logo">
            <div className="brand-icon-lg">
              <ShieldCheck size={32} color="#fff" />
            </div>
            <span className="brand-title-lg">EscrowLite</span>
          </div>

          <h1 className="login-headline">
            Join the Escrow <br />
            <span className="gradient-text">Protection Network.</span>
          </h1>

          <p className="login-subtext">
            Create your account to initiate milestone-funded contracts as a Client or deliver verified technical milestones as a Freelancer.
          </p>

          <div className="login-features-list">
            <div className="feature-item">
              <CheckCircle2 size={18} className="feature-icon" />
              <span>Instant client or freelancer profile initialization</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={18} className="feature-icon" />
              <span>SHA-256 encrypted password security</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={18} className="feature-icon" />
              <span>Full access to real-time milestone escrow tracking</span>
            </div>
          </div>
        </div>

        <div className="login-footer-credits">
          © 2026 EscrowLite FinTech Platform. All Rights Reserved.
        </div>
      </div>

      {/* Right Register Form Card Side */}
      <div className="login-right-card-wrapper">
        <div className="login-card" style={{ maxWidth: '480px' }}>
          <div className="login-card-header">
            <h2>Create an Account</h2>
            <p>Start managing protected freelance escrow payments</p>
          </div>

          {errorMsg && (
            <div className="login-error-banner">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Role Selector */}
            <div className="form-group mb-3">
              <label>Account Role</label>
              <div className="role-selector-grid">
                <div 
                  className={`role-option-card ${role === 'ROLE_CLIENT' ? 'active' : ''}`}
                  onClick={() => setRole('ROLE_CLIENT')}
                >
                  <Briefcase size={20} />
                  <div>
                    <div className="font-weight-600 font-size-sm">Client</div>
                    <div className="text-muted text-xs">Hire & fund projects</div>
                  </div>
                </div>

                <div 
                  className={`role-option-card ${role === 'ROLE_FREELANCER' ? 'active' : ''}`}
                  onClick={() => setRole('ROLE_FREELANCER')}
                >
                  <UserCheck size={20} />
                  <div>
                    <div className="font-weight-600 font-size-sm">Freelancer</div>
                    <div className="text-muted text-xs">Deliver work & earn</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-control with-icon"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-control with-icon"
                  placeholder="alex.morgan@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="At least 6 characters"
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
              {password && (
                <div className="password-strength-bar mt-2">
                  <div className="strength-label">
                    <span>Password Strength:</span>
                    <strong style={{ color: strength.color }}>{strength.label}</strong>
                  </div>
                  <div className="strength-meter-bg">
                    <div 
                      className="strength-meter-fill" 
                      style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <span className="text-danger text-xs mt-1">Passwords do not match</span>
              )}
            </div>

            {/* Terms & Privacy Checkbox */}
            <div className="terms-checkbox-row mb-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block login-btn" disabled={loading}>
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  Complete Registration <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login Link */}
          <div className="auth-switch-footer">
            <span>Already have an account?</span>
            <button type="button" className="auth-switch-link" onClick={onSwitchToLogin}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
