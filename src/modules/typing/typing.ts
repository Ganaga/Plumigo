import { navigate } from '../../router';
import { getState } from '../../shared/storage';
import { t } from '../../shared/i18n';
import { LESSONS, getLessonById, getPhaseLabel } from './lessons';
import { renderKeyboard } from './keyboard';
import { renderLessonRunner, startLesson, cleanup } from './lesson-runner';
import './typing.css';

function renderStars(count: number): string {
  if (count === 0) return '';
  return '⭐'.repeat(count) + '☆'.repeat(3 - count);
}

function renderLessonList(container: HTMLElement): void {
  const state = getState();
  const completedIds = new Set(Object.keys(state.typing.completedLessons));

  // Group by phase
  const phases = new Map<number, typeof LESSONS>();
  for (const lesson of LESSONS) {
    if (!phases.has(lesson.phase)) phases.set(lesson.phase, []);
    phases.get(lesson.phase)!.push(lesson);
  }

  let html = `
    <div class="typing-page fade-in">
      <button class="back-btn" id="btn-back-typing">← ${t.typing.back}</button>
      <h1>⌨️ ${t.typing.title}</h1>
      <div class="lesson-phases">
  `;

  for (const [phase, lessons] of phases) {
    html += `
      <div class="phase-group">
        <h2>${getPhaseLabel(phase)}</h2>
        <div class="lesson-grid">
    `;

    for (const lesson of lessons) {
      const completed = completedIds.has(lesson.id);
      const result = state.typing.completedLessons[lesson.id];
      // A lesson is accessible if it's #1 or the previous one is completed
      const isAccessible = lesson.number === 1 || completedIds.has(`lesson-${lesson.number - 1}`);

      html += `
        <button class="lesson-card ${completed ? 'completed' : ''} ${!isAccessible ? 'locked' : ''}"
                data-lesson="${lesson.id}" ${!isAccessible ? 'disabled' : ''}>
          <span class="lesson-num">${lesson.number}</span>
          <span class="lesson-keys">${lesson.title}</span>
          <span class="lesson-stars">${result ? renderStars(result.stars) : ''}</span>
        </button>
      `;
    }

    html += '</div></div>';
  }

  html += '</div></div>';
  container.innerHTML = html;

  // Events
  document.getElementById('btn-back-typing')?.addEventListener('click', () => navigate(''));

  container.querySelectorAll('.lesson-card:not(.locked)').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lessonId = btn.getAttribute('data-lesson')!;
      navigate(`typing/${lessonId}`);
    });
  });
}

function renderLessonView(container: HTMLElement, lessonId: string): () => void {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    renderLessonList(container);
    return () => {};
  }

  container.innerHTML = `
    <div class="typing-page">
      ${renderLessonRunner(lesson)}
      ${renderKeyboard()}
    </div>
  `;

  document.getElementById('btn-back-lesson')?.addEventListener('click', () => {
    cleanup();
    navigate('typing');
  });

  startLesson(lesson);

  return () => cleanup();
}

export function renderTyping(container: HTMLElement, params?: string): void | (() => void) {
  if (params) {
    return renderLessonView(container, params);
  }
  renderLessonList(container);
}
