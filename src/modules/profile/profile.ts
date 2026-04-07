import { navigate } from '../../router';
import { getState, updateState, getProfiles, getActiveProfileId, setActiveProfile, renameProfile } from '../../shared/storage';
import { LEVELS, ACHIEVEMENTS } from '../../shared/gamification';
import { renderMascot, renderMascotById, MASCOTS, type MascotId } from '../../shared/mascot';
import { t } from '../../shared/i18n';
import { updateFavicon } from '../../shared/favicon';
import '../../shared/badges';
import './parent-zone';
import './profile.css';

export function renderProfile(container: HTMLElement): void {
  const state = getState();
  const level = LEVELS[state.gamification.level - 1] ?? LEVELS[0]!;
  const nextLevel = LEVELS[state.gamification.level] ?? null;
  const unlockedIds = new Set(state.gamification.achievements);
  const dictShowSentence = state.dictation?.showSentence ?? 'flash';
  const currentMascot = (state.profile.mascot || 'owl') as MascotId;
  const profiles = getProfiles();
  const activeId = getActiveProfileId();

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

      ${profiles.length > 1 ? `
        <div class="profile-switcher">
          <h2>👤 Choisir un profil</h2>
          <div class="profile-switcher-grid">
            ${profiles.map((p) => `
              <button class="profile-switch-card ${p.id === activeId ? 'profile-switch-active' : ''}" data-profile-id="${p.id}">
                <span class="profile-switch-name">${p.name}</span>
                ${p.id === activeId ? '<span class="profile-switch-badge">Actif</span>' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="profile-name-section">
        <label class="profile-name-label">Nom du profil :</label>
        <div class="profile-name-row">
          <input type="text" class="profile-name-input" id="profile-name-input" value="${state.profile.name || ''}" placeholder="Entre ton prénom..." />
          <button class="btn btn-primary" id="btn-save-name">OK</button>
        </div>
      </div>

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

      <div class="dictation-settings-section">
        <h2>🎧 Options dictée</h2>
        <div class="dictation-options">
          <button class="dictation-option ${dictShowSentence === 'flash' ? 'dictation-option-active' : ''}" data-dict-show="flash">
            <span class="dictation-option-icon">👀</span>
            <span class="dictation-option-label">Afficher 5 sec</span>
            <span class="dictation-option-desc">La phrase s'affiche 5 secondes puis disparaît</span>
          </button>
          <button class="dictation-option ${dictShowSentence === 'hidden' ? 'dictation-option-active' : ''}" data-dict-show="hidden">
            <span class="dictation-option-icon">🙈</span>
            <span class="dictation-option-label">Phrase cachée</span>
            <span class="dictation-option-desc">La phrase n'est jamais affichée, uniquement lue à voix haute</span>
          </button>
        </div>
      </div>

      <plumigo-badges id="badges-component"></plumigo-badges>

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

      <plumigo-parent-zone id="parent-zone-component"></plumigo-parent-zone>

      <p class="profile-credits">Cette application a été développée par Ganaël Jatteau pour aider les enfants qui ont des difficultés en orthographe.</p>
    </div>
  `;

  // Set badges component properties
  const badgesEl = document.getElementById('badges-component') as any;
  if (badgesEl) {
    badgesEl.achievements = ACHIEVEMENTS;
    badgesEl.unlockedIds = [...unlockedIds];
  }

  document.getElementById('btn-back-profile')?.addEventListener('click', () => navigate(''));

  // Profile name save
  document.getElementById('btn-save-name')?.addEventListener('click', () => {
    const input = document.getElementById('profile-name-input') as HTMLInputElement;
    const name = input.value.trim();
    if (name) {
      renameProfile(activeId, name);
      updateState((s) => { s.profile.name = name; });
      input.blur();
    }
  });

  document.getElementById('profile-name-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('btn-save-name')?.click();
    }
  });

  // Profile switcher
  container.querySelectorAll('.profile-switch-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-profile-id')!;
      if (id !== activeId) {
        setActiveProfile(id);
        updateFavicon();
        renderProfile(container);
      }
    });
  });

  // Mascot picker
  container.querySelectorAll('.mascot-pick-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-mascot') as MascotId;
      updateState((s) => { s.profile.mascot = id; });
      updateFavicon();

      container.querySelectorAll('.mascot-pick-card').forEach((b) => b.classList.remove('mascot-pick-active'));
      btn.classList.add('mascot-pick-active');

      const levelDiv = container.querySelector('.profile-level .mascot');
      if (levelDiv) {
        const temp = document.createElement('div');
        temp.innerHTML = renderMascotById(id, 'happy', 80);
        levelDiv.replaceWith(temp.firstElementChild!);
      }
    });
  });

  // Dictation display option
  container.querySelectorAll('.dictation-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-dict-show') as 'flash' | 'hidden';
      updateState((s) => { s.dictation.showSentence = mode; });
      container.querySelectorAll('.dictation-option').forEach((b) => b.classList.remove('dictation-option-active'));
      btn.classList.add('dictation-option-active');
    });
  });

  // Listen for profile changes from parent zone component
  document.getElementById('parent-zone-component')?.addEventListener('profile-changed', () => {
    renderProfile(container);
  });
}
