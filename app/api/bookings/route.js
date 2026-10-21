import { all, put, ensureSeed } from '@/lib/db';
import { notify } from '@/lib/notify';
import { site } from '@/lib/site';

const clean = (v, max = 300) => String(v ?? '').trim().slice(0, max);

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'Datos invalidos' }, { status: 400 }); }
  if (body.website) return Response.json({ ok: true }); // honeypot anti-bots

  const b = {
    eventName: clean(body.eventName, 120),
    date: clean(body.date, 10),
    venue: clean(body.venue, 120),
    city: clean(body.city, 120),
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    whatsapp: clean(body.whatsapp, 40),
    message: clean(body.message, 1000),
  };
  if (!b.eventName || !b.name) return Response.json({ error: 'Falta el nombre del evento o tu nombre' }, { status: 400 });
  if (!b.email && !b.whatsapp) return Response.json({ error: 'Deja un email o WhatsApp para responderte' }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date) || Number.isNaN(Date.parse(b.date))) return Response.json({ error: 'Fecha invalida' }, { status: 400 });
  if (b.date < new Date().toISOString().slice(0, 10)) return Response.json({ error: 'La fecha ya paso' }, { status: 400 });

  try {
    await ensureSeed(site.blockedDates);
    const [blocked, bookings] = await Promise.all([all('blocked'), all('bookings')]);
    const taken = blocked[b.date] || Object.values(bookings).some((x) => x.date === b.date && x.status === 'confirmed');
    if (taken) return Response.json({ error: 'Esa fecha ya esta ocupada' }, { status: 409 });

    const id = crypto.randomUUID();
    await put('bookings', id, { ...b, id, status: 'pending', createdAt: new Date().toISOString() });

    await notify({
      title: `Nueva reserva: ${b.eventName}`,
      message: `${b.date}${b.city ? ' · ' + b.city : ''}\n${b.name} · ${b.email || b.whatsapp}`,
      click: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin` : undefined,
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'No se pudo guardar. Intenta de nuevo o escribeme directo.' }, { status: 500 });
  }
}
