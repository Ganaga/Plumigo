import { getState, updateState, getProfiles, getActiveProfileId, createProfile, deleteProfile } from '../../shared/storage';
import { t } from '../../shared/i18n';

function generateMathQuestion(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 9) + 2;
  const b = Math.floor(Math.random() * 9) + 2;
  return { question: `${a} × ${b}`, answer: a * b };
}

export function renderParentZone(parentEl: HTMLElement): void {
  const math = generateMathQuestion();
  let unlocked = false;

  parentEl.innerHTML = `
    <div class="parent-zone-gate">
      <button class="parent-zone-btn" id="btn-parent-gate">🔒 ${t.profile.parentZone}</button>
      <div class="math-gate" id="math-gate" style="display:none;">
        <p>${t.profile.parentGate} ${math.question} ?</p>
        <input type="number" id="math-answer" autocomplete="off" />
        <span class="math-gate-error" id="math-error" style="display:none;">Mauvaise réponse, réessaie !</span>
      </div>
      <div id="parent-dashboard" style="display:none;"></div>
    </div>
  `;

  document.getElementById('btn-parent-gate')?.addEventListener('click', () => {
    if (unlocked) return;
    document.getElementById('math-gate')!.style.display = 'flex';
    document.getElementById('math-answer')!.focus();
  });

  document.getElementById('math-answer')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = document.getElementById('math-answer') as HTMLInputElement;
      const value = parseInt(input.value, 10);

      if (value === math.answer) {
        unlocked = true;
        document.getElementById('math-gate')!.style.display = 'none';
        document.getElementById('btn-parent-gate')!.textContent = '🔓 Zone parent';
        showParentDashboard();
      } else {
        document.getElementById('math-error')!.style.display = 'block';
        input.value = '';
        input.focus();
      }
    }
  });

  function renderProfileManagement(): string {
    const profiles = getProfiles();
    const activeId = getActiveProfileId();

    return `
      <div class="parent-profiles">
        <h3>👥 Gestion des profils</h3>
        <div class="parent-profiles-list">
          ${profiles.map((p) => `
            <div class="parent-profile-row">
              <span class="parent-profile-name">${p.name} ${p.id === activeId ? '<em>(actif)</em>' : ''}</span>
              ${profiles.length > 1 ? `<button class="parent-profile-delete" data-delete-id="${p.id}" title="Supprimer">🗑️</button>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="parent-profile-add">
          <input type="text" id="new-profile-name" placeholder="Nom du nouveau profil..." class="parent-profile-input" />
          <button class="btn btn-primary" id="btn-add-profile">+ Ajouter</button>
        </div>
      </div>
    `;
  }

  function showParentDashboard(): void {
    const state = getState();
    const totalStories = state.writing.stories.length;
    const totalWords = state.writing.stories.reduce((sum, s) => sum + s.wordCount, 0);
    const activityDays = Object.keys(state.gamification.dailyActivity).sort().reverse().slice(0, 7);

    const dashboardEl = document.getElementById('parent-dashboard')!;
    dashboardEl.style.display = 'block';
    dashboardEl.innerHTML = `
      <div class="parent-dashboard">
        <h2>📊 Tableau de bord parent</h2>

        <div class="parent-stat-row">
          <span class="parent-stat-label">Histoires écrites</span>
          <span class="parent-stat-value">${totalStories}</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Mots écrits (total)</span>
          <span class="parent-stat-value">${totalWords.toLocaleString('fr-FR')}</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Fautes corrigées</span>
          <span class="parent-stat-value">${state.writing.totalCorrections}</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Fautes de grammaire corrigées</span>
          <span class="parent-stat-value">${state.writing.grammarCorrections}</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Série actuelle</span>
          <span class="parent-stat-value">${state.gamification.dailyStreak} jours</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Points totaux</span>
          <span class="parent-stat-value">${state.gamification.totalPoints.toLocaleString('fr-FR')}</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Jours actifs (7 derniers jours)</span>
          <span class="parent-stat-value">${activityDays.length}</span>
        </div>

        <div class="parent-options">
          <h3>⚙️ Options</h3>
          <label class="parent-toggle-row">
            <span>Clavier intégré AZERTY</span>
            <span class="parent-toggle-hint">Désactive la correction automatique du clavier Android</span>
            <input type="checkbox" id="chk-builtin-keyboard" ${state.profile.useBuiltInKeyboard ? 'checked' : ''} />
          </label>
        </div>

        ${renderProfileManagement()}

        <button class="reset-btn" id="btn-reset">${t.profile.reset}</button>
      </div>
    `;

    // Add profile
    document.getElementById('btn-add-profile')?.addEventListener('click', () => {
      const input = document.getElementById('new-profile-name') as HTMLInputElement;
      const name = input.value.trim();
      if (name) {
        createProfile(name);
        showParentDashboard(); // Re-render
      }
    });

    document.getElementById('new-profile-name')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btn-add-profile')?.click();
    });

    // Delete profiles
    dashboardEl.querySelectorAll('.parent-profile-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).getAttribute('data-delete-id')!;
        const profiles = getProfiles();
        const profile = profiles.find((p) => p.id === id);
        if (profile && confirm(`Supprimer le profil "${profile.name}" ? Toutes ses données seront perdues.`)) {
          deleteProfile(id);
          showParentDashboard(); // Re-render
        }
      });
    });

    // Built-in keyboard toggle
    document.getElementById('chk-builtin-keyboard')?.addEventListener('change', (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      updateState((s) => { s.profile.useBuiltInKeyboard = checked; });
    });

    // Reset
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      if (confirm(t.profile.resetConfirm)) {
        // Clear all data
        const keys = Object.keys(localStorage).filter((k) => k.startsWith('plumigo_'));
        keys.forEach((k) => localStorage.removeItem(k));
        window.location.reload();
      }
    });
  }
}
