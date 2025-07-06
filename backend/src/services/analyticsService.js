export const trackFormEvent = async (formId, userId, event, metadata = {}) => {
  console.log('Analytics event', { formId, userId, event, metadata });
}; 