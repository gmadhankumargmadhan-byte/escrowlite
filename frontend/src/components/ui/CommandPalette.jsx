import React, { useState, useEffect } from 'react';
import { Search, X, FolderKanban, Users, UserCheck, Target, ArrowRight } from 'lucide-react';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  projects, 
  clients, 
  freelancers, 
  milestones, 
  onNavigate 
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const term = query.toLowerCase().trim();

  const filteredProjects = projects.filter((p) => p.title?.toLowerCase().includes(term));
  const filteredClients = clients.filter((c) => c.name?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term));
  const filteredFreelancers = freelancers.filter((f) => f.name?.toLowerCase().includes(term) || f.skills?.toLowerCase().includes(term));
  const filteredMilestones = milestones.filter((m) => m.title?.toLowerCase().includes(term));

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="command-search-header">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            className="command-search-input"
            placeholder="Type a command or search across projects, clients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="command-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="command-results-body">
          {term.length === 0 ? (
            <div className="command-quick-links">
              <span className="command-section-title">Quick Navigation</span>
              <div className="command-item" onClick={() => { onNavigate('dashboard'); onClose(); }}>
                <FolderKanban size={16} /> Go to Dashboard
              </div>
              <div className="command-item" onClick={() => { onNavigate('projects'); onClose(); }}>
                <FolderKanban size={16} /> Go to Projects Workspace
              </div>
              <div className="command-item" onClick={() => { onNavigate('milestones'); onClose(); }}>
                <Target size={16} /> Go to Milestones Action Hub
              </div>
            </div>
          ) : (
            <>
              {filteredProjects.length > 0 && (
                <div className="command-section">
                  <span className="command-section-title">Projects ({filteredProjects.length})</span>
                  {filteredProjects.map((p) => (
                    <div 
                      key={p.id} 
                      className="command-item" 
                      onClick={() => { onNavigate('project-detail', p.id); onClose(); }}
                    >
                      <FolderKanban size={16} />
                      <div className="flex-1">
                        <div className="font-weight-600">{p.title}</div>
                        <div className="text-muted text-xs">${p.totalAmount} • {p.status}</div>
                      </div>
                      <ArrowRight size={14} className="text-muted" />
                    </div>
                  ))}
                </div>
              )}

              {filteredClients.length > 0 && (
                <div className="command-section">
                  <span className="command-section-title">Clients ({filteredClients.length})</span>
                  {filteredClients.map((c) => (
                    <div 
                      key={c.id} 
                      className="command-item" 
                      onClick={() => { onNavigate('clients'); onClose(); }}
                    >
                      <Users size={16} />
                      <div className="flex-1">
                        <div className="font-weight-600">{c.name}</div>
                        <div className="text-muted text-xs">{c.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredFreelancers.length > 0 && (
                <div className="command-section">
                  <span className="command-section-title">Freelancers ({filteredFreelancers.length})</span>
                  {filteredFreelancers.map((f) => (
                    <div 
                      key={f.id} 
                      className="command-item" 
                      onClick={() => { onNavigate('freelancers'); onClose(); }}
                    >
                      <UserCheck size={16} />
                      <div className="flex-1">
                        <div className="font-weight-600">{f.name}</div>
                        <div className="text-muted text-xs">{f.skills || f.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredMilestones.length > 0 && (
                <div className="command-section">
                  <span className="command-section-title">Milestones ({filteredMilestones.length})</span>
                  {filteredMilestones.map((m) => (
                    <div 
                      key={m.id} 
                      className="command-item" 
                      onClick={() => { onNavigate('milestones'); onClose(); }}
                    >
                      <Target size={16} />
                      <div className="flex-1">
                        <div className="font-weight-600">{m.title}</div>
                        <div className="text-muted text-xs">${m.amount} • {m.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
