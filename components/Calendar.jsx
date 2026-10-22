'use client';
import { useEffect, useState } from 'react';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const empty = { eventName: '', venue: '', city: '', name: '', email: '', whatsapp: '', message: '', website: '' };

export default function Calendar() {
  const now = new Date();
  const today = iso(now.getFullYear(), now.getMonth(), now.getDate());
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [dates, setDates] = useState({});
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);
  const [state, setState] = useState({ status: 'idle', msg: '' });
  const [loadErr, setLoadErr] = useState(false);

  const load = () => fetch(`/api/availability?t=${Date.now()}`, { cache: 'no-store' }).then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then((d) => { setDates(d.dates); setLoadErr(false); }).catch(() => setLoadErr(true));
  useEffect(() => { load(); }, []);

  const first = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // semana empieza en lunes
  const total = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const move = (n) => setView(({ y, m }) => { const d = new Date(y, m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ status: 'loading', msg: '' });
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, date: selected }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setState({ status: 'ok', msg: 'Solicitud enviada. Te respondere pronto para confirmar la fecha.' });
      setForm(empty); setSelected(null); load();
    } catch (err) {
      setState({ status: 'error', msg: err.message });
    }
  }

  return (
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
            const st = dates[key];
            const past = key < today;
            return (
              <button key={i} type="button" disabled={past} aria-disabled={st === 'busy'}
                className={`day ${st || ''} ${selected === key ? 'sel' : ''}`}
                onClick={() => { if (st === 'busy') return; setSelected(key); setState({ status: 'idle', msg: '' }); }}>
                {d}
              </button>
            );
          })}
        </div>
        {loadErr && <p className="note error">No se pudo cargar la disponibilidad. <button type="button" className="btn" onClick={load}>Reintentar</button></p>}
        <p className="legend"><i className="k busy" /> Ocupada <i className="k pending" /> Solicitada <i className="k free" /> Libre</p>
      </div>

      <form className="book" onSubmit={submit}>
        <h3>{selected ? `Reservar ${selected}` : 'Elige una fecha libre'}</h3>
        {state.msg && <p className={`note ${state.status}`}>{state.msg}</p>}
        <fieldset disabled={!selected || state.status === 'loading'}>
          <input placeholder="Nombre del evento *" value={form.eventName} onChange={set('eventName')} required />
          <div className="two">
            <input placeholder="Venue / Club" value={form.venue} onChange={set('venue')} />
            <input placeholder="Ciudad" value={form.city} onChange={set('city')} />
          </div>
          <input placeholder="Tu nombre / productora *" value={form.name} onChange={set('name')} required />
          <div className="two">
            <input type="email" placeholder="Email" value={form.email} onChange={set('email')} />
            <input placeholder="WhatsApp" value={form.whatsapp} onChange={set('whatsapp')} />
          </div>
          <textarea rows="3" placeholder="Detalles del evento, line-up, cache..." value={form.message} onChange={set('message')} />
          <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={set('website')} />
          <button className="cta" type="submit">{state.status === 'loading' ? 'ENVIANDO...' : 'SOLICITAR FECHA'} <span>→</span></button>
        </fieldset>
      </form>
    </div>
  );
}
