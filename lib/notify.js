// Notificacion push al telefono via ntfy (https://ntfy.sh)
export async function notify({ title, message, priority = 4, tags = ['calendar'], click }) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return console.warn('NTFY_TOPIC no configurado: no se envio notificacion');
  try {
    await fetch('https://ntfy.sh', {
      method: 'POST',
      body: JSON.stringify({ topic, title, message, priority, tags, click }),
    });
  } catch (e) {
    console.error('ntfy fallo', e);
  }
}
