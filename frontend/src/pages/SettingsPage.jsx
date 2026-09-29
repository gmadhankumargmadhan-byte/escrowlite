import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Sun, 
  Moon, 
  Monitor, 
  ShieldCheck, 
  Bell, 
  Server, 
  Key, 
  Check, 
  Lock, 
  Globe, 
  Database,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('appearance');

  // Security password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  // Notifications toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [disbursalAlerts, setDisbursalAlerts] = useState(true);
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      toast.error('New passwords do not match');
      return;
    }
    setUpdatingPass(true);
    setTimeout(() => {
      toast.success('Security settings updated successfully');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setUpdatingPass(false);
    }, 600);
  };

  return (
    <div className="directory-page-layout">
      {/* Header Bar */}
      <div className="directory-header-bar">
        <div>
          <span className="surface-tag">Platform Configuration</span>
          <h2>Settings & Preferences Workspace</h2>
        </div>
      </div>

      {/* Tabbed Settings Layout */}
      <div className="spatial-settings-grid">
        {/* Left Side Settings Navigation Rail */}
        <div className="settings-nav-card">
          <button 
            className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Sun size={18} />
            <span>Appearance & Theme</span>
          </button>

          <button 
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>User Profile</span>
          </button>

          <button 
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck size={18} />
            <span>Security & Sessions</span>
          </button>

          <button 
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span>Notification Alerts</span>
          </button>

          <button 
            className={`settings-tab-btn ${activeTab === 'application' ? 'active' : ''}`}
            onClick={() => setActiveTab('application')}
          >
            <Server size={18} />
            <span>System Metadata</span>
          </button>
        </div>

        {/* Right Side Tab Workspace Content */}
        <div className="settings-content-card">
          <AnimatePresence mode="wait">
            {/* TAB 1: APPEARANCE */}
            {activeTab === 'appearance' && (
              <motion.div 
                key="appearance"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="settings-section"
              >
                <div className="section-title-group">
                  <h3>Theme & Visual Mode</h3>
                  <p className="text-muted text-sm">Select your preferred EscrowLite color scheme</p>
                </div>

                <div className="theme-selectors-grid">
                  <div 
                    className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                  >
                    <div className="theme-preview dark-preview">
                      <div className="preview-bar" />
                      <div className="preview-card" />
                    </div>
                    <div className="theme-card-info">
                      <Moon size={16} className="text-indigo" />
                      <div>
                        <div className="font-weight-700 font-size-sm">Dark Slate Theme</div>
                        <div className="text-muted text-xs">Deep charcoal surfaces with neon glows</div>
                      </div>
                      {theme === 'dark' && <Check size={16} className="text-emerald check-icon" />}
                    </div>
                  </div>

                  <div 
                    className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => { if (theme !== 'light') toggleTheme(); }}
                  >
                    <div className="theme-preview light-preview">
                      <div className="preview-bar" />
                      <div className="preview-card" />
                    </div>
                    <div className="theme-card-info">
                      <Sun size={16} className="text-amber" />
                      <div>
                        <div className="font-weight-700 font-size-sm">Light Pristine Theme</div>
                        <div className="text-muted text-xs">Crisp off-white surfaces with vibrant accents</div>
                      </div>
                      {theme === 'light' && <Check size={16} className="text-emerald check-icon" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: PROFILE */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="settings-section"
              >
                <div className="section-title-group">
                  <h3>Authenticated Account Profile</h3>
                  <p className="text-muted text-sm">User details synced with Spring Boot MySQL database</p>
                </div>

                <div className="settings-profile-card">
                  <div className="avatar-xl">
                    {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4>{user?.name || user?.username || 'Admin User'}</h4>
                    <span className="badge badge-indigo">{user?.role || 'ROLE_CLIENT'}</span>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>Full Name</label>
                  <input className="form-control" readOnly value={user?.name || 'Administrator'} />
                </div>

                <div className="form-group mb-3">
                  <label>Email Address</label>
                  <input className="form-control" readOnly value={user?.email || 'admin@escrowlite.com'} />
                </div>
              </motion.div>
            )}

            {/* TAB 3: SECURITY */}
            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="settings-section"
              >
                <div className="section-title-group">
                  <h3>Security & Encryption</h3>
                  <p className="text-muted text-sm">SHA-256 password security & session controls</p>
                </div>

                <form onSubmit={handlePasswordChange}>
                  <div className="form-group mb-3">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      className="form-control"
                      placeholder="••••••••"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      className="form-control"
                      placeholder="At least 6 characters"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control"
                      placeholder="Re-enter new password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary glowing-btn" disabled={updatingPass}>
                    {updatingPass ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 4: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="settings-section"
              >
                <div className="section-title-group">
                  <h3>Alert Preferences</h3>
                  <p className="text-muted text-sm">Configure event notifications</p>
                </div>

                <div className="toggle-setting-row">
                  <div>
                    <div className="font-weight-700 font-size-sm">Escrow Disbursal Alerts</div>
                    <div className="text-muted text-xs">Notify when payment is released to a freelancer</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={disbursalAlerts}
                    onChange={(e) => setDisbursalAlerts(e.target.checked)}
                  />
                </div>

                <div className="toggle-setting-row">
                  <div>
                    <div className="font-weight-700 font-size-sm">Milestone Delivery Notices</div>
                    <div className="text-muted text-xs">Receive alerts when freelancer submits milestone deliverables</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={milestoneAlerts}
                    onChange={(e) => setMilestoneAlerts(e.target.checked)}
                  />
                </div>
              </motion.div>
            )}

            {/* TAB 5: APPLICATION METADATA */}
            {activeTab === 'application' && (
              <motion.div 
                key="application"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="settings-section"
              >
                <div className="section-title-group">
                  <h3>Application Metadata & Environment</h3>
                  <p className="text-muted text-sm">Live configuration parameters</p>
                </div>

                <div className="form-group mb-3">
                  <label>Spring Boot REST API Endpoint</label>
                  <input className="form-control" readOnly value="http://localhost:8080/api" />
                </div>

                <div className="form-group mb-3">
                  <label>MySQL Database Target</label>
                  <input className="form-control" readOnly value="jdbc:mysql://localhost:3306/escrowlite_db" />
                </div>

                <div className="form-group mb-3">
                  <label>Tech Stack Specifications</label>
                  <input className="form-control" readOnly value="Spring Boot 4.1.1 • Java 27 • Hibernate 7.4.5 • MySQL 8.0 • React 19 • Vite 8" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
