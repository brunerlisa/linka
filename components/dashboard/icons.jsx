export function NavIcon({ name, className = 'w-5 h-5' }) {
  const props = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 10v10h14V10" />
        </svg>
      )
    case 'trade':
      return (
        <svg {...props}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 15l3-4 3 2 4-6" />
        </svg>
      )
    case 'markets':
      return (
        <svg {...props}>
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20V8" />
        </svg>
      )
    case 'commodities':
      return (
        <svg {...props}>
          <path d="M12 3 4 7v10l8 4 8-4V7l-8-4z" />
          <path d="M12 12 4 7" />
          <path d="M12 12v11" />
          <path d="M12 12l8-5" />
        </svg>
      )
    case 'trades':
      return (
        <svg {...props}>
          <path d="M8 7h13" />
          <path d="M8 12h13" />
          <path d="M8 17h13" />
          <path d="M3 7h.01" />
          <path d="M3 12h.01" />
          <path d="M3 17h.01" />
        </svg>
      )
    case 'copy':
      return (
        <svg {...props}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="8" r="3" />
          <path d="M3 19c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
          <path d="M13 19c0-1.5.7-2.8 1.8-3.6" />
        </svg>
      )
    case 'deposit':
      return (
        <svg {...props}>
          <path d="M12 3v12" />
          <path d="M7 11l5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      )
    case 'withdraw':
      return (
        <svg {...props}>
          <path d="M12 21V9" />
          <path d="M7 13l5-5 5 5" />
          <path d="M5 3h14" />
        </svg>
      )
    case 'kyc':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="12" r="2" />
          <path d="M14 10h5" />
          <path d="M14 14h5" />
        </svg>
      )
    case 'bonus':
      return (
        <svg {...props}>
          <path d="M20 12v8H4v-8" />
          <path d="M2 8h20v4H2z" />
          <path d="M12 8V4" />
          <path d="M12 8c-2 0-3-1.5-3-3 1.5 0 3 1 3 3z" />
          <path d="M12 8c2 0 3-1.5 3-3-1.5 0-3 1-3 3z" />
        </svg>
      )
    case 'history':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M3 11h18" />
        </svg>
      )
    case 'upgrade':
      return (
        <svg {...props}>
          <path d="M5 16l3.5-8 3.5 5 3.5-7L19 16" />
          <path d="M4 20h16" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'bank':
      return (
        <svg {...props}>
          <path d="M3 10h18" />
          <path d="M5 10v8" />
          <path d="M10 10v8" />
          <path d="M14 10v8" />
          <path d="M19 10v8" />
          <path d="M3 18h18" />
          <path d="M12 3 3 8h18L12 3z" />
        </svg>
      )
    case 'wallet':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <path d="M16 14h2" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...props}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'eyeOff':
      return (
        <svg {...props}>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2" />
          <path d="M9.9 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-4.2 4.8" />
          <path d="M6.1 6.1A18 18 0 0 0 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.6" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}
