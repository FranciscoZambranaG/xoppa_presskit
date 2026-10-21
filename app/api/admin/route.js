import { all, put, remove } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!isAdmin(req)) return Response.json({ error: 'No autorizado' }, { status: 401 });
  const [blocked, bookings] = await Promise.all([all('blocked'), all('bookings')]);
  return Response.json({
    blocked,
    bookings: Object.values(bookings).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  });
}

export async function POST(req) {
  if (!isAdmin(req)) return Response.json({ error: 'No autorizado' }, { status: 401 });
  const { action, id, date, label, status } = await req.json();
  if (action === 'status' && ['pending', 'confirmed', 'rejected'].includes(status)) {
    const b = (await all('bookings'))[id];
    if (!b) return Response.json({ error: 'No existe' }, { status: 404 });
    await put('bookings', id, { ...b, status });
  } else if (action === 'delete') {
    await remove('bookings', id);
  } else if (action === 'block' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    await put('blocked', date, { label: String(label || '').slice(0, 120) });
  } else if (action === 'unblock') {
    await remove('blocked', date);
  } else {
    return Response.json({ error: 'Accion invalida' }, { status: 400 });
  }
  return Response.json({ ok: true });
}
