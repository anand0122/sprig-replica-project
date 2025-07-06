import { logger } from '../utils/logger.js';

export const trackFormEvent = async (
  formId: string,
  userId: string,
  event: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  // In production this would push to analytics DB / queue
  logger.info('Analytics Event', { formId, userId, event, metadata });
}; 