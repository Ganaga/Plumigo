import confetti from 'canvas-confetti';

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
