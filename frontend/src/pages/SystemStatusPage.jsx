import React from 'react';
import { Activity, ShieldCheck, Database, Server, RefreshCw } from 'lucide-react';

export default function SystemStatusPage({ healthStatus, loading, onRefresh }) {
  const isUp = healthStatus?.status === 'UP';

  return (
    <div className="system-status-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Spring Boot System Health Monitor</h2>
            <p className="card-subtitle">Real-time status check for EscrowLite backend REST services</p>
          </div>
          <button className="btn btn-secondary" onClick={onRefresh} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Check Status
          </button>
        </div>

        <div className="health-status-banner">
          <div className={`health-status-icon ${isUp ? 'status-up' : 'status-down'}`}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="health-title">
              System Status: {isUp ? 'Operational (UP)' : 'Checking / Down'}
            </h3>
            <p className="health-subtitle">
              {isUp 
                ? 'All Spring Boot 4 REST APIs and JPA repository connections are functioning properly.'
                : 'Unable to reach backend REST API. Check that Spring Boot is running on port 8080.'}
            </p>
          </div>
        </div>

        <div className="stats-grid mt-4">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">Backend Application</span>
              <Server size={18} className="text-muted" />
            </div>
            <div className="stat-value font-size-md">{healthStatus?.application || 'EscrowLite'}</div>
            <div className="stat-subtext">Spring Boot 4.1.1 (Java 27)</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">Health Check Endpoint</span>
              <Activity size={18} className="text-muted" />
            </div>
            <div className="stat-value font-size-md">GET /api/health</div>
            <div className="stat-subtext">http://localhost:8080/api/health</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">MySQL Database</span>
              <Database size={18} className="text-muted" />
            </div>
            <div className="stat-value font-size-md">escrowlite_db</div>
            <div className="stat-subtext">Port 3306 (HikariCP Connected)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
