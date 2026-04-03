import { navigate } from '../../router';
import { getState } from '../../shared/storage';
import { LEVELS, updateDailyStreak } from '../../shared/gamification';
import { renderMascot, getMascotSpeech } from '../../shared/mascot';
import { t } from '../../shared/i18n';
import './dashboard.css';

export function renderDashboard(container: HTMLElement): void {
  updateDailyStreak();
  const state = getState();
  const level = LEVELS[state.gamification.level - 1] ?? LEVELS[0]!;
  const totalStars = Object.values(state.typing.completedLessons).reduce((sum, l) => sum + l.stars, 0);

  container.innerHTML = `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1 class="dashboard-title">${t.app.title}</h1>
        <p class="dashboard-subtitle">${t.app.subtitle}</p>
      </header>

      <div class="mascot-area">
        ${renderMascot('happy', 140)}
        <div class="mascot-speech">${getMascotSpeech('happy')}</div>
      </div>

      <div class="stats-bar">
        <div class="stat">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">${state.gamification.dailyStreak}</span>
          <span class="stat-label">${t.dashboard.streak}</span>
        </div>
        <div class="stat">
          <span class="stat-icon">🏅</span>
          <span class="stat-value">${level.name}</span>
          <span class="stat-label">${state.gamification.totalPoints} ${t.dashboard.points}</span>
        </div>
        <div class="stat">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">${totalStars}</span>
          <span class="stat-label">${t.dashboard.stars}</span>
        </div>
      </div>

      <div class="dashboard-cards">
        <button class="card card-typing" data-route="typing">
          <div class="card-icon">⌨️</div>
          <h2>${t.dashboard.typing}</h2>
          <p>${t.dashboard.typingDesc}</p>
        </button>

        <button class="card card-writing" data-route="writing">
          <div class="card-icon">✍️</div>
          <h2>${t.dashboard.writing}</h2>
          <p>${t.dashboard.writingDesc}</p>
        </button>
      </div>

      <button class="profile-link" data-route="profile">
        🏆 ${t.dashboard.profile}
      </button>
    </div>
  `;

  container.querySelectorAll('[data-route]').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigate(btn.getAttribute('data-route')!);
    });
  });
}
