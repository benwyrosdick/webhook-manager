// Loopback and link-local addresses are rejected so a saved target cannot be
// pointed at the cloud metadata service or this machine. Private LAN addresses
// stay allowed so a homelab target still works.
const BLOCKED_HOSTS = new Set(['localhost', 'metadata.google.internal']);

function isIpv4(value: string): boolean {
  const parts = value.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function isBlockedIp(address: string): boolean {
  const ip = address.toLowerCase().startsWith('::ffff:') ? address.slice(7) : address.toLowerCase();
  if (ip === '::1' || ip === '::' || ip === '0.0.0.0') return true;

  if (isIpv4(ip)) {
    const [a, b] = ip.split('.').map((part) => Number(part));
    if (a === 0 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    return false;
  }

  if (ip.includes(':')) {
    return ip === '::1' || ip.startsWith('fe8') || ip.startsWith('fe9') || ip.startsWith('fea') || ip.startsWith('feb');
  }

  return false;
}

export function targetUrlError(value: string | null | undefined): string | null {
  const target = value?.trim() ?? '';
  if (!target) return null;

  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return 'Target URL must be a valid http(s) URL';
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return 'Target URL must use http or https';
  }

  const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (!host || BLOCKED_HOSTS.has(host) || host.endsWith('.localhost')) {
    return 'Target URL host is not allowed';
  }

  if (isBlockedIp(host)) {
    return 'Target URL address is not allowed';
  }

  return null;
}
