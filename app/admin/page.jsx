'use client';
import { useState } from 'react';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

// Boton de eliminar con confirmacion en pantalla (sin ventanas del navegador)
function Del({ id, ask, setAsk, onYes, text }) {
  if (ask !== id) return <button className="btn danger" onClick={() => setAsk(id)}>{text}</button>;
  return (
    <span className="row">
      <button className="btn danger on" onClick={onYes}>Si, eliminar</button>
      <button className="btn" onClick={() => setAsk(null)}>Cancelar</button>
    </span>
  );
}

export default function Admin() {
  const [pw, setPw] = useState('');
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('reservas');
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [sel, setSel] = useState(null);
  const [label, setLabel] = useState('');
  const [ask, setAsk] = useState(null); // elemento pendiente de confirmar borrado

  const call = (method, body) => fetch('/api/admin', { method, headers: { 'content-type': 'application/json', 'x-admin-password': pw }, body: body && JSON.stringify(body) });
  async function load(e) {
    e?.preventDefault();
    const r = await call('GET');
    if (!r.ok) return setErr('Clave incorrecta');
    setErr(''); setData(await r.json());
  }
  const act = async (body) => { await call('POST', body); setAsk(null); load(); };

  if (!data) return (
    <main className="admin"><form onSubmit={load}>
      <h1>ADMIN</h1>
      <input type="password" placeholder="Clave" value={pw} onChange={(e) => setPw(e.target.value)} />
      <button className="cta" type="submit">ENTRAR <span>→</span></button>
      {err && <p className="note error">{err}</p>}
    </form></main>
  );

  // Todo lo que hay por fecha: bloqueos manuales y reservas
  const byDate = {};
  for (const [d, v] of Object.entries(data.blocked)) (byDate[d] ||= { blocked: null, bookings: [] }).blocked = v;
  for (const b of data.bookings) (byDate[b.date] ||= { blocked: null, bookings: [] }).bookings.push(b);
  const statusOf = (d) => {
    const e = byDate[d];
    if (!e) return '';
    if (e.blocked || e.bookings.some((b) => b.status === 'confirmed')) return 'busy';
    return e.bookings.some((b) => b.status === 'pending') ? 'pending' : '';
  };

  const first = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const total = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const move = (n) => setView(({ y, m }) => { const d = new Date(y, m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const entry = sel && byDate[sel];

  return (
    <main className="admin wide">
      <div className="row tabs">
        <button className={`btn ${tab === 'reservas' ? 'on' : ''}`} onClick={() => setTab('reservas')}>Reservas</button>
        <button className={`btn ${tab === 'calendario' ? 'on' : ''}`} onClick={() => setTab('calendario')}>Calendario</button>
      </div>

      {tab === 'calendario' && (
        <div className="cal-wrap">
          <div className="cal">
            <div className="cal-head">
              <button type="button" onClick={() => move(-1)} aria-label="Mes anterior">←</button>
              <h3>{MONTHS[view.m]} {view.y}</h3>
              <button type="button" onClick={() => move(1)} aria-label="Mes siguiente">→</button>
            </div>
            <div className="cal-grid">
              {DAYS.map((d) => <span key={d} className="dow">{d}</span>)}
              {cells.map((d, i) => {
                if (!d) return <span key={i} />;
                const key = iso(view.y, view.m, d);
                return <button key={i} type="button" className={`day ${statusOf(key)} ${sel === key ? 'sel' : ''}`} onClick={() => { setSel(key); setLabel(''); }}>{d}</button>;
              })}
            </div>
            <p className="legend"><i className="k busy" /> Ocupada <i className="k pending" /> Solicitada <i className="k free" /> Libre</p>
          </div>

        </div>
      )}

      {tab === 'calendario' && sel && (
        <div className="modal-bg" onClick={() => { setSel(null); setAsk(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{sel}</h3>
            {!entry && <p>Fecha libre. Puedes bloquearla:</p>}
            {entry?.blocked && (
              <div className="item blocked">
                <p><b>Bloqueada</b>{entry.blocked.label && ` · ${entry.blocked.label}`}</p>
                <Del id="blocked" ask={ask} setAsk={setAsk} onYes={() => act({ action: 'unblock', date: sel })} text="Eliminar fecha" />
              </div>
            )}
            {entry?.bookings.map((b) => (
              <div key={b.id} className={`item st-${b.status}`}>
                <p><b>{b.eventName}</b> · {b.status}<br />{b.name} · {b.email} {b.whatsapp}</p>
                <div className="row">
                  {b.status !== 'confirmed' && <button className="btn" onClick={() => act({ action: 'status', id: b.id, status: 'confirmed' })}>Confirmar</button>}
                  {b.status === 'pending' && <button className="btn" onClick={() => act({ action: 'status', id: b.id, status: 'rejected' })}>Rechazar</button>}
                  <Del id={b.id} ask={ask} setAsk={setAsk} onYes={() => act({ action: 'delete', id: b.id })} text="Eliminar reserva" />
                </div>
              </div>
            ))}
            {!entry?.blocked && (
              <div className="row">
                <input placeholder="Nota (opcional)" value={label} onChange={(e) => setLabel(e.target.value)} />
                <button className="btn" onClick={() => act({ action: 'block', date: sel, label })}>Bloquear fecha</button>
              </div>
            )}
            <button className="btn" onClick={() => { setSel(null); setAsk(null); }}>Cerrar</button>
          </div>
        </div>
      )}

      {tab === 'reservas' && (
        <>
          <h1>RESERVAS</h1>
          {data.bookings.length === 0 && <p>Sin solicitudes todavia.</p>}
          {data.bookings.map((b) => (
            <article key={b.id} className={`panel st-${b.status}`}>
              <h3>{b.eventName} <small>{b.date} · {b.status}</small></h3>
              <p>{b.venue} {b.city && `· ${b.city}`}<br />{b.name} · {b.email} {b.whatsapp}</p>
              {b.message && <p className="bio">{b.message}</p>}
              <div className="row">
                <button className="btn" onClick={() => act({ action: 'status', id: b.id, status: 'confirmed' })}>Confirmar</button>
                <button className="btn" onClick={() => act({ action: 'status', id: b.id, status: 'rejected' })}>Rechazar</button>
                <button className="btn" onClick={() => act({ action: 'delete', id: b.id })}>Borrar</button>
              </div>
            </article>
          ))}
        </>
      )}
    </main>
  );
}
