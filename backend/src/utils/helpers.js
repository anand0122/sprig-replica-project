export const generateSlug = (title, prefix = '') => {
  const base = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 60);
  const ts = Date.now().toString(36);
  return prefix ? `${prefix}-${base}-${ts}` : `${base}-${ts}`;
}; 