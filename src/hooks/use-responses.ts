import { useQuery } from '@tanstack/react-query';
import { listResponses } from '@/services/responses';

export const useResponses = (formId: string) =>
  useQuery({
    queryKey: ['responses', formId],
    queryFn: () => listResponses(formId).then(r => r.responses),
    enabled: !!formId,
  }); 