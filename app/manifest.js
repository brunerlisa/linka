export default function manifest() {
  return {
    name: 'Noble Mirror Capital',
    short_name: 'NMC',
    description: 'Innovative copy trading platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#02052D',
    theme_color: '#02052D',
    icons: [
      {
        src: '/noblemirrorcapital%20logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/noblemirrorcapital%20logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
