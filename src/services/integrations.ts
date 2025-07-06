import api from './http';

export interface IntegrationPayload {
  provider: 'GOOGLE_SHEETS' | 'NOTION';
  name?: string;
  description?: string;
  config?: Record<string, any>;
  credentials?: Record<string, any>;
}

export const listIntegrations = () => api.get('/integrations');

export const createIntegration = (payload: IntegrationPayload) =>
  api.post('/integrations', payload);

export const updateIntegration = (id: string, payload: Partial<IntegrationPayload>) =>
  api.put(`/integrations/${id}`, payload);

export const deactivateIntegration = (id: string) =>
  api.delete(`/integrations/${id}`); 