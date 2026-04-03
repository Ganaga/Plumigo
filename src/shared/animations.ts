import confetti from 'canvas-confetti';
import { renderMascot } from './mascot';

export function fireConfetti(): void {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

export function fireStars(): void {
  confetti({
    particleCount: 30,
    spread: 50,
    shapes: ['star'],
    colors: ['#FFD700', '#FFA500', '#FF6347'],
    origin: { y: 0.5 },
  });
}

export function showNotification(message: string, icon: string): void {
  const el = document.createElement('div');
  el.className = 'notification';
  el.innerHTML = `<span class="notification-icon">${icon}</span><span>${message}</span>`;
  document.body.appendChild(el);

  requestAnimationFrame(() => el.classList.add('notification-visible'));

  setTimeout(() => {
    el.classList.remove('notification-visible');
    setTimeout(() => el.remove(), 400);
  }, 3000);
}

export function showGammeCelebration(name: string, icon: string): void {
  // Confetti burst from both sides
  confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#6C5CE7', '#a29bfe', '#55efc4', '#fdcb6e'] });
  confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#6C5CE7', '#a29bfe', '#55efc4', '#fdcb6e'] });

  // Full-screen overlay
  const overlay = document.createElement('div');
  overlay.className = 'gamme-celebration';
  overlay.innerHTML = `
    <div class="gamme-celebration-content">
      <div class="gamme-mascot gamme-bounce">${renderMascot('ecstatic', 120)}</div>
      <div class="gamme-icon gamme-pop">${icon}</div>
      <h2 class="gamme-title gamme-slide-up">Nouvelle gamme !</h2>
      <p class="gamme-name gamme-slide-up-delay">${name}</p>
      <div class="gamme-notes">
        <span class="gamme-note gamme-note-1">🎵</span>
        <span class="gamme-note gamme-note-2">🎶</span>
        <span class="gamme-note gamme-note-3">🎵</span>
        <span class="gamme-note gamme-note-4">🎶</span>
        <span class="gamme-note gamme-note-5">🎵</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('gamme-celebration-visible'));

  // Second confetti burst
  setTimeout(() => {
    confetti({ particleCount: 40, spread: 100, origin: { y: 0.4 }, shapes: ['star'], colors: ['#FFD700', '#FFA500', '#6C5CE7'] });
  }, 600);

  // Auto-dismiss after 3.5s or on click
  const dismiss = () => {
    overlay.classList.remove('gamme-celebration-visible');
    setTimeout(() => overlay.remove(), 500);
  };

  overlay.addEventListener('click', dismiss);
  setTimeout(dismiss, 3500);
}
