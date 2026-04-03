import { navigate } from '../../router';
import { getState } from '../../shared/storage';
import { LEVELS, ACHIEVEMENTS } from '../../shared/gamification';
import { renderMascot } from '../../shared/mascot';
import { t } from '../../shared/i18n';
import { renderParentZone } from './parent-zone';
import './profile.css';

export function renderProfile(container: HTMLElement): void {
  const state = getState();
  const level = LEVELS[state.gamification.level - 1] ?? LEVELS[0]!;
  const nextLevel = LEVELS[state.gamification.level] ?? null;
  const unlockedIds = new Set(state.gamification.achievements);

  const totalLessons = Object.keys(state.typing.completedLessons).length;
  const totalStories = state.writing.stories.length;
  const avgAccuracy = state.typing.totalKeysTyped > 0
    ? Math.round((state.typing.totalCorrectKeys / state.typing.totalKeysTyped) * 100)
    : 0;
  const totalStars = Object.values(state.typing.completedLessons).reduce((sum, l) => sum + l.stars, 0);

  // Progress to next level
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
            <span class="stat-card-value">${totalLessons}/20</span>
            <span class="stat-card-label">Leçons terminées</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${totalStars} ⭐</span>
            <span class="stat-card-label">Étoiles gagnées</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${avgAccuracy}%</span>
            <span class="stat-card-label">${t.profile.accuracy}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${totalStories}</span>
            <span class="stat-card-label">${t.profile.totalStories}</span>
          </div>
        </div>
      </div>

      <div id="parent-zone"></div>
    </div>
  `;

  document.getElementById('btn-back-profile')?.addEventListener('click', () => navigate(''));

  renderParentZone(document.getElementById('parent-zone')!);
}
