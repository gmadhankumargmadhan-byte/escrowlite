import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FolderKanban, 
  Target, 
  ShieldCheck, 
  Activity, 
  DollarSign, 
  Settings,
  LogOut,
  Sun,
  Moon,
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'freelancers', label: 'Freelancers', icon: UserCheck },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'escrow', label: 'Escrow & Releases', icon: DollarSign },
    { id: 'status', label: 'System Status', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div>
          <div className="brand">
            <div className="brand-icon">
              <ShieldCheck size={22} color="#fff" />
            </div>
            <div className="brand-text-container">
              <span className="brand-name">EscrowLite</span>
              <span className="brand-tagline">FinTech Escrow</span>
            </div>
            <button className="sidebar-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (onClose) onClose();
                      }}
                    >
                      <Icon size={18} className="nav-icon" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer with User Profile, Theme Switcher & Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-theme-toggle mb-3">
            <button className="theme-switch-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          <div className="sidebar-user-card">
            <div className="user-avatar-circle">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || user?.username || 'User'}</span>
              <span className="user-role">{user?.role || 'Administrator'}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
