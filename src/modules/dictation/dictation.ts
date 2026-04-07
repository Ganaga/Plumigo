import { navigate } from '../../router';
import { getState, updateState } from '../../shared/storage';
import { addPoints } from '../../shared/gamification';
import { fireConfetti, fireStars, showNotification } from '../../shared/animations';
import { playKeySound, playAchievement } from '../../shared/audio';
import { renderMascot } from '../../shared/mascot';
import { speak, hasTtsSupport } from '../../shared/tts';
import { getRandomSentence } from './sentences';
import { compareWords, getScore, isComplete, isPerfect, type ComparisonResult } from './comparison';
import { isBuiltInKeyboardEnabled } from '../../shared/keyboard';
import '../../shared/keyboard';
import './dictation.css';

type Difficulty = 'easy' | 'medium' | 'hard';
type ShowMode = 'flash' | 'hidden';

interface SessionState {
  difficulty: Difficulty;
  sentence: string;
  sentenceId: number;
  completedIds: number[];
  sessionCorrect: number;
  sessionTotal: number;
  results: ComparisonResult[];
  done: boolean;
  sentenceVisible: boolean;
}

let session: SessionState | null = null;

function getShowMode(): ShowMode {
  const state = getState();
  return state.dictation?.showSentence ?? 'flash';
}

function renderDifficultySelect(container: HTMLElement): void {
  const showMode = getShowMode();
  const modeLabel = showMode === 'flash' ? '👀 Phrase visible 5 sec' : '🙈 Phrase cachée';

  container.innerHTML = `
    <div class="dictation-page fade-in">
      <button class="back-btn" id="btn-back-dict">← Retour</button>
      <h1>🎧 Dictée</h1>

      <div class="dictation-intro">
        ${renderMascot('happy', 100)}
        <p>Écoute la phrase et tape-la sans faute !</p>
        <span class="dictation-mode-badge">${modeLabel}</span>
      </div>

      ${!hasTtsSupport() ? '<p class="dictation-warning">La synthèse vocale n\'est pas disponible sur ce navigateur.</p>' : ''}

      <div class="difficulty-selector">
        <button class="difficulty-btn difficulty-easy" data-diff="easy">
          <span class="difficulty-icon">🌱</span>
          <span class="difficulty-label">Facile</span>
          <span class="difficulty-desc">3 à 5 mots</span>
        </button>
        <button class="difficulty-btn difficulty-medium" data-diff="medium">
          <span class="difficulty-icon">🌿</span>
          <span class="difficulty-label">Moyen</span>
          <span class="difficulty-desc">6 à 10 mots</span>
        </button>
        <button class="difficulty-btn difficulty-hard" data-diff="hard">
          <span class="difficulty-icon">🌳</span>
          <span class="difficulty-label">Difficile</span>
          <span class="difficulty-desc">11+ mots</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-back-dict')?.addEventListener('click', () => navigate(''));

  container.querySelectorAll('.difficulty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const diff = btn.getAttribute('data-diff') as Difficulty;
      startSession(container, diff);
    });
  });
}

function startSession(container: HTMLElement, difficulty: Difficulty): void {
  const sentence = getRandomSentence(difficulty, session?.completedIds ?? []);
  if (!sentence) {
    showNotification('Toutes les phrases ont été faites !', '🎉');
    renderDifficultySelect(container);
    return;
  }

  const showMode = getShowMode();

  session = {
    difficulty,
    sentence: sentence.text,
    sentenceId: sentence.id,
    completedIds: session?.completedIds ?? [],
    sessionCorrect: session?.sessionCorrect ?? 0,
    sessionTotal: session?.sessionTotal ?? 0,
    results: [],
    done: false,
    sentenceVisible: showMode === 'flash',
  };

  renderExercise(container);

  // Read the sentence aloud
  setTimeout(() => speak(sentence.text), 300);

  // Flash mode: hide sentence after 5 seconds
  if (showMode === 'flash') {
    setTimeout(() => {
      if (session && session.sentenceVisible && !session.done) {
        session.sentenceVisible = false;
        const display = document.getElementById('sentence-display');
        if (display) {
          display.classList.add('sentence-hidden');
          setTimeout(() => {
            if (display) display.innerHTML = '<span class="dictation-listen-hint">🎧 Tape ce que tu as entendu...</span>';
          }, 400);
        }
      }
    }, 5000);
  }
}

function renderExercise(container: HTMLElement): void {
  if (!session) return;



  let displayHtml: string;
  if (session.done || session.results.length > 0) {
    // Show comparison results
    displayHtml = session.results
      .map((r) => {
        const cls = r.status === 'correct' ? 'word-correct' : r.status === 'incorrect' ? 'word-incorrect' : r.status === 'typing' ? 'word-typing' : 'word-pending';
        return `<span class="dictation-word ${cls}">${r.expected}</span>`;
      })
      .join(' ');
  } else if (session.sentenceVisible) {
    // Show the sentence (flash mode, first 5 seconds)
    displayHtml = session.sentence.split(/\s+/)
      .map((w) => `<span class="dictation-word word-flash">${w}</span>`)
      .join(' ');
  } else {
    // Hidden mode or after flash expired
    displayHtml = '<span class="dictation-listen-hint">🎧 Tape ce que tu as entendu...</span>';
  }

  const score = session.results.length > 0 ? getScore(session.results) : null;
  const done = session.done;

  container.innerHTML = `
    <div class="dictation-page fade-in">
      <button class="back-btn" id="btn-back-exercise">← Changer de niveau</button>

      <div class="dictation-sentence-display" id="sentence-display">
        ${displayHtml}
      </div>

      <div class="dictation-controls">
        <button class="btn btn-ghost" id="btn-replay">🔊 Réécouter</button>
      </div>

      ${done ? `
        <div class="dictation-result">
          ${renderMascot(score && score.correct === score.total ? 'ecstatic' : 'happy', 80)}
          <div class="dictation-score">
            <span class="dictation-score-value">${score?.correct ?? 0} / ${score?.total ?? 0}</span>
            <span class="dictation-score-label">${score && score.correct === score.total ? 'Parfait !' : 'Bien joué !'}</span>
          </div>
          <button class="btn btn-primary" id="btn-next">Suivant →</button>
        </div>
      ` : `
        <div class="dictation-input-area">
          <input type="text" class="dictation-input" id="dictation-input" placeholder="Tape la phrase ici..." autocomplete="off" autocapitalize="off" autocorrect="off" />
          <plumigo-keyboard id="dict-vk-component"></plumigo-keyboard>
        </div>
      `}
    </div>
  `;

  // Events
  document.getElementById('btn-back-exercise')?.addEventListener('click', () => {
    session = null;
    renderDifficultySelect(container);
  });

  document.getElementById('btn-replay')?.addEventListener('click', () => {
    speak(session!.sentence);
  });

  if (!done) {
    const input = document.getElementById('dictation-input') as HTMLInputElement;
    input.focus();

    // Attach virtual keyboard if enabled
    const dictVk = document.getElementById('dict-vk-component') as any;
    if (dictVk && isBuiltInKeyboardEnabled()) {
      dictVk.target = input;
      dictVk.active = true;
    }

    input.addEventListener('input', () => {
      if (!session) return;
      const typed = input.value;
      session.results = compareWords(session.sentence, typed);

      // Update word display with results
      const display = document.getElementById('sentence-display')!;
      display.innerHTML = session.results
        .map((r) => {
          const cls = r.status === 'correct' ? 'word-correct' : r.status === 'incorrect' ? 'word-incorrect' : r.status === 'typing' ? 'word-typing' : 'word-pending';
          return `<span class="dictation-word ${cls}">${r.expected}</span>`;
        })
        .join(' ');

      // Check if complete
      if (isComplete(session.results)) {
        const perfect = isPerfect(session.results);
        const { correct, total } = getScore(session.results);

        session.done = true;
        session.completedIds.push(session.sentenceId);
        session.sessionCorrect += correct;
        session.sessionTotal += total;

        updateState((s) => {
          s.dictation.sentencesCompleted += 1;
          if (perfect) s.dictation.perfectScores += 1;
        });

        const points = perfect ? 5 : Math.max(1, Math.floor(correct / 2));
        const { newAchievements } = addPoints(points);

        if (perfect) {
          fireConfetti();
          playAchievement();
        } else {
          fireStars();
          playKeySound(true);
        }

        for (const ach of newAchievements) {
          playAchievement();
          showNotification(ach.name, ach.icon);
        }

        renderExercise(container);
      }
    });
  }

  document.getElementById('btn-next')?.addEventListener('click', () => {
    startSession(container, session!.difficulty);
  });
}

export function renderDictation(container: HTMLElement): (() => void) {
  session = null;
  renderDifficultySelect(container);
  return () => {
    document.body.classList.remove('vk-active');
  };
}
