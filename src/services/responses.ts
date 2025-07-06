import api from './http';

export const listResponses = (formId: string) => api.get(`/responses/form/${formId}`);
export const getResponse = (id: string) => api.get(`/responses/${id}`);
export const submitResponse = (payload: any) => api.post('/responses/submit', payload); 