import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import CommandPalette from './components/ui/CommandPalette';

import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import FreelancersPage from './pages/FreelancersPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import MilestonesPage from './pages/MilestonesPage';
import EscrowReleasesPage from './pages/EscrowReleasesPage';
import SystemStatusPage from './pages/SystemStatusPage';
import SettingsPage from './pages/SettingsPage';

import { 
  healthApi, 
  clientApi, 
  freelancerApi, 
  projectApi, 
  milestoneApi, 
  releaseApi 
} from './api/escrowApi';
import './App.css';

import RegisterPage from './pages/RegisterPage';

function MainAppShell() {
  const { isAuthenticated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals from Dashboard triggers
  const [openProjectModal, setOpenProjectModal] = useState(false);

  // Datasets
  const [clients, setClients] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [releases, setReleases] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setLoading(true);
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
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (tab, projectId = null) => {
    setActiveTab(tab);
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  };

  // If not authenticated, render the Login or Register Page
  if (!isAuthenticated) {
    return isRegistering ? (
      <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Workspace */}
      <main className="main-content">
        <Navbar
          activeTab={activeTab}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onRefresh={loadAllData}
          loading={loading}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <div className="content-body">
          {activeTab === 'dashboard' && (
            <DashboardPage
              clients={clients}
              freelancers={freelancers}
              projects={projects}
              milestones={milestones}
              releases={releases}
              healthStatus={healthStatus}
              loading={loading}
              onNavigate={handleNavigate}
              onOpenCreateProject={() => setActiveTab('projects')}
              onOpenCreateClient={() => setActiveTab('clients')}
              onOpenCreateFreelancer={() => setActiveTab('freelancers')}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsPage
              clients={clients}
              loading={loading}
              onRefresh={loadAllData}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'freelancers' && (
            <FreelancersPage
              freelancers={freelancers}
              loading={loading}
              onRefresh={loadAllData}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage
              projects={projects}
              clients={clients}
              freelancers={freelancers}
              loading={loading}
              onRefresh={loadAllData}
              searchTerm={searchTerm}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'project-detail' && (
            <ProjectDetailPage
              projectId={selectedProjectId}
              onBack={() => setActiveTab('projects')}
              clients={clients}
              freelancers={freelancers}
              onRefreshAll={loadAllData}
            />
          )}

          {activeTab === 'milestones' && (
            <MilestonesPage
              milestones={milestones}
              projects={projects}
              clients={clients}
              freelancers={freelancers}
              loading={loading}
              onRefresh={loadAllData}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'escrow' && (
            <EscrowReleasesPage
              releases={releases}
              projects={projects}
              loading={loading}
            />
          )}

          {activeTab === 'status' && (
            <SystemStatusPage
              healthStatus={healthStatus}
              loading={loading}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </main>

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        projects={projects}
        clients={clients}
        freelancers={freelancers}
        milestones={milestones}
        onNavigate={handleNavigate}
      />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainAppShell />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
