import type { Lesson } from './lessons';
import { highlightKey, pressKey } from './keyboard';
import { playKeySound } from '../../shared/audio';
import { addPoints, recordTypingActivity } from '../../shared/gamification';
import { updateState } from '../../shared/storage';
import { fireStars, fireConfetti, showNotification } from '../../shared/animations';
import { playLevelUp, playAchievement } from '../../shared/audio';
import { t } from '../../shared/i18n';
import { navigate } from '../../router';
import { renderMascot } from '../../shared/mascot';

interface RunnerState {
  lesson: Lesson;
  chars: string[];
  currentIndex: number;
  correctCount: number;
  errorCount: number;
  startTime: number | null;
  finished: boolean;
}

let state: RunnerState | null = null;
let keyHandler: ((e: KeyboardEvent) => void) | null = null;

function getWpm(s: RunnerState): number {
  if (!s.startTime) return 0;
  const elapsed = (Date.now() - s.startTime) / 60000; // minutes
  if (elapsed < 0.01) return 0;
  const words = s.currentIndex / 5;
  return Math.round(words / elapsed);
}

function getAccuracy(s: RunnerState): number {
  const total = s.correctCount + s.errorCount;
  if (total === 0) return 100;
  return Math.round((s.correctCount / total) * 100);
}

function getStars(accuracy: number): number {
  if (accuracy >= 95) return 3;
  if (accuracy >= 85) return 2;
  return 1;
}

function renderStars(count: number): string {
  return '⭐'.repeat(count) + '<span class="stars-empty">' + '☆'.repeat(3 - count) + '</span>';
}

function updateDisplay(): void {
  if (!state) return;

  const textEl = document.getElementById('text-display');
  if (textEl) {
    textEl.innerHTML = state.chars
      .map((ch, i) => {
        let cls = 'char-pending';
        if (i < state!.currentIndex) {
          cls = 'char-correct';
        } else if (i === state!.currentIndex) {
          cls = 'char-current';
        }
        // Show space as visible character
        const display = ch === ' ' ? '&nbsp;' : ch;
        return `<span class="char ${cls}">${display}</span>`;
      })
      .join('');
  }

  const wpmEl = document.getElementById('stat-wpm');
  if (wpmEl) wpmEl.textContent = String(getWpm(state));

  const accEl = document.getElementById('stat-accuracy');
  if (accEl) accEl.textContent = getAccuracy(state) + '%';

  // Highlight next key
  if (state.currentIndex < state.chars.length) {
    highlightKey(state.chars[state.currentIndex]!);
  }
}

function showComplete(): void {
  if (!state) return;

  const accuracy = getAccuracy(state);
  const wpm = getWpm(state);
  const stars = getStars(accuracy);

  // Save results
  updateState((s) => {
    const existing = s.typing.completedLessons[state!.lesson.id];
    s.typing.completedLessons[state!.lesson.id] = {
      stars: Math.max(stars, existing?.stars ?? 0),
      bestWpm: Math.max(wpm, existing?.bestWpm ?? 0),
      bestAccuracy: Math.max(accuracy, existing?.bestAccuracy ?? 0),
    };
    // Advance current lesson
    const nextNum = state!.lesson.number + 1;
    if (nextNum <= 20) {
      s.typing.currentLesson = `lesson-${nextNum}`;
    }
  });

  recordTypingActivity(state.correctCount, state.correctCount + state.errorCount);

  // Points: 1 per correct char + 5 completion + 10 if 3 stars
  let points = state.correctCount + 5;
  if (stars === 3) points += 10;
  const { newAchievements, leveledUp } = addPoints(points);

  if (stars === 3) {
    fireConfetti();
  } else {
    fireStars();
  }

  if (leveledUp) {
    playLevelUp();
    showNotification('Niveau supérieur !', '🏅');
  }

  for (const ach of newAchievements) {
    playAchievement();
    showNotification(ach.name, ach.icon);
  }

  const nextLessonId = `lesson-${state.lesson.number + 1}`;
  const hasNext = state.lesson.number < 20;

  const overlay = document.createElement('div');
  overlay.className = 'lesson-complete fade-in';
  overlay.innerHTML = `
    <div class="lesson-complete-card">
      ${renderMascot(stars === 3 ? 'celebrating' : 'encouraging', 100)}
      <h2>${t.typing.complete}</h2>
      <div class="lesson-complete-stars">${renderStars(stars)}</div>
      <div class="lesson-complete-stats">
        <div class="lesson-stat">
          <span class="lesson-stat-value">${wpm}</span>
          <span class="lesson-stat-label">${t.typing.wpm}</span>
        </div>
        <div class="lesson-stat">
          <span class="lesson-stat-value">${accuracy}%</span>
          <span class="lesson-stat-label">${t.typing.accuracy}</span>
        </div>
      </div>
      <div class="lesson-complete-actions">
        <button class="btn btn-ghost" id="btn-retry">${t.typing.retry}</button>
        ${hasNext ? `<button class="btn btn-primary" id="btn-next">${t.typing.nextLesson}</button>` : ''}
        <button class="btn btn-ghost" id="btn-back-complete">${t.typing.back}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('btn-retry')?.addEventListener('click', () => {
    overlay.remove();
    startLesson(state!.lesson);
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    overlay.remove();
    // Import dynamically to avoid circular ref
    navigate(`typing/${nextLessonId}`);
  });

  document.getElementById('btn-back-complete')?.addEventListener('click', () => {
    overlay.remove();
    navigate('typing');
  });
}

function handleKey(e: KeyboardEvent): void {
  if (!state || state.finished) return;
  if (e.key === 'Escape') {
    cleanup();
    navigate('typing');
    return;
  }

  // Ignore modifier keys alone
  if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;

  e.preventDefault();

  const expected = state.chars[state.currentIndex];
  if (!expected) return;

  // Determine typed character
  let typed = e.key;
  if (typed === 'Enter') typed = '\n';

  // Start timer on first keypress
  if (!state.startTime) {
    state.startTime = Date.now();
  }

  pressKey(typed);

  if (typed === expected) {
    state.correctCount++;
    state.currentIndex++;
    playKeySound(true);
  } else {
    state.errorCount++;
    playKeySound(false);
    // Mark current char as incorrect briefly
    const textEl = document.getElementById('text-display');
    if (textEl) {
      const charEls = textEl.querySelectorAll('.char');
      const currentEl = charEls[state.currentIndex];
      if (currentEl) {
        currentEl.classList.remove('char-current');
        currentEl.classList.add('char-incorrect');
        setTimeout(() => {
          currentEl.classList.remove('char-incorrect');
          currentEl.classList.add('char-current');
        }, 300);
      }
    }
  }

  updateDisplay();

  if (state.currentIndex >= state.chars.length) {
    state.finished = true;
    showComplete();
  }
}

export function startLesson(lesson: Lesson): void {
  cleanup();

  state = {
    lesson,
    chars: lesson.text.split(''),
    currentIndex: 0,
    correctCount: 0,
    errorCount: 0,
    startTime: null,
    finished: false,
  };

  keyHandler = handleKey;
  document.addEventListener('keydown', keyHandler);

  updateDisplay();
}

export function cleanup(): void {
  if (keyHandler) {
    document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  }
  state = null;
  // Remove any completion overlay
  document.querySelector('.lesson-complete')?.remove();
}

export function renderLessonRunner(lesson: Lesson): string {
  return `
    <div class="lesson-runner fade-in">
      <button class="back-btn" id="btn-back-lesson">← ${t.typing.back}</button>
      <h2>${t.typing.lesson} ${lesson.number} : ${lesson.title}</h2>

      <div class="lesson-info">
        <div class="lesson-stat">
          <span class="lesson-stat-value" id="stat-wpm">0</span>
          <span class="lesson-stat-label">${t.typing.wpm}</span>
        </div>
        <div class="lesson-stat">
          <span class="lesson-stat-value" id="stat-accuracy">100%</span>
          <span class="lesson-stat-label">${t.typing.accuracy}</span>
        </div>
      </div>

      <div class="text-display" id="text-display"></div>
    </div>
  `;
}
