import * as si from 'simple-icons';

const paths = {
  instagram: si.siInstagram, soundcloud: si.siSoundcloud, spotify: si.siSpotify, tiktok: si.siTiktok,
  facebook: si.siFacebook, youtube: si.siYoutube, beatport: si.siBeatport, whatsapp: si.siWhatsapp,
};
const mail = 'M2 5h20v14H2zM2 5l10 8 10-8';

export function Icon({ name, size = 20 }) {
  const brand = paths[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {brand ? <path d={brand.path} fill="currentColor" /> : <path d={mail} fill="none" stroke="currentColor" strokeWidth="2" />}
    </svg>
  );
}

// Fila de iconos; cada uno abre la red social en otra pestana
export function Socials({ items }) {
  return (
    <ul className="socials">
      {items.map((s) => (
        <li key={s.url}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
            <Icon name={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
