import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Briefcase, 
  Target, 
  ShieldCheck, 
  Activity, 
  Settings, 
  LogOut, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { logout, user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'freelancers', label: 'Freelancers', icon: UserCheck },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'escrow', label: 'Escrow Vault', icon: ShieldCheck },
    { id: 'status', label: 'System Status', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onClose} />
      )}

      <motion.aside 
        className={`spatial-nav-rail ${isOpen ? 'mobile-open' : ''} ${isHovered ? 'rail-expanded' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Brand Logo & Header */}
        <div className="rail-brand-header">
          <div className="rail-brand-icon">
            <ShieldCheck size={24} color="#fff" />
          </div>
          <div className="rail-brand-text">
            <span className="brand-name">EscrowLite</span>
            <span className="brand-tag">2.5D SAAS</span>
          </div>
        </div>

        {/* Navigation Rail Links */}
        <nav className="rail-nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                className={`rail-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
              >
                {/* Active Indicator Pillar */}
                {isActive && (
                  <motion.div 
                    layoutId="activeRailIndicator"
                    className="rail-active-pillar"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="rail-icon-wrapper">
                  <Icon size={20} />
                </div>

                <span className="rail-label-text">{item.label}</span>

                {isActive && <ChevronRight size={14} className="rail-active-arrow" />}
              </button>
            );
          })}
        </nav>

        {/* User Account / Logout Action */}
        <div className="rail-user-footer">
          <div className="user-avatar-mini" title={user?.name || user?.username || 'User'}>
            {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
          </div>
          
          <div className="user-details-mini">
            <span className="user-name-text">{user?.name || user?.username || 'Admin'}</span>
            <span className="user-role-text">{user?.role || 'ROLE_CLIENT'}</span>
          </div>

          <button 
            className="rail-logout-btn" 
            onClick={logout} 
            title="Sign out of workspace"
          >
            <LogOut size={18} />
          </button>
        </div>
      </motion.aside>
    </>
  );
}
