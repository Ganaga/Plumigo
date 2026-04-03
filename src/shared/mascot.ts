import { getState } from './storage';

export type MascotPose = 'happy' | 'thinking' | 'celebrating' | 'encouraging';
export type MascotId = 'owl' | 'dragon' | 'cat' | 'robot' | 'fox';

export interface MascotInfo {
  id: MascotId;
  name: string;
  emoji: string;
}

export const MASCOTS: MascotInfo[] = [
  { id: 'owl', name: 'Plumeau le hibou', emoji: '🦉' },
  { id: 'dragon', name: 'Flamby le dragon', emoji: '🐉' },
  { id: 'cat', name: 'Moustache le chat', emoji: '🐱' },
  { id: 'robot', name: 'Bip le robot', emoji: '🤖' },
  { id: 'fox', name: 'Rusé le renard', emoji: '🦊' },
];

function getSelectedMascot(): MascotId {
  const state = getState();
  return (state.profile.mascot as MascotId) || 'owl';
}

// ─── OWL ─────────────────────────────────────────
const OWL: Record<MascotPose, string> = {
  happy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="35" ry="40" fill="#8B6914"/>
    <ellipse cx="60" cy="72" rx="28" ry="30" fill="#D4A843"/>
    <circle cx="45" cy="52" r="14" fill="white"/><circle cx="75" cy="52" r="14" fill="white"/>
    <circle cx="47" cy="52" r="7" fill="#2D3436"/><circle cx="77" cy="52" r="7" fill="#2D3436"/>
    <circle cx="49" cy="50" r="2.5" fill="white"/><circle cx="79" cy="50" r="2.5" fill="white"/>
    <polygon points="60,60 54,68 66,68" fill="#E17055"/>
    <ellipse cx="48" cy="108" rx="10" ry="4" fill="#E17055"/><ellipse cx="72" cy="108" rx="10" ry="4" fill="#E17055"/>
    <ellipse cx="28" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(-10 28 72)"/>
    <ellipse cx="92" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(10 92 72)"/>
    <polygon points="35,30 42,18 48,35" fill="#8B6914"/><polygon points="85,30 78,18 72,35" fill="#8B6914"/>
    <path d="M50,74 Q60,82 70,74" stroke="#6D4C1D" stroke-width="2" fill="none"/>
  </svg>`,
  thinking: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="35" ry="40" fill="#8B6914"/>
    <ellipse cx="60" cy="72" rx="28" ry="30" fill="#D4A843"/>
    <circle cx="45" cy="52" r="14" fill="white"/><circle cx="75" cy="52" r="14" fill="white"/>
    <circle cx="43" cy="50" r="7" fill="#2D3436"/><circle cx="73" cy="50" r="7" fill="#2D3436"/>
    <circle cx="45" cy="48" r="2.5" fill="white"/><circle cx="75" cy="48" r="2.5" fill="white"/>
    <polygon points="60,60 54,68 66,68" fill="#E17055"/>
    <ellipse cx="48" cy="108" rx="10" ry="4" fill="#E17055"/><ellipse cx="72" cy="108" rx="10" ry="4" fill="#E17055"/>
    <ellipse cx="28" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(15 28 72)"/>
    <ellipse cx="92" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(10 92 72)"/>
    <polygon points="35,30 42,18 48,35" fill="#8B6914"/><polygon points="85,30 78,18 72,35" fill="#8B6914"/>
    <circle cx="62" cy="76" r="3" fill="#6D4C1D"/>
    <circle cx="100" cy="30" r="3" fill="#636e72" opacity="0.5"/><circle cx="108" cy="20" r="4" fill="#636e72" opacity="0.4"/>
  </svg>`,
  celebrating: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="35" ry="40" fill="#8B6914"/>
    <ellipse cx="60" cy="72" rx="28" ry="30" fill="#D4A843"/>
    <path d="M34,52 Q45,44 56,52" stroke="#2D3436" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M64,52 Q75,44 86,52" stroke="#2D3436" stroke-width="3" fill="none" stroke-linecap="round"/>
    <polygon points="60,58 54,66 66,66" fill="#E17055"/>
    <ellipse cx="48" cy="108" rx="10" ry="4" fill="#E17055"/><ellipse cx="72" cy="108" rx="10" ry="4" fill="#E17055"/>
    <ellipse cx="22" cy="55" rx="10" ry="22" fill="#8B6914" transform="rotate(-35 22 55)"/>
    <ellipse cx="98" cy="55" rx="10" ry="22" fill="#8B6914" transform="rotate(35 98 55)"/>
    <polygon points="35,30 42,14 48,35" fill="#8B6914"/><polygon points="85,30 78,14 72,35" fill="#8B6914"/>
    <path d="M45,72 Q60,88 75,72" stroke="#6D4C1D" stroke-width="2.5" fill="none"/>
    <text x="10" y="25" font-size="14">✨</text><text x="95" y="20" font-size="14">⭐</text>
  </svg>`,
  encouraging: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="35" ry="40" fill="#8B6914"/>
    <ellipse cx="60" cy="72" rx="28" ry="30" fill="#D4A843"/>
    <circle cx="45" cy="52" r="14" fill="white"/><circle cx="75" cy="52" r="14" fill="white"/>
    <circle cx="47" cy="52" r="7" fill="#2D3436"/><circle cx="77" cy="52" r="7" fill="#2D3436"/>
    <circle cx="49" cy="50" r="2.5" fill="white"/><circle cx="79" cy="50" r="2.5" fill="white"/>
    <polygon points="60,60 54,68 66,68" fill="#E17055"/>
    <ellipse cx="48" cy="108" rx="10" ry="4" fill="#E17055"/><ellipse cx="72" cy="108" rx="10" ry="4" fill="#E17055"/>
    <ellipse cx="28" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(-10 28 72)"/>
    <ellipse cx="98" cy="58" rx="10" ry="22" fill="#8B6914" transform="rotate(30 98 58)"/>
    <polygon points="35,30 42,18 48,35" fill="#8B6914"/><polygon points="85,30 78,18 72,35" fill="#8B6914"/>
    <path d="M48,74 Q60,80 72,74" stroke="#6D4C1D" stroke-width="2" fill="none"/>
    <text x="96" y="40" font-size="11">💪</text>
  </svg>`,
};

// ─── DRAGON (Chinese-style, cute/childish) ───────
const DRAGON: Record<MascotPose, string> = {
  happy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="68" rx="32" ry="38" fill="#E74C3C"/>
    <ellipse cx="60" cy="70" rx="25" ry="28" fill="#F5B041"/>
    <!-- Horns -->
    <ellipse cx="38" cy="28" rx="5" ry="14" fill="#E74C3C" transform="rotate(-15 38 28)"/>
    <ellipse cx="82" cy="28" rx="5" ry="14" fill="#E74C3C" transform="rotate(15 82 28)"/>
    <!-- Eyes -->
    <circle cx="45" cy="52" r="12" fill="white"/><circle cx="75" cy="52" r="12" fill="white"/>
    <circle cx="47" cy="52" r="6" fill="#2D3436"/><circle cx="77" cy="52" r="6" fill="#2D3436"/>
    <circle cx="49" cy="50" r="2" fill="white"/><circle cx="79" cy="50" r="2" fill="white"/>
    <!-- Nostrils -->
    <circle cx="54" cy="67" r="2.5" fill="#C0392B"/><circle cx="66" cy="67" r="2.5" fill="#C0392B"/>
    <!-- Smile -->
    <path d="M46,76 Q60,86 74,76" stroke="#C0392B" stroke-width="2.5" fill="none"/>
    <!-- Tiny teeth -->
    <rect x="52" y="76" width="4" height="4" rx="1" fill="white"/><rect x="64" y="76" width="4" height="4" rx="1" fill="white"/>
    <!-- Arms -->
    <ellipse cx="30" cy="75" rx="8" ry="16" fill="#E74C3C" transform="rotate(-10 30 75)"/>
    <ellipse cx="90" cy="75" rx="8" ry="16" fill="#E74C3C" transform="rotate(10 90 75)"/>
    <!-- Feet -->
    <ellipse cx="46" cy="106" rx="10" ry="5" fill="#E74C3C"/><ellipse cx="74" cy="106" rx="10" ry="5" fill="#E74C3C"/>
    <!-- Spines -->
    <circle cx="60" cy="22" r="5" fill="#F39C12"/><circle cx="50" cy="25" r="4" fill="#F39C12"/><circle cx="70" cy="25" r="4" fill="#F39C12"/>
    <!-- Whiskers -->
    <path d="M30,58 Q20,54 10,56" stroke="#E74C3C" stroke-width="1.5" fill="none"/>
    <path d="M90,58 Q100,54 110,56" stroke="#E74C3C" stroke-width="1.5" fill="none"/>
  </svg>`,
  thinking: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="68" rx="32" ry="38" fill="#E74C3C"/>
    <ellipse cx="60" cy="70" rx="25" ry="28" fill="#F5B041"/>
    <ellipse cx="38" cy="28" rx="5" ry="14" fill="#E74C3C" transform="rotate(-15 38 28)"/>
    <ellipse cx="82" cy="28" rx="5" ry="14" fill="#E74C3C" transform="rotate(15 82 28)"/>
    <circle cx="45" cy="52" r="12" fill="white"/><circle cx="75" cy="52" r="12" fill="white"/>
    <circle cx="43" cy="50" r="6" fill="#2D3436"/><circle cx="73" cy="50" r="6" fill="#2D3436"/>
    <circle cx="54" cy="67" r="2.5" fill="#C0392B"/><circle cx="66" cy="67" r="2.5" fill="#C0392B"/>
    <circle cx="62" cy="78" r="3" fill="#C0392B"/>
    <!-- Smoke puff -->
    <circle cx="52" cy="63" r="3" fill="#dfe6e9" opacity="0.6"/>
    <ellipse cx="30" cy="75" rx="8" ry="16" fill="#E74C3C" transform="rotate(20 30 75)"/>
    <ellipse cx="90" cy="75" rx="8" ry="16" fill="#E74C3C" transform="rotate(10 90 75)"/>
    <ellipse cx="46" cy="106" rx="10" ry="5" fill="#E74C3C"/><ellipse cx="74" cy="106" rx="10" ry="5" fill="#E74C3C"/>
    <circle cx="60" cy="22" r="5" fill="#F39C12"/><circle cx="50" cy="25" r="4" fill="#F39C12"/><circle cx="70" cy="25" r="4" fill="#F39C12"/>
    <circle cx="100" cy="30" r="3" fill="#636e72" opacity="0.5"/><circle cx="108" cy="20" r="4" fill="#636e72" opacity="0.4"/>
  </svg>`,
  celebrating: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="68" rx="32" ry="38" fill="#E74C3C"/>
    <ellipse cx="60" cy="70" rx="25" ry="28" fill="#F5B041"/>
    <ellipse cx="38" cy="28" rx="5" ry="14" fill="#E74C3C" transform="rotate(-15 38 28)"/>
    <ellipse cx="82" cy="28" rx="5" ry="14" fill="#E74C3C" transform="rotate(15 82 28)"/>
    <path d="M34,52 Q45,44 56,52" stroke="#2D3436" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M64,52 Q75,44 86,52" stroke="#2D3436" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="54" cy="67" r="2.5" fill="#C0392B"/><circle cx="66" cy="67" r="2.5" fill="#C0392B"/>
    <path d="M44,76 Q60,90 76,76" stroke="#C0392B" stroke-width="2.5" fill="none"/>
    <rect x="52" y="76" width="4" height="4" rx="1" fill="white"/><rect x="64" y="76" width="4" height="4" rx="1" fill="white"/>
    <!-- Arms up -->
    <ellipse cx="24" cy="58" rx="8" ry="16" fill="#E74C3C" transform="rotate(-35 24 58)"/>
    <ellipse cx="96" cy="58" rx="8" ry="16" fill="#E74C3C" transform="rotate(35 96 58)"/>
    <ellipse cx="46" cy="106" rx="10" ry="5" fill="#E74C3C"/><ellipse cx="74" cy="106" rx="10" ry="5" fill="#E74C3C"/>
    <circle cx="60" cy="22" r="5" fill="#F39C12"/><circle cx="50" cy="25" r="4" fill="#F39C12"/><circle cx="70" cy="25" r="4" fill="#F39C12"/>
    <!-- Fire celebration -->
    <text x="14" y="40" font-size="14">🔥</text><text x="92" y="35" font-size="14">✨</text>
  </svg>`,
  encouraging: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="68" rx="32" ry="38" fill="#E74C3C"/>
    <ellipse cx="60" cy="70" rx="25" ry="28" fill="#F5B041"/>
    <ellipse cx="38" cy="28" rx="5" ry="14" fill="#E74C3C" transform="rotate(-15 38 28)"/>
    <ellipse cx="82" cy="28" rx="5" ry="14" fill="#E74C3C" transform="rotate(15 82 28)"/>
    <circle cx="45" cy="52" r="12" fill="white"/><circle cx="75" cy="52" r="12" fill="white"/>
    <circle cx="47" cy="52" r="6" fill="#2D3436"/><circle cx="77" cy="52" r="6" fill="#2D3436"/>
    <circle cx="49" cy="50" r="2" fill="white"/><circle cx="79" cy="50" r="2" fill="white"/>
    <circle cx="54" cy="67" r="2.5" fill="#C0392B"/><circle cx="66" cy="67" r="2.5" fill="#C0392B"/>
    <path d="M48,76 Q60,84 72,76" stroke="#C0392B" stroke-width="2" fill="none"/>
    <ellipse cx="30" cy="75" rx="8" ry="16" fill="#E74C3C" transform="rotate(-10 30 75)"/>
    <ellipse cx="96" cy="62" rx="8" ry="16" fill="#E74C3C" transform="rotate(30 96 62)"/>
    <ellipse cx="46" cy="106" rx="10" ry="5" fill="#E74C3C"/><ellipse cx="74" cy="106" rx="10" ry="5" fill="#E74C3C"/>
    <circle cx="60" cy="22" r="5" fill="#F39C12"/><circle cx="50" cy="25" r="4" fill="#F39C12"/><circle cx="70" cy="25" r="4" fill="#F39C12"/>
    <text x="96" y="44" font-size="11">💪</text>
  </svg>`,
};

// ─── CAT ─────────────────────────────────────────
const CAT: Record<MascotPose, string> = {
  happy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="72" rx="30" ry="36" fill="#636e72"/>
    <ellipse cx="60" cy="74" rx="22" ry="24" fill="#b2bec3"/>
    <!-- Ears -->
    <polygon points="34,42 28,14 48,36" fill="#636e72"/><polygon points="86,42 92,14 72,36" fill="#636e72"/>
    <polygon points="37,40 33,22 47,37" fill="#FFB6C1"/><polygon points="83,40 87,22 73,37" fill="#FFB6C1"/>
    <!-- Eyes -->
    <circle cx="45" cy="56" r="10" fill="#55efc4"/><circle cx="75" cy="56" r="10" fill="#55efc4"/>
    <ellipse cx="45" cy="56" rx="4" ry="7" fill="#2D3436"/><ellipse cx="75" cy="56" rx="4" ry="7" fill="#2D3436"/>
    <circle cx="47" cy="54" r="2" fill="white"/><circle cx="77" cy="54" r="2" fill="white"/>
    <!-- Nose -->
    <ellipse cx="60" cy="66" rx="3" ry="2.5" fill="#FFB6C1"/>
    <!-- Whiskers -->
    <line x1="30" y1="66" x2="48" y2="68" stroke="#636e72" stroke-width="1.2"/>
    <line x1="30" y1="70" x2="48" y2="70" stroke="#636e72" stroke-width="1.2"/>
    <line x1="72" y1="68" x2="90" y2="66" stroke="#636e72" stroke-width="1.2"/>
    <line x1="72" y1="70" x2="90" y2="70" stroke="#636e72" stroke-width="1.2"/>
    <!-- Mouth -->
    <path d="M54,72 Q60,78 66,72" stroke="#636e72" stroke-width="1.5" fill="none"/>
    <!-- Paws -->
    <ellipse cx="44" cy="106" rx="10" ry="5" fill="#636e72"/><ellipse cx="76" cy="106" rx="10" ry="5" fill="#636e72"/>
    <!-- Tail -->
    <path d="M88,90 Q110,70 105,50" stroke="#636e72" stroke-width="6" fill="none" stroke-linecap="round"/>
  </svg>`,
  thinking: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="72" rx="30" ry="36" fill="#636e72"/>
    <ellipse cx="60" cy="74" rx="22" ry="24" fill="#b2bec3"/>
    <polygon points="34,42 28,14 48,36" fill="#636e72"/><polygon points="86,42 92,14 72,36" fill="#636e72"/>
    <polygon points="37,40 33,22 47,37" fill="#FFB6C1"/><polygon points="83,40 87,22 73,37" fill="#FFB6C1"/>
    <circle cx="45" cy="56" r="10" fill="#55efc4"/><circle cx="75" cy="56" r="10" fill="#55efc4"/>
    <ellipse cx="43" cy="54" rx="4" ry="7" fill="#2D3436"/><ellipse cx="73" cy="54" rx="4" ry="7" fill="#2D3436"/>
    <ellipse cx="60" cy="66" rx="3" ry="2.5" fill="#FFB6C1"/>
    <line x1="30" y1="66" x2="48" y2="68" stroke="#636e72" stroke-width="1.2"/>
    <line x1="72" y1="68" x2="90" y2="66" stroke="#636e72" stroke-width="1.2"/>
    <circle cx="62" cy="74" r="2.5" fill="#636e72"/>
    <ellipse cx="44" cy="106" rx="10" ry="5" fill="#636e72"/><ellipse cx="76" cy="106" rx="10" ry="5" fill="#636e72"/>
    <path d="M88,90 Q105,80 100,60" stroke="#636e72" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="30" r="3" fill="#636e72" opacity="0.5"/><circle cx="108" cy="20" r="4" fill="#636e72" opacity="0.4"/>
  </svg>`,
  celebrating: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="72" rx="30" ry="36" fill="#636e72"/>
    <ellipse cx="60" cy="74" rx="22" ry="24" fill="#b2bec3"/>
    <polygon points="34,42 28,14 48,36" fill="#636e72"/><polygon points="86,42 92,14 72,36" fill="#636e72"/>
    <polygon points="37,40 33,22 47,37" fill="#FFB6C1"/><polygon points="83,40 87,22 73,37" fill="#FFB6C1"/>
    <path d="M34,56 Q45,48 56,56" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M64,56 Q75,48 86,56" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="66" rx="3" ry="2.5" fill="#FFB6C1"/>
    <line x1="30" y1="66" x2="48" y2="68" stroke="#636e72" stroke-width="1.2"/>
    <line x1="72" y1="68" x2="90" y2="66" stroke="#636e72" stroke-width="1.2"/>
    <path d="M48,72 Q60,82 72,72" stroke="#636e72" stroke-width="2" fill="none"/>
    <ellipse cx="44" cy="106" rx="10" ry="5" fill="#636e72"/><ellipse cx="76" cy="106" rx="10" ry="5" fill="#636e72"/>
    <path d="M88,85 Q115,55 108,35" stroke="#636e72" stroke-width="6" fill="none" stroke-linecap="round"/>
    <text x="8" y="30" font-size="14">✨</text><text x="95" y="20" font-size="14">⭐</text>
  </svg>`,
  encouraging: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="72" rx="30" ry="36" fill="#636e72"/>
    <ellipse cx="60" cy="74" rx="22" ry="24" fill="#b2bec3"/>
    <polygon points="34,42 28,14 48,36" fill="#636e72"/><polygon points="86,42 92,14 72,36" fill="#636e72"/>
    <polygon points="37,40 33,22 47,37" fill="#FFB6C1"/><polygon points="83,40 87,22 73,37" fill="#FFB6C1"/>
    <circle cx="45" cy="56" r="10" fill="#55efc4"/><circle cx="75" cy="56" r="10" fill="#55efc4"/>
    <ellipse cx="45" cy="56" rx="4" ry="7" fill="#2D3436"/><ellipse cx="75" cy="56" rx="4" ry="7" fill="#2D3436"/>
    <circle cx="47" cy="54" r="2" fill="white"/><circle cx="77" cy="54" r="2" fill="white"/>
    <ellipse cx="60" cy="66" rx="3" ry="2.5" fill="#FFB6C1"/>
    <line x1="30" y1="66" x2="48" y2="68" stroke="#636e72" stroke-width="1.2"/>
    <line x1="72" y1="68" x2="90" y2="66" stroke="#636e72" stroke-width="1.2"/>
    <path d="M52,72 Q60,78 68,72" stroke="#636e72" stroke-width="1.5" fill="none"/>
    <ellipse cx="44" cy="106" rx="10" ry="5" fill="#636e72"/><ellipse cx="76" cy="106" rx="10" ry="5" fill="#636e72"/>
    <path d="M88,90 Q110,70 105,50" stroke="#636e72" stroke-width="6" fill="none" stroke-linecap="round"/>
    <text x="96" y="44" font-size="11">💪</text>
  </svg>`,
};

// ─── ROBOT ───────────────────────────────────────
const ROBOT: Record<MascotPose, string> = {
  happy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Antenna -->
    <line x1="60" y1="20" x2="60" y2="32" stroke="#74b9ff" stroke-width="3"/>
    <circle cx="60" cy="17" r="5" fill="#ff7675"/>
    <!-- Head -->
    <rect x="30" y="32" width="60" height="50" rx="12" fill="#74b9ff"/>
    <rect x="36" y="38" width="48" height="38" rx="8" fill="#dfe6e9"/>
    <!-- Eyes -->
    <circle cx="48" cy="54" r="8" fill="white"/><circle cx="72" cy="54" r="8" fill="white"/>
    <circle cx="48" cy="54" r="5" fill="#0984e3"/><circle cx="72" cy="54" r="5" fill="#0984e3"/>
    <circle cx="50" cy="52" r="2" fill="white"/><circle cx="74" cy="52" r="2" fill="white"/>
    <!-- Mouth -->
    <rect x="44" y="66" width="32" height="6" rx="3" fill="#0984e3"/>
    <rect x="48" y="67" width="4" height="4" rx="1" fill="#dfe6e9"/><rect x="56" y="67" width="4" height="4" rx="1" fill="#dfe6e9"/><rect x="64" y="67" width="4" height="4" rx="1" fill="#dfe6e9"/>
    <!-- Body -->
    <rect x="38" y="84" width="44" height="26" rx="8" fill="#74b9ff"/>
    <circle cx="60" cy="96" r="5" fill="#ff7675"/>
    <!-- Arms -->
    <rect x="18" y="86" width="18" height="8" rx="4" fill="#74b9ff"/><rect x="84" y="86" width="18" height="8" rx="4" fill="#74b9ff"/>
    <!-- Feet -->
    <rect x="42" y="110" width="14" height="6" rx="3" fill="#74b9ff"/><rect x="64" y="110" width="14" height="6" rx="3" fill="#74b9ff"/>
  </svg>`,
  thinking: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <line x1="60" y1="20" x2="60" y2="32" stroke="#74b9ff" stroke-width="3"/>
    <circle cx="60" cy="17" r="5" fill="#fdcb6e"/>
    <rect x="30" y="32" width="60" height="50" rx="12" fill="#74b9ff"/>
    <rect x="36" y="38" width="48" height="38" rx="8" fill="#dfe6e9"/>
    <circle cx="48" cy="54" r="8" fill="white"/><circle cx="72" cy="54" r="8" fill="white"/>
    <circle cx="46" cy="52" r="5" fill="#0984e3"/><circle cx="70" cy="52" r="5" fill="#0984e3"/>
    <ellipse cx="60" cy="68" rx="4" ry="3" fill="#0984e3"/>
    <rect x="38" y="84" width="44" height="26" rx="8" fill="#74b9ff"/>
    <circle cx="60" cy="96" r="5" fill="#fdcb6e"/>
    <rect x="18" y="86" width="18" height="8" rx="4" fill="#74b9ff" transform="rotate(15 27 90)"/>
    <rect x="84" y="86" width="18" height="8" rx="4" fill="#74b9ff"/>
    <rect x="42" y="110" width="14" height="6" rx="3" fill="#74b9ff"/><rect x="64" y="110" width="14" height="6" rx="3" fill="#74b9ff"/>
    <circle cx="100" cy="30" r="3" fill="#636e72" opacity="0.5"/><circle cx="108" cy="20" r="4" fill="#636e72" opacity="0.4"/>
  </svg>`,
  celebrating: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <line x1="60" y1="20" x2="60" y2="32" stroke="#74b9ff" stroke-width="3"/>
    <circle cx="60" cy="17" r="5" fill="#ff7675"><animate attributeName="fill" values="#ff7675;#fdcb6e;#55efc4;#ff7675" dur="1s" repeatCount="indefinite"/></circle>
    <rect x="30" y="32" width="60" height="50" rx="12" fill="#74b9ff"/>
    <rect x="36" y="38" width="48" height="38" rx="8" fill="#dfe6e9"/>
    <path d="M36,54 Q48,46 60,54" stroke="#0984e3" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M60,54 Q72,46 84,54" stroke="#0984e3" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="44" y="64" width="32" height="8" rx="4" fill="#0984e3"/>
    <rect x="38" y="84" width="44" height="26" rx="8" fill="#74b9ff"/>
    <circle cx="60" cy="96" r="5" fill="#55efc4"/>
    <rect x="12" y="76" width="18" height="8" rx="4" fill="#74b9ff" transform="rotate(-30 21 80)"/>
    <rect x="90" y="76" width="18" height="8" rx="4" fill="#74b9ff" transform="rotate(30 99 80)"/>
    <rect x="42" y="110" width="14" height="6" rx="3" fill="#74b9ff"/><rect x="64" y="110" width="14" height="6" rx="3" fill="#74b9ff"/>
    <text x="8" y="28" font-size="14">✨</text><text x="95" y="22" font-size="14">⭐</text>
  </svg>`,
  encouraging: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <line x1="60" y1="20" x2="60" y2="32" stroke="#74b9ff" stroke-width="3"/>
    <circle cx="60" cy="17" r="5" fill="#55efc4"/>
    <rect x="30" y="32" width="60" height="50" rx="12" fill="#74b9ff"/>
    <rect x="36" y="38" width="48" height="38" rx="8" fill="#dfe6e9"/>
    <circle cx="48" cy="54" r="8" fill="white"/><circle cx="72" cy="54" r="8" fill="white"/>
    <circle cx="48" cy="54" r="5" fill="#0984e3"/><circle cx="72" cy="54" r="5" fill="#0984e3"/>
    <circle cx="50" cy="52" r="2" fill="white"/><circle cx="74" cy="52" r="2" fill="white"/>
    <rect x="44" y="66" width="32" height="6" rx="3" fill="#0984e3"/>
    <rect x="38" y="84" width="44" height="26" rx="8" fill="#74b9ff"/>
    <circle cx="60" cy="96" r="5" fill="#55efc4"/>
    <rect x="18" y="86" width="18" height="8" rx="4" fill="#74b9ff"/>
    <rect x="84" y="78" width="18" height="8" rx="4" fill="#74b9ff" transform="rotate(30 93 82)"/>
    <rect x="42" y="110" width="14" height="6" rx="3" fill="#74b9ff"/><rect x="64" y="110" width="14" height="6" rx="3" fill="#74b9ff"/>
    <text x="98" y="66" font-size="11">💪</text>
  </svg>`,
};

// ─── FOX ─────────────────────────────────────────
const FOX: Record<MascotPose, string> = {
  happy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="30" ry="36" fill="#E17055"/>
    <ellipse cx="60" cy="74" rx="20" ry="22" fill="white"/>
    <!-- Ears -->
    <polygon points="32,44 22,10 48,34" fill="#E17055"/><polygon points="88,44 98,10 72,34" fill="#E17055"/>
    <polygon points="35,40 28,18 46,35" fill="#FFEAA7"/><polygon points="85,40 92,18 74,35" fill="#FFEAA7"/>
    <!-- Eyes -->
    <ellipse cx="44" cy="56" rx="8" ry="9" fill="#FFEAA7"/><ellipse cx="76" cy="56" rx="8" ry="9" fill="#FFEAA7"/>
    <ellipse cx="44" cy="56" rx="4" ry="6" fill="#2D3436"/><ellipse cx="76" cy="56" rx="4" ry="6" fill="#2D3436"/>
    <circle cx="46" cy="54" r="2" fill="white"/><circle cx="78" cy="54" r="2" fill="white"/>
    <!-- Nose -->
    <ellipse cx="60" cy="66" rx="4" ry="3" fill="#2D3436"/>
    <!-- Mouth -->
    <path d="M52,72 Q60,80 68,72" stroke="#E17055" stroke-width="1.5" fill="none"/>
    <!-- Cheeks -->
    <circle cx="36" cy="68" r="5" fill="#fab1a0" opacity="0.5"/><circle cx="84" cy="68" r="5" fill="#fab1a0" opacity="0.5"/>
    <!-- Body -->
    <ellipse cx="46" cy="106" rx="10" ry="5" fill="#E17055"/><ellipse cx="74" cy="106" rx="10" ry="5" fill="#E17055"/>
    <!-- Tail -->
    <path d="M86,92 Q115,72 108,48" stroke="#E17055" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="108" cy="48" r="5" fill="white"/>
  </svg>`,
  thinking: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="30" ry="36" fill="#E17055"/>
    <ellipse cx="60" cy="74" rx="20" ry="22" fill="white"/>
    <polygon points="32,44 22,10 48,34" fill="#E17055"/><polygon points="88,44 98,10 72,34" fill="#E17055"/>
    <polygon points="35,40 28,18 46,35" fill="#FFEAA7"/><polygon points="85,40 92,18 74,35" fill="#FFEAA7"/>
    <ellipse cx="44" cy="56" rx="8" ry="9" fill="#FFEAA7"/><ellipse cx="76" cy="56" rx="8" ry="9" fill="#FFEAA7"/>
    <ellipse cx="42" cy="54" rx="4" ry="6" fill="#2D3436"/><ellipse cx="74" cy="54" rx="4" ry="6" fill="#2D3436"/>
    <ellipse cx="60" cy="66" rx="4" ry="3" fill="#2D3436"/>
    <circle cx="63" cy="74" r="2.5" fill="#E17055"/>
    <circle cx="36" cy="68" r="5" fill="#fab1a0" opacity="0.5"/><circle cx="84" cy="68" r="5" fill="#fab1a0" opacity="0.5"/>
    <ellipse cx="46" cy="106" rx="10" ry="5" fill="#E17055"/><ellipse cx="74" cy="106" rx="10" ry="5" fill="#E17055"/>
    <path d="M86,92 Q110,78 104,58" stroke="#E17055" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="104" cy="58" r="5" fill="white"/>
    <circle cx="100" cy="30" r="3" fill="#636e72" opacity="0.5"/><circle cx="108" cy="20" r="4" fill="#636e72" opacity="0.4"/>
  </svg>`,
  celebrating: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="30" ry="36" fill="#E17055"/>
    <ellipse cx="60" cy="74" rx="20" ry="22" fill="white"/>
    <polygon points="32,44 22,10 48,34" fill="#E17055"/><polygon points="88,44 98,10 72,34" fill="#E17055"/>
    <polygon points="35,40 28,18 46,35" fill="#FFEAA7"/><polygon points="85,40 92,18 74,35" fill="#FFEAA7"/>
    <path d="M34,56 Q44,48 54,56" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M66,56 Q76,48 86,56" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="66" rx="4" ry="3" fill="#2D3436"/>
    <path d="M48,72 Q60,84 72,72" stroke="#E17055" stroke-width="2" fill="none"/>
    <circle cx="36" cy="68" r="5" fill="#fab1a0" opacity="0.6"/><circle cx="84" cy="68" r="5" fill="#fab1a0" opacity="0.6"/>
    <ellipse cx="46" cy="106" rx="10" ry="5" fill="#E17055"/><ellipse cx="74" cy="106" rx="10" ry="5" fill="#E17055"/>
    <path d="M86,88 Q118,60 112,38" stroke="#E17055" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="112" cy="38" r="5" fill="white"/>
    <text x="6" y="28" font-size="14">✨</text><text x="95" y="18" font-size="14">⭐</text>
  </svg>`,
  encouraging: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="30" ry="36" fill="#E17055"/>
    <ellipse cx="60" cy="74" rx="20" ry="22" fill="white"/>
    <polygon points="32,44 22,10 48,34" fill="#E17055"/><polygon points="88,44 98,10 72,34" fill="#E17055"/>
    <polygon points="35,40 28,18 46,35" fill="#FFEAA7"/><polygon points="85,40 92,18 74,35" fill="#FFEAA7"/>
    <ellipse cx="44" cy="56" rx="8" ry="9" fill="#FFEAA7"/><ellipse cx="76" cy="56" rx="8" ry="9" fill="#FFEAA7"/>
    <ellipse cx="44" cy="56" rx="4" ry="6" fill="#2D3436"/><ellipse cx="76" cy="56" rx="4" ry="6" fill="#2D3436"/>
    <circle cx="46" cy="54" r="2" fill="white"/><circle cx="78" cy="54" r="2" fill="white"/>
    <ellipse cx="60" cy="66" rx="4" ry="3" fill="#2D3436"/>
    <path d="M52,72 Q60,78 68,72" stroke="#E17055" stroke-width="1.5" fill="none"/>
    <circle cx="36" cy="68" r="5" fill="#fab1a0" opacity="0.5"/><circle cx="84" cy="68" r="5" fill="#fab1a0" opacity="0.5"/>
    <ellipse cx="46" cy="106" rx="10" ry="5" fill="#E17055"/><ellipse cx="74" cy="106" rx="10" ry="5" fill="#E17055"/>
    <path d="M86,92 Q115,72 108,48" stroke="#E17055" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="108" cy="48" r="5" fill="white"/>
    <text x="96" y="44" font-size="11">💪</text>
  </svg>`,
};

// ─── ALL MASCOTS MAP ─────────────────────────────
const ALL_MASCOTS: Record<MascotId, Record<MascotPose, string>> = {
  owl: OWL,
  dragon: DRAGON,
  cat: CAT,
  robot: ROBOT,
  fox: FOX,
};

export function renderMascot(pose: MascotPose, size: number = 120): string {
  const mascotId = getSelectedMascot();
  const svgs = ALL_MASCOTS[mascotId] ?? OWL;
  return `<div class="mascot" style="width:${size}px;height:${size}px">${svgs[pose]}</div>`;
}

export function renderMascotById(id: MascotId, pose: MascotPose, size: number = 120): string {
  const svgs = ALL_MASCOTS[id] ?? OWL;
  return `<div class="mascot" style="width:${size}px;height:${size}px">${svgs[pose]}</div>`;
}

export function getMascotSpeech(pose: MascotPose): string {
  const speeches: Record<MascotPose, string[]> = {
    happy: [
      'Salut ! Prêt à écrire ?',
      'Super de te revoir !',
      'On écrit aujourd\'hui !',
    ],
    thinking: [
      'Hmm, réfléchissons...',
      'Laisse-moi vérifier...',
      'Bonne question !',
    ],
    celebrating: [
      'Bravo, c\'est génial !',
      'Tu es un champion !',
      'Fantastique !',
    ],
    encouraging: [
      'Continue, tu peux le faire !',
      'Encore un petit effort !',
      'Tu progresses bien !',
    ],
  };

  const options = speeches[pose];
  return options[Math.floor(Math.random() * options.length)]!;
}
