import React from 'react';
import { Menu, Search, Bell, RefreshCw, Sun, Moon, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ 
  activeTab, 
  onToggleMobileMenu, 
  onRefresh, 
  loading, 
  onOpenCommandPalette 
}) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Dashboard';
      case 'clients': return 'Client Registry';
      case 'freelancers': return 'Freelancer Directory';
      case 'projects': return 'Project Workspace';
      case 'project-detail': return 'Project Details';
      case 'milestones': return 'Milestones & Action Hub';
      case 'escrow': return 'Escrow Ledger & Releases';
      case 'status': return 'System Health Monitor';
      case 'settings': return 'Platform Settings';
      default: return 'EscrowLite Platform';
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="mobile-menu-toggle" onClick={onToggleMobileMenu} aria-label="Toggle Menu">
          <Menu size={20} />
        </button>
        <h1 className="page-title">{getTitle()}</h1>
      </div>

      <div className="navbar-right">
        {/* Command Palette Trigger */}
        <button className="command-palette-trigger" onClick={onOpenCommandPalette}>
          <Search size={14} />
          <span>Search or command...</span>
          <kbd className="command-kbd"><Command size={10} /> K</kbd>
        </button>

        {/* Theme Toggle Button */}
        <button className="btn btn-icon btn-secondary" onClick={toggleTheme} title="Toggle Light/Dark Theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Refresh Action */}
        <button 
          className="btn btn-icon btn-secondary" 
          onClick={onRefresh} 
          disabled={loading}
          title="Refresh Backend Data"
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
        </button>

        {/* Notifications Icon */}
        <button className="btn btn-icon btn-secondary" title="Notifications">
          <Bell size={16} />
        </button>

        {/* User Profile Avatar */}
        <div className="user-profile-avatar" title={user?.email || 'User'}>
          <div className="avatar-mini font-weight-700">
            {user?.name ? user.name.substring(0, 1).toUpperCase() : 'U'}
          </div>
          <span className="user-name-desktop">{user?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
