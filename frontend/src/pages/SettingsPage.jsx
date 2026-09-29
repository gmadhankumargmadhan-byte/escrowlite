import React from 'react';
import { Settings, Server, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Platform Configuration</h2>
            <p className="card-subtitle">EscrowLite system parameters and environment variables</p>
          </div>
        </div>

        <div className="form-group">
          <label>API Base URL</label>
          <input className="form-control" readOnly value="http://localhost:8080/api" />
          <span className="text-muted text-xs">Configured via VITE_API_BASE_URL environment variable.</span>
        </div>

        <div className="form-group">
          <label>Frontend Development Server</label>
          <input className="form-control" readOnly value="http://localhost:5173" />
          <span className="text-muted text-xs">Vite React Hot Module Replacement enabled.</span>
        </div>

        <div className="form-group">
          <label>Database Connection</label>
          <input className="form-control" readOnly value="jdbc:mysql://localhost:3306/escrowlite_db" />
          <span className="text-muted text-xs">MySQL 8.0 with Hibernate 7 DDL update.</span>
        </div>
      </div>
    </div>
  );
}
