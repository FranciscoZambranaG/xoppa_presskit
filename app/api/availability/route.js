import { all, ensureSeed } from '@/lib/db';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

// Solo expone fechas y estado, nunca datos de quien reservo
export async function GET() {
  await ensureSeed(site.blockedDates);
  const [blocked, bookings] = await Promise.all([all('blocked'), all('bookings')]);
  const dates = {};
  for (const d of Object.keys(blocked)) dates[d] = 'busy';
  for (const b of Object.values(bookings)) {
    if (b.status === 'confirmed') dates[b.date] = 'busy';
    else if (b.status === 'pending' && !dates[b.date]) dates[b.date] = 'pending';
  }
  return Response.json({ dates });
}
