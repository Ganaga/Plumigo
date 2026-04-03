import { getState } from '../../shared/storage';
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

  function showParentDashboard(): void {
    const state = getState();
    const totalLessons = Object.keys(state.typing.completedLessons).length;
    const avgAccuracy = state.typing.totalKeysTyped > 0
      ? Math.round((state.typing.totalCorrectKeys / state.typing.totalKeysTyped) * 100)
      : 0;
    const totalStories = state.writing.stories.length;
    const totalWords = state.writing.stories.reduce((sum, s) => sum + s.wordCount, 0);

    // Recent activity
    const activityDays = Object.keys(state.gamification.dailyActivity).sort().reverse().slice(0, 7);

    document.getElementById('parent-dashboard')!.style.display = 'block';
    document.getElementById('parent-dashboard')!.innerHTML = `
      <div class="parent-dashboard">
        <h2>📊 Tableau de bord parent</h2>

        <div class="parent-stat-row">
          <span class="parent-stat-label">Leçons terminées</span>
          <span class="parent-stat-value">${totalLessons}/20</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Précision moyenne</span>
          <span class="parent-stat-value">${avgAccuracy}%</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Touches tapées</span>
          <span class="parent-stat-value">${state.typing.totalKeysTyped.toLocaleString('fr-FR')}</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Histoires écrites</span>
          <span class="parent-stat-value">${totalStories}</span>
        </div>
        <div class="parent-stat-row">
          <span class="parent-stat-label">Mots écrits (total)</span>
          <span class="parent-stat-value">${totalWords.toLocaleString('fr-FR')}</span>
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

        <button class="reset-btn" id="btn-reset">${t.profile.reset}</button>
      </div>
    `;

    document.getElementById('btn-reset')?.addEventListener('click', () => {
      if (confirm(t.profile.resetConfirm)) {
        localStorage.removeItem('kidwriter_state');
        window.location.reload();
      }
    });
  }
}
