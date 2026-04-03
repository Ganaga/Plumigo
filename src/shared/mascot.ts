export type MascotPose = 'happy' | 'thinking' | 'celebrating' | 'encouraging';

const OWL_SVG: Record<MascotPose, string> = {
  happy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <ellipse cx="60" cy="70" rx="35" ry="40" fill="#8B6914"/>
    <ellipse cx="60" cy="72" rx="28" ry="30" fill="#D4A843"/>
    <!-- Eyes -->
    <circle cx="45" cy="52" r="14" fill="white"/>
    <circle cx="75" cy="52" r="14" fill="white"/>
    <circle cx="47" cy="52" r="7" fill="#2D3436"/>
    <circle cx="77" cy="52" r="7" fill="#2D3436"/>
    <circle cx="49" cy="50" r="2.5" fill="white"/>
    <circle cx="79" cy="50" r="2.5" fill="white"/>
    <!-- Beak -->
    <polygon points="60,60 54,68 66,68" fill="#E17055"/>
    <!-- Feet -->
    <ellipse cx="48" cy="108" rx="10" ry="4" fill="#E17055"/>
    <ellipse cx="72" cy="108" rx="10" ry="4" fill="#E17055"/>
    <!-- Wings -->
    <ellipse cx="28" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(-10 28 72)"/>
    <ellipse cx="92" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(10 92 72)"/>
    <!-- Ear tufts -->
    <polygon points="35,30 42,18 48,35" fill="#8B6914"/>
    <polygon points="85,30 78,18 72,35" fill="#8B6914"/>
    <!-- Smile -->
    <path d="M50,74 Q60,82 70,74" stroke="#6D4C1D" stroke-width="2" fill="none"/>
  </svg>`,

  thinking: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="35" ry="40" fill="#8B6914"/>
    <ellipse cx="60" cy="72" rx="28" ry="30" fill="#D4A843"/>
    <circle cx="45" cy="52" r="14" fill="white"/>
    <circle cx="75" cy="52" r="14" fill="white"/>
    <circle cx="43" cy="50" r="7" fill="#2D3436"/>
    <circle cx="73" cy="50" r="7" fill="#2D3436"/>
    <circle cx="45" cy="48" r="2.5" fill="white"/>
    <circle cx="75" cy="48" r="2.5" fill="white"/>
    <polygon points="60,60 54,68 66,68" fill="#E17055"/>
    <ellipse cx="48" cy="108" rx="10" ry="4" fill="#E17055"/>
    <ellipse cx="72" cy="108" rx="10" ry="4" fill="#E17055"/>
    <!-- Wing touching chin -->
    <ellipse cx="28" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(15 28 72)"/>
    <ellipse cx="92" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(10 92 72)"/>
    <polygon points="35,30 42,18 48,35" fill="#8B6914"/>
    <polygon points="85,30 78,18 72,35" fill="#8B6914"/>
    <!-- Thinking mouth -->
    <circle cx="62" cy="76" r="3" fill="#6D4C1D"/>
    <!-- Thought dots -->
    <circle cx="100" cy="30" r="3" fill="#636e72" opacity="0.5"/>
    <circle cx="108" cy="20" r="4" fill="#636e72" opacity="0.4"/>
    <circle cx="112" cy="8" r="5" fill="#636e72" opacity="0.3"/>
  </svg>`,

  celebrating: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="35" ry="40" fill="#8B6914"/>
    <ellipse cx="60" cy="72" rx="28" ry="30" fill="#D4A843"/>
    <!-- Happy squint eyes -->
    <path d="M34,52 Q45,44 56,52" stroke="#2D3436" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M64,52 Q75,44 86,52" stroke="#2D3436" stroke-width="3" fill="none" stroke-linecap="round"/>
    <polygon points="60,58 54,66 66,66" fill="#E17055"/>
    <ellipse cx="48" cy="108" rx="10" ry="4" fill="#E17055"/>
    <ellipse cx="72" cy="108" rx="10" ry="4" fill="#E17055"/>
    <!-- Wings up! -->
    <ellipse cx="22" cy="55" rx="10" ry="22" fill="#8B6914" transform="rotate(-35 22 55)"/>
    <ellipse cx="98" cy="55" rx="10" ry="22" fill="#8B6914" transform="rotate(35 98 55)"/>
    <polygon points="35,30 42,14 48,35" fill="#8B6914"/>
    <polygon points="85,30 78,14 72,35" fill="#8B6914"/>
    <!-- Big smile -->
    <path d="M45,72 Q60,88 75,72" stroke="#6D4C1D" stroke-width="2.5" fill="none"/>
    <!-- Stars -->
    <text x="10" y="25" font-size="14">✨</text>
    <text x="95" y="20" font-size="14">⭐</text>
  </svg>`,

  encouraging: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="70" rx="35" ry="40" fill="#8B6914"/>
    <ellipse cx="60" cy="72" rx="28" ry="30" fill="#D4A843"/>
    <circle cx="45" cy="52" r="14" fill="white"/>
    <circle cx="75" cy="52" r="14" fill="white"/>
    <circle cx="47" cy="52" r="7" fill="#2D3436"/>
    <circle cx="77" cy="52" r="7" fill="#2D3436"/>
    <circle cx="49" cy="50" r="2.5" fill="white"/>
    <circle cx="79" cy="50" r="2.5" fill="white"/>
    <polygon points="60,60 54,68 66,68" fill="#E17055"/>
    <ellipse cx="48" cy="108" rx="10" ry="4" fill="#E17055"/>
    <ellipse cx="72" cy="108" rx="10" ry="4" fill="#E17055"/>
    <!-- One wing waving -->
    <ellipse cx="28" cy="72" rx="10" ry="22" fill="#8B6914" transform="rotate(-10 28 72)"/>
    <ellipse cx="98" cy="58" rx="10" ry="22" fill="#8B6914" transform="rotate(30 98 58)"/>
    <polygon points="35,30 42,18 48,35" fill="#8B6914"/>
    <polygon points="85,30 78,18 72,35" fill="#8B6914"/>
    <!-- Gentle smile -->
    <path d="M48,74 Q60,80 72,74" stroke="#6D4C1D" stroke-width="2" fill="none"/>
    <!-- Speech hint -->
    <text x="96" y="40" font-size="11">💪</text>
  </svg>`,
};

export function renderMascot(pose: MascotPose, size: number = 120): string {
  return `<div class="mascot" style="width:${size}px;height:${size}px">${OWL_SVG[pose]}</div>`;
}

export function getMascotSpeech(pose: MascotPose): string {
  const speeches: Record<MascotPose, string[]> = {
    happy: [
      'Salut ! Prêt à apprendre ?',
      'Super de te revoir !',
      'On s\'amuse aujourd\'hui !',
    ],
    thinking: [
      'Hmm, réfléchissons...',
      'Laisse-moi chercher...',
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
