import { Redis } from '@upstash/redis';
import { promises as fs } from 'fs';
import path from 'path';

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Respaldo local para desarrollo (no funciona en Vercel: ahi hace falta Redis)
const file = path.join(process.cwd(), '.data', 'db.json');
async function readLocal() {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return {}; }
}
async function writeLocal(data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Colecciones: "bookings" (id -> reserva) y "blocked" (YYYY-MM-DD -> { label })
export async function all(coll) {
  if (redis) return (await redis.hgetall(coll)) || {};
  return (await readLocal())[coll] || {};
}
export async function put(coll, id, value) {
  if (redis) return void (await redis.hset(coll, { [id]: value }));
  const data = await readLocal();
  data[coll] = { ...(data[coll] || {}), [id]: value };
  await writeLocal(data);
}
export async function remove(coll, id) {
  if (redis) return void (await redis.hdel(coll, id));
  const data = await readLocal();
  if (data[coll]) delete data[coll][id];
  await writeLocal(data);
}

// Carga una sola vez las fechas iniciales de lib/site.js; despues se administran en /admin
export async function ensureSeed(dates) {
  if ((await all('meta')).seeded) return;
  for (const { date, label } of dates) await put('blocked', date, { label });
  await put('meta', 'seeded', true);
}
