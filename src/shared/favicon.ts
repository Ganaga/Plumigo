import type { MascotId } from './mascot';
import { getState } from './storage';

const FAVICON_SVGS: Record<MascotId, string> = {
  owl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="#8B6914"/>
    <circle cx="22" cy="28" r="10" fill="white"/><circle cx="42" cy="28" r="10" fill="white"/>
    <circle cx="23" cy="28" r="5" fill="#2D3436"/><circle cx="43" cy="28" r="5" fill="#2D3436"/>
    <polygon points="32,34 28,40 36,40" fill="#E17055"/>
    <path d="M24,44 Q32,50 40,44" stroke="#6D4C1D" stroke-width="2" fill="none"/>
    <polygon points="16,14 20,4 26,16" fill="#8B6914"/><polygon points="48,14 44,4 38,16" fill="#8B6914"/>
  </svg>`,
  dragon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="34" r="28" fill="#E74C3C"/>
    <circle cx="32" cy="36" r="20" fill="#F5B041"/>
    <circle cx="22" cy="28" r="8" fill="white"/><circle cx="42" cy="28" r="8" fill="white"/>
    <circle cx="23" cy="28" r="4" fill="#2D3436"/><circle cx="43" cy="28" r="4" fill="#2D3436"/>
    <circle cx="28" cy="38" r="2" fill="#C0392B"/><circle cx="36" cy="38" r="2" fill="#C0392B"/>
    <path d="M24,44 Q32,52 40,44" stroke="#C0392B" stroke-width="2" fill="none"/>
    <circle cx="32" cy="8" r="4" fill="#F39C12"/><circle cx="24" cy="10" r="3" fill="#F39C12"/><circle cx="40" cy="10" r="3" fill="#F39C12"/>
  </svg>`,
  cat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="36" r="26" fill="#636e72"/>
    <circle cx="32" cy="38" r="18" fill="#b2bec3"/>
    <polygon points="14,24 10,2 24,20" fill="#636e72"/><polygon points="50,24 54,2 40,20" fill="#636e72"/>
    <circle cx="22" cy="30" r="7" fill="#55efc4"/><circle cx="42" cy="30" r="7" fill="#55efc4"/>
    <ellipse cx="22" cy="30" rx="3" ry="5" fill="#2D3436"/><ellipse cx="42" cy="30" rx="3" ry="5" fill="#2D3436"/>
    <ellipse cx="32" cy="38" rx="2.5" ry="2" fill="#FFB6C1"/>
    <path d="M28,42 Q32,46 36,42" stroke="#636e72" stroke-width="1.5" fill="none"/>
  </svg>`,
  robot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <line x1="32" y1="6" x2="32" y2="14" stroke="#74b9ff" stroke-width="3"/>
    <circle cx="32" cy="5" r="4" fill="#55efc4"/>
    <rect x="10" y="14" width="44" height="38" rx="10" fill="#74b9ff"/>
    <rect x="14" y="18" width="36" height="30" rx="6" fill="#dfe6e9"/>
    <circle cx="24" cy="30" r="6" fill="white"/><circle cx="40" cy="30" r="6" fill="white"/>
    <circle cx="24" cy="30" r="4" fill="#0984e3"/><circle cx="40" cy="30" r="4" fill="#0984e3"/>
    <rect x="20" y="40" width="24" height="5" rx="2.5" fill="#0984e3"/>
  </svg>`,
  fox: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <circle cx="32" cy="36" r="26" fill="#E17055"/>
    <circle cx="32" cy="40" r="16" fill="white"/>
    <polygon points="14,24 8,2 26,18" fill="#E17055"/><polygon points="50,24 56,2 38,18" fill="#E17055"/>
    <polygon points="16,22 12,8 24,19" fill="#FFEAA7"/><polygon points="48,22 52,8 40,19" fill="#FFEAA7"/>
    <ellipse cx="24" cy="30" rx="5" ry="6" fill="#FFEAA7"/><ellipse cx="40" cy="30" rx="5" ry="6" fill="#FFEAA7"/>
    <ellipse cx="24" cy="30" rx="2.5" ry="4" fill="#2D3436"/><ellipse cx="40" cy="30" rx="2.5" ry="4" fill="#2D3436"/>
    <ellipse cx="32" cy="38" rx="3" ry="2.5" fill="#2D3436"/>
    <path d="M27,43 Q32,48 37,43" stroke="#E17055" stroke-width="1.5" fill="none"/>
  </svg>`,
};

export function updateFavicon(): void {
  const state = getState();
  const mascotId = (state.profile.mascot || 'owl') as MascotId;
  const svg = FAVICON_SVGS[mascotId];

  const encoded = 'data:image/svg+xml,' + encodeURIComponent(svg);

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = encoded;
}
