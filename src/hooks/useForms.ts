import { useQuery } from '@tanstack/react-query';
import api from '@/services/http';

export function useForms() {
  return useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      try {
        const res: any = await api.get('/forms');
        if (Array.isArray(res) && res.length) return res;
      } catch {
        // ignore error and fall back
      }
      // Fallback to localStorage saved forms
      return JSON.parse(localStorage.getItem('savedForms') || '[]');
    },
    initialData: [],
  });
} 