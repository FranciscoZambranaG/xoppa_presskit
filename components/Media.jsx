import { promises as fs } from 'fs';
import path from 'path';

const IMG = /\.(jpe?g|png|webp|gif|svg)$/i;
const VID = /\.(mp4|webm|mov)$/i;

async function list(dir) {
  try { return (await fs.readdir(path.join(process.cwd(), 'public', 'media', dir))).filter((f) => !f.startsWith('.')); } catch { return []; }
}

// Lee las carpetas public/media/flyers, press y videos: solo sube archivos y aparecen aqui
export default async function Media() {
  const files = [...(await list('flyers')).map((f) => ['flyers', f]), ...(await list('press')).map((f) => ['press', f]), ...(await list('videos')).map((f) => ['videos', f])];
  if (!files.length) return <p className="empty">Proximamente: flyers, fotos y videos descargables.</p>;
  return (
    <div className="media-grid">
      {files.map(([dir, f]) => {
        const src = `/media/${dir}/${encodeURIComponent(f)}`;
        return (
          <figure key={src}>
            {VID.test(f) ? <video src={src} controls preload="metadata" playsInline /> : IMG.test(f) ? <img src={src} alt={f} loading="lazy" /> : <div className="file">{f}</div>}
            <a className="dl" href={src} download={f}>DESCARGAR <span>↓</span></a>
          </figure>
        );
      })}
    </div>
  );
}
