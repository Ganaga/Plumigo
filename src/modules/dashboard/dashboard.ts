import { navigate } from '../../router';
import { getState, updateState, renameProfile, getActiveProfileId } from '../../shared/storage';
import { LEVELS, updateDailyStreak, getDailyWordsWritten, getDailyWordGoal } from '../../shared/gamification';
import { renderMascot, getMascotSpeech } from '../../shared/mascot';
import { t } from '../../shared/i18n';
import './dashboard.css';

function renderNamePrompt(container: HTMLElement): void {
  container.innerHTML = `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1 class="dashboard-title">${t.app.title}</h1>
      </header>

      <div class="mascot-area">
        ${renderMascot('happy', 140)}
        <div class="mascot-speech">Salut ! Comment tu t'appelles ?</div>
      </div>

      <div class="name-prompt">
        <input type="text" class="name-prompt-input" id="name-input" placeholder="Ton prénom..." autofocus />
        <button class="btn btn-primary" id="btn-name-ok">C'est parti !</button>
      </div>
    </div>
  `;

  const submit = () => {
    const input = document.getElementById('name-input') as HTMLInputElement;
    const name = input.value.trim();
    if (name) {
      updateState((s) => { s.profile.name = name; });
      renameProfile(getActiveProfileId(), name);
      renderDashboard(container);
    }
  };

  document.getElementById('btn-name-ok')?.addEventListener('click', submit);
  document.getElementById('name-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
}

export function renderDashboard(container: HTMLElement): void {
  updateDailyStreak();
  const state = getState();

  if (!state.profile.name) {
    renderNamePrompt(container);
    return;
  }

  const level = LEVELS[state.gamification.level - 1] ?? LEVELS[0]!;
  const totalStories = state.writing.stories.length;
  const dailyWords = getDailyWordsWritten();
  const dailyGoal = getDailyWordGoal();
  const dailyPct = Math.min(100, Math.round((dailyWords / dailyGoal) * 100));

  container.innerHTML = `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1 class="dashboard-title">${t.app.title}</h1>
        <p class="dashboard-subtitle">Bonjour ${state.profile.name} !</p>
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
          <span class="stat-icon">📚</span>
          <span class="stat-value">${totalStories}</span>
          <span class="stat-label">${t.dashboard.stories}</span>
        </div>
      </div>

      <div class="dashboard-daily">
        <span class="dashboard-daily-label">🎯 Objectif du jour : ${dailyWords} / ${dailyGoal} mots</span>
        <div class="progress-bar"><div class="progress-fill ${dailyPct >= 100 ? 'complete' : ''}" style="width:${dailyPct}%"></div></div>
      </div>

      <div class="dashboard-cards">
        <button class="card card-writing" data-route="writing">
          <div class="card-icon">✍️</div>
          <h2>${t.dashboard.writing}</h2>
          <p>${t.dashboard.writingDesc}</p>
        </button>
        <button class="card card-dictation" data-route="dictation">
          <div class="card-icon">🎧</div>
          <h2>Dictée</h2>
          <p>Écoute et écris la phrase</p>
        </button>
        <button class="card card-hangman" data-route="hangman">
          <div class="card-icon">🎯</div>
          <h2>Le Pendu</h2>
          <p>Devine le mot lettre par lettre</p>
        </button>
        <button class="card card-quiz" data-route="quiz">
          <div class="card-icon">❓</div>
          <h2>Quiz</h2>
          <p>Choisis la bonne orthographe</p>
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
