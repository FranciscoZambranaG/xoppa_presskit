// Todo el contenido editable del presskit vive aqui.
export const site = {
  name: 'xoppa',
  tagline: 'TECHNO DJ',
  photo: '/media/foto.jpg',
  genres: ['Bochka', 'Industrial', 'Schranz', 'Hard Techno', 'Hard Bounce', 'Hard Groove'],
  // Equipo minimo que aceptas
  minimumGear: [
    'Minimo: RX3 o XDJ-AZ',
    'Preferido: CDJ 3000 o CDJ 2000',
    'Mixer: A9 como minimo',
  ],
  bio: [],
  socials: [
    { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/xoppa.wav' },
    { icon: 'youtube', label: 'YouTube', url: 'https://youtube.com/@xoppann' },
  ],
  collectives: [
    {
      name: 'State 0',
      role: 'Soy parte del movimiento',
      socials: [{ icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/state___0' }],
    },
    {
      name: 'Combo 4 og 5',
      role: 'Soy socio de la productora',
      socials: [
        { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/combo4.og5' },
        { icon: 'youtube', label: 'YouTube', url: 'https://youtube.com/@combo4og5' },
      ],
    },
  ],
  contact: {
    email: 'franciscozambranajr@gmail.com',
    whatsapp: '+591 67430633',
    whatsappLink: 'https://wa.me/59167430633',
    instagram: { label: '@xoppa.wav', url: 'https://www.instagram.com/xoppa.wav' },
    city: 'Cochabamba',
    country: 'Bolivia',
  },
  // Fechas ocupadas iniciales: se cargan UNA vez en la base de datos y luego se administran desde /admin
  // (publicamente solo se ve "ocupada"; la nota es solo para ti)
  blockedDates: [
    { date: '2026-10-30', label: 'State 0' },
    { date: '2026-10-31', label: 'Privado' },
    { date: '2026-11-01', label: 'Tetrix Experiences' },
  ],
};
