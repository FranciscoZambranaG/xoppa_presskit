import { site } from '@/lib/site';
import { Socials, Icon } from '@/components/Icon';
import Calendar from '@/components/Calendar';
import Media from '@/components/Media';

const nav = [['PRESSKIT', 'presskit'], ['MOVIMIENTO', 'colectivos'], ['FECHAS', 'fechas'], ['MEDIA', 'media'], ['CONTACTO', 'contacto']];

export default function Page() {
  const c = site.contact;
  return (
    <>
      <header className="top">
        <a className="logo" href="#presskit" aria-label={site.name}><img src="/media/logo-xoppa.png" alt={site.name} /></a>
        <nav>{nav.map(([l, id]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>
      </header>

      <main>
        <section id="presskit" className="hero">
          <h1>PRESS KIT</h1>
          <div className="hero-card">
            <ul className="side">{nav.map(([l, id]) => <li key={id}><a href={`#${id}`}>{l}</a></li>)}</ul>
            <div className="photo"><img src={site.photo} alt={site.name} /></div>
            <div className="info">
              <h2>{site.name}</h2>
              <p className="sub">{site.tagline}</p>
              <Socials items={site.socials} />
              <h4>GENEROS</h4>
              <p className="chips">{site.genres.map((g) => <span key={g}>{g}</span>)}</p>
              <h4>EQUIPO MINIMO</h4>
              <ul className="gear">{site.minimumGear.map((g) => <li key={g}>{g}</li>)}</ul>
              {site.bio.map((p) => <p className="bio" key={p}>{p}</p>)}
            </div>
            <a className="more" href="#fechas">RESERVAR FECHA <span>→</span></a>
          </div>
        </section>

        <section id="colectivos" className="block">
          <h2>MOVIMIENTO & PRODUCTORA</h2>
          <div className="cols">
            {site.collectives.map((k) => (
              <article key={k.name} className="panel">
                <p className="sub">{k.role}</p>
                <h3>{k.name}</h3>
                <Socials items={k.socials} />
              </article>
            ))}
          </div>
        </section>

        <section id="fechas" className="block">
          <h2>FECHAS</h2>
          <p className="lead">Revisa la disponibilidad y solicita tu fecha. Recibo la notificacion al instante.</p>
          <Calendar />
        </section>

        <section id="media" className="block">
          <h2>MEDIA</h2>
          <p className="lead">Flyers, fotos y videos listos para descargar.</p>
          <Media />
        </section>

        <section id="contacto" className="block">
          <h2>BOOKING</h2>
          <div className="panel contact">
            <ul>
              <li><Icon name="mail" /><a href={`mailto:${c.email}`}>{c.email}</a></li>
              <li><Icon name="whatsapp" /><a href={c.whatsappLink} target="_blank" rel="noopener noreferrer">{c.whatsapp}</a></li>
              <li><Icon name="instagram" /><a href={c.instagram.url} target="_blank" rel="noopener noreferrer">{c.instagram.label}</a></li>
            </ul>
            <p className="where">{c.city}, {c.country}</p>
          </div>
        </section>
      </main>

      <footer>
        <p>BE FOR THE MUSIC. BE FOR THE BOOKING.</p>
        <small>© {new Date().getFullYear()} {site.name}. All rights reserved</small>
      </footer>
    </>
  );
}
