export interface SeasonalTheme {
  id: string;
  isActive: (now: Date) => boolean;
  applyStyles: () => void;
  removeStyles: () => void;
  splashHtml: string;
  splashDurationMs: number;
}

const HALLOWEEN: SeasonalTheme = {
  id: 'halloween',
  isActive: (now) => {
    const m = now.getMonth() + 1;
    const d = now.getDate();
    return m === 10 || (m === 11 && d === 1);
  },
  applyStyles: () => document.documentElement.setAttribute('data-seasonal', 'halloween'),
  removeStyles: () => document.documentElement.removeAttribute('data-seasonal'),
  splashHtml: `
    <div class="bat" style="--dur:3.5s;--delay:0s;top:20%;--vy:-30px">🦇</div>
    <div class="bat" style="--dur:4.2s;--delay:0.8s;top:50%;--vy:20px">🦇</div>
    <div class="bat" style="--dur:3.8s;--delay:1.4s;top:75%;--vy:-10px">🦇</div>
    <div class="seasonal-splash-icon">🎃</div>
    <p class="seasonal-splash-title">Joyeux Halloween !</p>
    <p class="seasonal-splash-sub">Bonne lecture… si tu l'oses !</p>
  `,
  splashDurationMs: 2800,
};

export const SEASONAL_THEMES: SeasonalTheme[] = [HALLOWEEN];

export function initSeasonalTheme(): void {
  const theme = SEASONAL_THEMES.find((t) => t.isActive(new Date()));
  if (!theme) return;

  theme.applyStyles();

  const sessionKey = `plumigo_splash_${theme.id}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, '1');

  const overlay = document.createElement('div');
  overlay.className = 'seasonal-splash';
  overlay.innerHTML = theme.splashHtml;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('seasonal-splash--out');
    setTimeout(() => overlay.remove(), 500);
  }, theme.splashDurationMs);
}
