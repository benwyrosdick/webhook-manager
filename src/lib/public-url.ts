export function publicOrigin(): string {
  const configured = import.meta.env.VITE_API_BASE;
  if (typeof configured === 'string' && configured.trim()) {
    return configured.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

export function webhookUrl(path: string): string {
  const origin = publicOrigin();
  return `${origin}/webhook/${path}`;
}
