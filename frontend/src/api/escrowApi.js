import apiClient from './client';

export const healthApi = {
  getHealth: () => apiClient.get('/health'),
};

export const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const clientApi = {
  getAll: () => apiClient.get('/clients'),
  getById: (id) => apiClient.get(`/clients/${id}`),
  create: (data) => apiClient.post('/clients', data),
  update: (id, data) => apiClient.put(`/clients/${id}`, data),
  delete: (id) => apiClient.delete(`/clients/${id}`),
};

export const freelancerApi = {
  getAll: () => apiClient.get('/freelancers'),
  getById: (id) => apiClient.get(`/freelancers/${id}`),
  create: (data) => apiClient.post('/freelancers', data),
  update: (id, data) => apiClient.put(`/freelancers/${id}`, data),
  delete: (id) => apiClient.delete(`/freelancers/${id}`),
};

export const projectApi = {
  getAll: () => apiClient.get('/projects'),
  getById: (id) => apiClient.get(`/projects/${id}`),
  create: (data) => apiClient.post('/projects', data),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
  getEscrow: (id) => apiClient.get(`/projects/${id}/escrow`),
};

export const milestoneApi = {
  getAll: () => apiClient.get('/milestones'),
  getByProject: (projectId) => apiClient.get(`/projects/${projectId}/milestones`),
  getById: (id) => apiClient.get(`/milestones/${id}`),
  create: (data) => apiClient.post('/milestones', data),
  createForProject: (projectId, data) => apiClient.post(`/projects/${projectId}/milestones`, data),
  update: (id, data) => apiClient.put(`/milestones/${id}`, data),
  delete: (id) => apiClient.delete(`/milestones/${id}`),
  deliver: (id) => apiClient.put(`/milestones/${id}/deliver`),
  approve: (id) => apiClient.put(`/milestones/${id}/approve`),
  rework: (id) => apiClient.put(`/milestones/${id}/rework`),
  release: (id) => apiClient.post(`/milestones/${id}/release`),
};

export const releaseApi = {
  getAll: () => apiClient.get('/releases'),
  create: (milestoneId) => apiClient.post('/releases', { milestoneId }),
};
