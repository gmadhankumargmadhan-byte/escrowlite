import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  RefreshCw, 
  Menu, 
  ShieldCheck, 
  User, 
  LogOut,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ 
  activeTab, 
  onToggleMobileMenu, 
  onRefresh, 
  loading, 
  onOpenCommandPalette 
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'Payment Released', desc: '$1,500 disbursed to freelancer', time: '10m ago', unread: true },
    { id: 2, title: 'Milestone Delivered', desc: 'Frontend Redesign submitted by freelancer', time: '1h ago', unread: true },
    { id: 3, title: 'Escrow Secured', desc: '$5,000 locked for Mobile App MVP', time: '3h ago', unread: false },
  ];

  const pageTitles = {
    dashboard: 'Escrow Operations Center',
    clients: 'Client Directory & Portfolios',
    freelancers: 'Freelancer Directory & Talent',
    projects: 'Project Workspaces',
    'project-detail': 'Project Workspace Detail',
    milestones: 'Milestone Delivery Tracker',
    escrow: 'Escrow Financial Vault',
    status: 'System Health & Metrics',
    settings: 'Platform Settings',
  };

  return (
    <header className="floating-top-bar">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-btn" onClick={onToggleMobileMenu}>
        <Menu size={22} />
      </button>

      {/* Page Title & Breadcrumb */}
      <div className="top-bar-title-area">
        <span className="breadcrumb-path">EscrowLite /</span>
        <h2 className="top-page-title">{pageTitles[activeTab] || 'Workspace'}</h2>
      </div>

      {/* Center Search Trigger (Ctrl + K) */}
      <button 
        className="top-bar-search-btn"
        onClick={onOpenCommandPalette}
      >
        <Search size={16} />
        <span className="search-placeholder">Quick Search (Projects, Clients, Milestones)...</span>
        <kbd className="cmd-kbd">Ctrl K</kbd>
      </button>

      {/* Right Action Icons & Controls */}
      <div className="top-bar-actions">
        {/* Data Refresh */}
        <button 
          className={`top-icon-btn ${loading ? 'spinning' : ''}`}
          onClick={onRefresh}
          title="Refresh All Real Data"
        >
          <RefreshCw size={18} />
        </button>

        {/* Theme Switcher Toggle */}
        <button 
          className="top-icon-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <motion.div 
            key={theme}
            initial={{ rotate: -90, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber" /> : <Moon size={18} className="text-indigo" />}
          </motion.div>
        </button>

        {/* Notifications Center Popover */}
        <div className="popover-wrapper">
          <button 
            className="top-icon-btn"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="notification-unread-dot" />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                className="top-popover-panel notifications-panel"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="panel-header">
                  <h5>Notifications</h5>
                  <span className="badge badge-emerald">3 New</span>
                </div>
                <div className="panel-body">
                  {mockNotifications.map(n => (
                    <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                      <div className="item-icon">
                        <CheckCircle2 size={16} className="text-emerald" />
                      </div>
                      <div className="item-content">
                        <div className="item-title">{n.title}</div>
                        <div className="item-desc">{n.desc}</div>
                        <div className="item-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Card Popover */}
        <div className="popover-wrapper">
          <button 
            className="user-profile-trigger"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
          >
            <div className="avatar-circle">
              {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
            </div>
            <span className="user-name-display">{user?.name || user?.username || 'Admin'}</span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div 
                className="top-popover-panel profile-panel"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className="panel-user-card">
                  <div className="avatar-xl">
                    {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h6>{user?.name || user?.username || 'Admin User'}</h6>
                    <span className="text-muted text-xs">{user?.email || 'admin@escrowlite.com'}</span>
                  </div>
                </div>
                <div className="panel-divider" />
                <button className="panel-action-btn text-danger" onClick={logout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
