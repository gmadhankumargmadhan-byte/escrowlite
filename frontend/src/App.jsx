import React, { useState, useEffect } from 'react';
import { 
  healthApi, 
  clientApi, 
  freelancerApi, 
  projectApi, 
  milestoneApi, 
  releaseApi 
} from './api/escrowApi';
import './App.css';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FolderKanban, 
  Target, 
  ShieldCheck, 
  Activity, 
  Plus, 
  Trash2, 
  CheckCircle, 
  RefreshCw, 
  DollarSign, 
  Send 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [releases, setReleases] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '' });

  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const [freelancerForm, setFreelancerForm] = useState({ name: '', email: '', skills: '', hourlyRate: '' });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', totalAmount: '', clientId: '', freelancerId: '' });

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ projectId: '', title: '', description: '', amount: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hRes, cRes, fRes, pRes, mRes, rRes] = await Promise.allSettled([
        healthApi.getHealth(),
        clientApi.getAll(),
        freelancerApi.getAll(),
        projectApi.getAll(),
        milestoneApi.getAll(),
        releaseApi.getAll(),
      ]);

      if (hRes.status === 'fulfilled') setHealthStatus(hRes.value.data);
      if (cRes.status === 'fulfilled') setClients(cRes.value.data);
      if (fRes.status === 'fulfilled') setFreelancers(fRes.value.data);
      if (pRes.status === 'fulfilled') setProjects(pRes.value.data);
      if (mRes.status === 'fulfilled') setMilestones(mRes.value.data);
      if (rRes.status === 'fulfilled') setReleases(rRes.value.data);
    } catch (err) {
      setError('Failed to fetch data from Spring Boot backend.');
    } finally {
      setLoading(false);
    }
  };

  // Client Handlers
  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await clientApi.create(clientForm);
      setClientForm({ name: '', email: '', phone: '' });
      setShowClientModal(false);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating client');
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Delete this client?')) {
      await clientApi.delete(id);
      loadAllData();
    }
  };

  // Freelancer Handlers
  const handleCreateFreelancer = async (e) => {
    e.preventDefault();
    try {
      await freelancerApi.create({
        ...freelancerForm,
        hourlyRate: freelancerForm.hourlyRate ? parseFloat(freelancerForm.hourlyRate) : null
      });
      setFreelancerForm({ name: '', email: '', skills: '', hourlyRate: '' });
      setShowFreelancerModal(false);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating freelancer');
    }
  };

  const handleDeleteFreelancer = async (id) => {
    if (window.confirm('Delete this freelancer?')) {
      await freelancerApi.delete(id);
      loadAllData();
    }
  };

  // Project Handlers
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: projectForm.title,
        description: projectForm.description,
        totalAmount: parseFloat(projectForm.totalAmount),
        clientId: parseInt(projectForm.clientId),
        freelancerId: parseInt(projectForm.freelancerId),
        milestones: []
      };
      await projectApi.create(payload);
      setProjectForm({ title: '', description: '', totalAmount: '', clientId: '', freelancerId: '' });
      setShowProjectModal(false);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      await projectApi.delete(id);
      loadAllData();
    }
  };

  // Milestone Handlers
  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: milestoneForm.title,
        description: milestoneForm.description,
        amount: parseFloat(milestoneForm.amount)
      };
      await milestoneApi.createForProject(parseInt(milestoneForm.projectId), payload);
      setMilestoneForm({ projectId: '', title: '', description: '', amount: '' });
      setShowMilestoneModal(false);
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating milestone');
    }
  };

  const handleDeliver = async (id) => {
    await milestoneApi.deliver(id);
    loadAllData();
  };

  const handleApprove = async (id) => {
    await milestoneApi.approve(id);
    loadAllData();
  };

  const handleRework = async (id) => {
    await milestoneApi.rework(id);
    loadAllData();
  };

  const handleRelease = async (id) => {
    if (window.confirm('Release milestone payment from Escrow?')) {
      await milestoneApi.release(id);
      loadAllData();
    }
  };

  // Summary Calculations
  const totalBudget = projects.reduce((acc, p) => acc + (p.totalAmount || 0), 0);
  const totalReleased = releases.reduce((acc, r) => acc + (r.amount || 0), 0);
  const remainingEscrow = totalBudget - totalReleased;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={20} color="#fff" />
          </div>
          <span>EscrowLite</span>
        </div>

        <nav>
          <ul className="nav-list">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} /> Dashboard
            </li>
            <li className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>
              <Users size={18} /> Clients
            </li>
            <li className={`nav-item ${activeTab === 'freelancers' ? 'active' : ''}`} onClick={() => setActiveTab('freelancers')}>
              <UserCheck size={18} /> Freelancers
            </li>
            <li className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
              <FolderKanban size={18} /> Projects
            </li>
            <li className={`nav-item ${activeTab === 'milestones' ? 'active' : ''}`} onClick={() => setActiveTab('milestones')}>
              <Target size={18} /> Milestones
            </li>
            <li className={`nav-item ${activeTab === 'escrow' ? 'active' : ''}`} onClick={() => setActiveTab('escrow')}>
              <DollarSign size={18} /> Escrow & Releases
            </li>
            <li className={`nav-item ${activeTab === 'status' ? 'active' : ''}`} onClick={() => setActiveTab('status')}>
              <Activity size={18} /> System Status
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-navbar">
          <h1 className="page-title">{activeTab.toUpperCase()}</h1>
          <button className="btn btn-secondary" onClick={loadAllData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        <div className="content-body">
          {error && <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>{error}</div>}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-title">Total Clients</div>
                  <div className="stat-value">{clients.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Total Freelancers</div>
                  <div className="stat-value">{freelancers.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Total Projects</div>
                  <div className="stat-value">{projects.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Total Escrow Budget</div>
                  <div className="stat-value">${totalBudget.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Total Released</div>
                  <div className="stat-value" style={{ color: '#10b981' }}>${totalReleased.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Remaining Escrow</div>
                  <div className="stat-value" style={{ color: '#f59e0b' }}>${remainingEscrow.toLocaleString()}</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2>Recent Projects</h2>
                </div>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Budget</th>
                        <th>Status</th>
                        <th>Client ID</th>
                        <th>Freelancer ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id}>
                          <td><strong>{p.title}</strong></td>
                          <td>${p.totalAmount}</td>
                          <td><span className="badge badge-approved">{p.status}</span></td>
                          <td>{p.clientId}</td>
                          <td>{p.freelancerId}</td>
                        </tr>
                      ))}
                      {projects.length === 0 && <tr><td colSpan="5">No projects created yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CLIENTS TAB */}
          {activeTab === 'clients' && (
            <div className="card">
              <div className="card-header">
                <h2>Clients</h2>
                <button className="btn btn-primary" onClick={() => setShowClientModal(true)}>
                  <Plus size={16} /> Add Client
                </button>
              </div>

              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.email}</td>
                        <td>{c.phone || 'N/A'}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => handleDeleteClient(c.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {clients.length === 0 && <tr><td colSpan="5">No clients found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FREELANCERS TAB */}
          {activeTab === 'freelancers' && (
            <div className="card">
              <div className="card-header">
                <h2>Freelancers</h2>
                <button className="btn btn-primary" onClick={() => setShowFreelancerModal(true)}>
                  <Plus size={16} /> Add Freelancer
                </button>
              </div>

              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Skills</th>
                      <th>Hourly Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {freelancers.map(f => (
                      <tr key={f.id}>
                        <td>{f.id}</td>
                        <td><strong>{f.name}</strong></td>
                        <td>{f.email}</td>
                        <td>{f.skills || 'N/A'}</td>
                        <td>{f.hourlyRate ? `$${f.hourlyRate}/hr` : 'N/A'}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => handleDeleteFreelancer(f.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {freelancers.length === 0 && <tr><td colSpan="6">No freelancers found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="card">
              <div className="card-header">
                <h2>Projects</h2>
                <button className="btn btn-primary" onClick={() => setShowProjectModal(true)}>
                  <Plus size={16} /> Create Project
                </button>
              </div>

              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th>Client</th>
                      <th>Freelancer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td><strong>{p.title}</strong></td>
                        <td>{p.description}</td>
                        <td>${p.totalAmount}</td>
                        <td><span className="badge badge-approved">{p.status}</span></td>
                        <td>Client #{p.clientId}</td>
                        <td>Freelancer #{p.freelancerId}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => handleDeleteProject(p.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && <tr><td colSpan="8">No projects created yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MILESTONES TAB */}
          {activeTab === 'milestones' && (
            <div className="card">
              <div className="card-header">
                <h2>Milestones & Escrow Release</h2>
                <button className="btn btn-primary" onClick={() => setShowMilestoneModal(true)}>
                  <Plus size={16} /> Add Milestone
                </button>
              </div>

              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Project ID</th>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map(m => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>Project #{m.projectId}</td>
                        <td><strong>{m.title}</strong></td>
                        <td>${m.amount}</td>
                        <td>
                          <span className={`badge badge-${m.status?.toLowerCase()}`}>
                            {m.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {m.status === 'PENDING' && (
                              <button className="btn btn-secondary" onClick={() => handleDeliver(m.id)}>
                                <Send size={12} /> Deliver
                              </button>
                            )}
                            {m.status === 'DELIVERED' && (
                              <>
                                <button className="btn btn-success" onClick={() => handleApprove(m.id)}>
                                  <CheckCircle size={12} /> Approve
                                </button>
                                <button className="btn btn-danger" onClick={() => handleRework(m.id)}>
                                  Rework
                                </button>
                              </>
                            )}
                            {m.status === 'APPROVED' && (
                              <button className="btn btn-primary" onClick={() => handleRelease(m.id)}>
                                <DollarSign size={12} /> Release Payment
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {milestones.length === 0 && <tr><td colSpan="6">No milestones available.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ESCROW & RELEASES TAB */}
          {activeTab === 'escrow' && (
            <div className="card">
              <div className="card-header">
                <h2>Escrow Payment Release Log</h2>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Release ID</th>
                      <th>Project ID</th>
                      <th>Milestone ID</th>
                      <th>Amount Released</th>
                      <th>Date / Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {releases.map(r => (
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>Project #{r.project?.id || r.projectId}</td>
                        <td>Milestone #{r.milestone?.id || r.milestoneId}</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>${r.amount}</td>
                        <td>{r.releasedAt ? new Date(r.releasedAt).toLocaleString() : 'Just now'}</td>
                      </tr>
                    ))}
                    {releases.length === 0 && <tr><td colSpan="5">No payment releases recorded yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SYSTEM STATUS TAB */}
          {activeTab === 'status' && (
            <div className="card">
              <div className="card-header">
                <h2>Spring Boot Backend Health Status</h2>
              </div>
              <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '8px', fontFamily: 'monospace' }}>
                <p>Status: <span style={{ color: '#10b981', fontWeight: 700 }}>{healthStatus?.status || 'UP'}</span></p>
                <p>Application: <span>{healthStatus?.application || 'EscrowLite'}</span></p>
                <p>API Endpoint: <span>http://localhost:8080/api/health</span></p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CLIENT MODAL */}
      {showClientModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Add New Client</h3>
            <form onSubmit={handleCreateClient}>
              <div className="form-group">
                <label>Name</label>
                <input className="form-control" required value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" required value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input className="form-control" value={clientForm.phone} onChange={e => setClientForm({...clientForm, phone: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowClientModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FREELANCER MODAL */}
      {showFreelancerModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Add New Freelancer</h3>
            <form onSubmit={handleCreateFreelancer}>
              <div className="form-group">
                <label>Name</label>
                <input className="form-control" required value={freelancerForm.name} onChange={e => setFreelancerForm({...freelancerForm, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" required value={freelancerForm.email} onChange={e => setFreelancerForm({...freelancerForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Skills</label>
                <input className="form-control" value={freelancerForm.skills} onChange={e => setFreelancerForm({...freelancerForm, skills: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Hourly Rate ($)</label>
                <input type="number" className="form-control" value={freelancerForm.hourlyRate} onChange={e => setFreelancerForm({...freelancerForm, hourlyRate: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFreelancerModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {showProjectModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Create Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Title</label>
                <input className="form-control" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Total Budget ($)</label>
                <input type="number" className="form-control" required value={projectForm.totalAmount} onChange={e => setProjectForm({...projectForm, totalAmount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Client</label>
                <select className="form-control" required value={projectForm.clientId} onChange={e => setProjectForm({...projectForm, clientId: e.target.value})}>
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} (#{c.id})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Freelancer</label>
                <select className="form-control" required value={projectForm.freelancerId} onChange={e => setProjectForm({...projectForm, freelancerId: e.target.value})}>
                  <option value="">Select Freelancer</option>
                  {freelancers.map(f => <option key={f.id} value={f.id}>{f.name} (#{f.id})</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProjectModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MILESTONE MODAL */}
      {showMilestoneModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Add Milestone</h3>
            <form onSubmit={handleCreateMilestone}>
              <div className="form-group">
                <label>Project</label>
                <select className="form-control" required value={milestoneForm.projectId} onChange={e => setMilestoneForm({...milestoneForm, projectId: e.target.value})}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title} (#{p.id})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Milestone Title</label>
                <input className="form-control" required value={milestoneForm.title} onChange={e => setMilestoneForm({...milestoneForm, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" value={milestoneForm.description} onChange={e => setMilestoneForm({...milestoneForm, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input type="number" className="form-control" required value={milestoneForm.amount} onChange={e => setMilestoneForm({...milestoneForm, amount: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMilestoneModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
