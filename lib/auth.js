import { timingSafeEqual } from 'crypto';

export function isAdmin(req) {
  const given = Buffer.from(req.headers.get('x-admin-password') || '');
  const real = Buffer.from(process.env.ADMIN_PASSWORD || '');
  return real.length > 0 && given.length === real.length && timingSafeEqual(given, real);
}
