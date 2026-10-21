'use client';
import { useState } from 'react';

export default function Admin() {
  const [pw, setPw] = useState('');
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [block, setBlock] = useState({ date: '', label: '' });

  const call = (method, body) => fetch('/api/admin', { method, headers: { 'content-type': 'application/json', 'x-admin-password': pw }, body: body && JSON.stringify(body) });
  async function load(e) {
    e?.preventDefault();
    const r = await call('GET');
    if (!r.ok) return setErr('Clave incorrecta');
    setErr(''); setData(await r.json());
  }
  const act = async (body) => { await call('POST', body); load(); };

  if (!data) return (
    <main className="admin"><form onSubmit={load}>
      <h1>ADMIN</h1>
      <input type="password" placeholder="Clave" value={pw} onChange={(e) => setPw(e.target.value)} />
      <button className="cta" type="submit">ENTRAR <span>→</span></button>
      {err && <p className="note error">{err}</p>}
    </form></main>
  );

  return (
    <main className="admin">
      <h1>RESERVAS</h1>
      {data.bookings.length === 0 && <p>Sin solicitudes todavia.</p>}
      {data.bookings.map((b) => (
        <article key={b.id} className={`panel st-${b.status}`}>
          <h3>{b.eventName} <small>{b.date} · {b.status}</small></h3>
          <p>{b.venue} {b.city && `· ${b.city}`}<br />{b.name} · {b.email} {b.whatsapp}</p>
          {b.message && <p className="bio">{b.message}</p>}
          <div className="row">
            <button onClick={() => act({ action: 'status', id: b.id, status: 'confirmed' })}>Confirmar</button>
            <button onClick={() => act({ action: 'status', id: b.id, status: 'rejected' })}>Rechazar</button>
            <button onClick={() => act({ action: 'delete', id: b.id })}>Borrar</button>
          </div>
        </article>
      ))}
      <h1>FECHAS BLOQUEADAS</h1>
      <div className="row">
        <input type="date" value={block.date} onChange={(e) => setBlock({ ...block, date: e.target.value })} />
        <input placeholder="Nota (opcional)" value={block.label} onChange={(e) => setBlock({ ...block, label: e.target.value })} />
        <button onClick={() => block.date && act({ action: 'block', ...block })}>Bloquear</button>
      </div>
      {Object.entries(data.blocked).sort().map(([d, v]) => (
        <p key={d}>{d} {v.label && `· ${v.label}`} <button onClick={() => act({ action: 'unblock', date: d })}>Liberar</button></p>
      ))}
    </main>
  );
}
