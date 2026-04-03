import { navigate } from '../../router';
import { getState, updateState } from '../../shared/storage';
import { LEVELS, ACHIEVEMENTS } from '../../shared/gamification';
import { renderMascot, renderMascotById, MASCOTS, type MascotId } from '../../shared/mascot';
import { t } from '../../shared/i18n';
import { renderParentZone } from './parent-zone';
import './profile.css';

export function renderProfile(container: HTMLElement): void {
  const state = getState();
  const level = LEVELS[state.gamification.level - 1] ?? LEVELS[0]!;
  const nextLevel = LEVELS[state.gamification.level] ?? null;
  const unlockedIds = new Set(state.gamification.achievements);
  const currentMascot = (state.profile.mascot || 'owl') as MascotId;

  const totalStories = state.writing.stories.length;
  const totalWords = state.writing.stories.reduce((sum, s) => sum + s.wordCount, 0);
  const totalCorrections = state.writing.totalCorrections;

  let progressPct = 100;
  let progressLabel = 'Niveau max !';
  if (nextLevel) {
    const current = state.gamification.totalPoints - level.minPoints;
    const needed = nextLevel.minPoints - level.minPoints;
    progressPct = Math.min(100, Math.round((current / needed) * 100));
    progressLabel = `${state.gamification.totalPoints} / ${nextLevel.minPoints} ${t.dashboard.points}`;
  }

  container.innerHTML = `
    <div class="profile-page fade-in">
      <button class="back-btn" id="btn-back-profile">← ${t.profile.back}</button>
      <h1>🏆 ${t.profile.title}</h1>

      <div class="profile-level">
        ${renderMascot('happy', 80)}
        <div class="profile-level-name">${level.name}</div>
        <div class="profile-level-info">${progressLabel}</div>
        <div class="profile-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progressPct}%"></div>
          </div>
        </div>
      </div>

      <div class="mascot-picker-section">
        <h2>🎨 Ma mascotte</h2>
        <div class="mascot-picker-grid">
          ${MASCOTS.map((m) => `
            <button class="mascot-pick-card ${m.id === currentMascot ? 'mascot-pick-active' : ''}" data-mascot="${m.id}">
              ${renderMascotById(m.id, 'happy', 64)}
              <span class="mascot-pick-name">${m.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="achievements-section">
        <h2>🏅 ${t.profile.achievements}</h2>
        <div class="achievements-grid">
          ${ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedIds.has(ach.id);
            return `
              <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                <span class="achievement-icon">${unlocked ? ach.icon : '🔒'}</span>
                <span class="achievement-name">${ach.name}</span>
                <span class="achievement-desc">${unlocked ? ach.description : t.profile.locked}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="stats-section">
        <h2>📊 ${t.profile.stats}</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-card-value">${totalStories}</span>
            <span class="stat-card-label">${t.profile.totalStories}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${totalWords.toLocaleString('fr-FR')}</span>
            <span class="stat-card-label">${t.profile.totalWords}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${totalCorrections}</span>
            <span class="stat-card-label">${t.profile.totalCorrections}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">🔥 ${state.gamification.dailyStreak}</span>
            <span class="stat-card-label">${t.dashboard.streak}</span>
          </div>
        </div>
      </div>

      <div id="parent-zone"></div>
    </div>
  `;

  document.getElementById('btn-back-profile')?.addEventListener('click', () => navigate(''));

  // Mascot picker
  container.querySelectorAll('.mascot-pick-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-mascot') as MascotId;
      updateState((s) => { s.profile.mascot = id; });

      // Update active state visually
      container.querySelectorAll('.mascot-pick-card').forEach((b) => b.classList.remove('mascot-pick-active'));
      btn.classList.add('mascot-pick-active');

      // Re-render the header mascot
      const levelDiv = container.querySelector('.profile-level .mascot');
      if (levelDiv) {
        const temp = document.createElement('div');
        temp.innerHTML = renderMascotById(id, 'happy', 80);
        levelDiv.replaceWith(temp.firstElementChild!);
      }
    });
  });

  renderParentZone(document.getElementById('parent-zone')!);
}
