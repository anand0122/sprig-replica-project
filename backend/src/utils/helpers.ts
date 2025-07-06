export const generateSlug = (title: string, prefix: string = ''): string => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);

  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}-${base}-${timestamp}` : `${base}-${timestamp}`;
}; 