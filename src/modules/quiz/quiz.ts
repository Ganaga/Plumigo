import { navigate } from '../../router';
import { updateState } from '../../shared/storage';
import { addPoints } from '../../shared/gamification';
import { fireStars, fireConfetti, showNotification } from '../../shared/animations';
import { playKeySound, playAchievement } from '../../shared/audio';
import { renderMascot } from '../../shared/mascot';
import { speak } from '../../shared/tts';
import { getRandomQuestion, type QuizQuestion, type SchoolLevel } from './questions';
import './quiz.css';

interface QuizSession {
  level: SchoolLevel;
  question: QuizQuestion;
  selectedIndex: number | null;
  answered: boolean;
  questionsAsked: number[];
  sessionCorrect: number;
  sessionTotal: number;
}

let session: QuizSession | null = null;

function renderLevelSelect(container: HTMLElement): void {
  container.innerHTML = `
    <div class="quiz-page fade-in">
      <button class="back-btn" id="btn-back-quiz">← Retour</button>
      <h1>❓ Quiz orthographe</h1>

      <div class="quiz-intro">
        ${renderMascot('happy', 100)}
        <p>Choisis la bonne orthographe parmi les propositions !</p>
      </div>

      <div class="level-selector">
        <button class="level-btn level-cp" data-level="CP">
          <span class="level-icon">🌱</span>
          <span class="level-label">CP</span>
          <span class="level-desc">Découverte</span>
        </button>
        <button class="level-btn level-ce1" data-level="CE1">
          <span class="level-icon">🌿</span>
          <span class="level-label">CE1</span>
          <span class="level-desc">Apprentissage</span>
        </button>
        <button class="level-btn level-ce2" data-level="CE2">
          <span class="level-icon">🍀</span>
          <span class="level-label">CE2</span>
          <span class="level-desc">Consolidation</span>
        </button>
        <button class="level-btn level-cm1" data-level="CM1">
          <span class="level-icon">🌳</span>
          <span class="level-label">CM1</span>
          <span class="level-desc">Approfondissement</span>
        </button>
        <button class="level-btn level-cm2" data-level="CM2">
          <span class="level-icon">🎓</span>
          <span class="level-label">CM2</span>
          <span class="level-desc">Maîtrise</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-back-quiz')?.addEventListener('click', () => navigate(''));

  container.querySelectorAll('.level-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const level = btn.getAttribute('data-level') as SchoolLevel;
      startQuestion(container, level);
    });
  });
}

function startQuestion(container: HTMLElement, level: SchoolLevel): void {
  const question = getRandomQuestion(level, session?.questionsAsked ?? []);
  if (!question) {
    showNotification('Toutes les questions ont été posées !', '🎉');
    renderLevelSelect(container);
    return;
  }

  updateState((s) => { s.quiz.currentLevel = level; });

  session = {
    level,
    question,
    selectedIndex: null,
    answered: false,
    questionsAsked: session?.questionsAsked ?? [],
    sessionCorrect: session?.sessionCorrect ?? 0,
    sessionTotal: session?.sessionTotal ?? 0,
  };

  renderQuestion(container);
}

function answerQuestion(container: HTMLElement, choiceIndex: number): void {
  if (!session || session.answered) return;

  session.selectedIndex = choiceIndex;
  session.answered = true;
  session.questionsAsked.push(session.question.id);
  session.sessionTotal += 1;

  const correct = choiceIndex === session.question.correctIndex;

  if (correct) {
    session.sessionCorrect += 1;
    playKeySound(true);
    fireStars();
    speak('Bravo, c\'est ça !');
  } else {
    playKeySound(false);
    const correctAnswer = session.question.choices[session.question.correctIndex]!;
    speak(`Non, la bonne réponse était : ${correctAnswer}`);
  }

  // Update state first so achievements see the new counts
  updateState((s) => {
    s.quiz.questionsAnswered += 1;
    if (correct) s.quiz.correctAnswers += 1;
  });

  // Award points + check achievements
  if (correct) {
    const { newAchievements } = addPoints(2);
    for (const ach of newAchievements) {
      playAchievement();
      showNotification(ach.name, ach.icon);
    }
  }

  // Check session milestone (5 correct in a row → confetti)
  if (correct && session.sessionCorrect > 0 && session.sessionCorrect % 5 === 0) {
    fireConfetti();
    playAchievement();
  }

  renderQuestion(container);
}

function renderQuestion(container: HTMLElement): void {
  if (!session) return;

  const q = session.question;
  const answered = session.answered;
  const selected = session.selectedIndex;
  const correctIdx = q.correctIndex;

  // Render context with blank highlighted
  const contextHtml = q.context.replace('___', '<span class="quiz-blank">___</span>');

  // Build choice buttons
  const choicesHtml = q.choices.map((choice, i) => {
    let cls = 'quiz-choice';
    if (answered) {
      if (i === correctIdx) cls += ' quiz-choice-correct';
      else if (i === selected) cls += ' quiz-choice-wrong';
      else cls += ' quiz-choice-disabled';
    }
    return `<button class="${cls}" data-choice="${i}" ${answered ? 'disabled' : ''}>${choice}</button>`;
  }).join('');

  let feedbackHtml = '';
  if (answered) {
    const correct = selected === correctIdx;
    const pose = correct ? 'ecstatic' : 'unhappy';
    const title = correct ? 'Bravo !' : 'Oups...';
    const message = correct
      ? 'C\'est la bonne réponse !'
      : `La bonne réponse était : <strong>${q.choices[correctIdx]}</strong>`;
    const hintHtml = q.hint && !correct ? `<p class="quiz-hint">💡 ${q.hint}</p>` : '';

    feedbackHtml = `
      <div class="quiz-feedback ${correct ? 'feedback-ok' : 'feedback-ko'}">
        ${renderMascot(pose, 60)}
        <div class="quiz-feedback-text">
          <strong>${title}</strong>
          <p>${message}</p>
          ${hintHtml}
        </div>
      </div>
      <button class="btn btn-primary quiz-next-btn" id="btn-next-q">Question suivante →</button>
    `;
  }

  container.innerHTML = `
    <div class="quiz-page fade-in">
      <button class="back-btn" id="btn-back-q">← Changer de niveau</button>

      <div class="quiz-stats">
        <span class="quiz-level-badge">${session.level}</span>
        <span class="quiz-score">Score : ${session.sessionCorrect} / ${session.sessionTotal}</span>
      </div>

      <div class="quiz-context">${contextHtml}</div>

      <div class="quiz-choices">
        ${choicesHtml}
      </div>

      ${feedbackHtml}
    </div>
  `;

  document.getElementById('btn-back-q')?.addEventListener('click', () => {
    session = null;
    renderLevelSelect(container);
  });

  if (!answered) {
    container.querySelectorAll('.quiz-choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-choice') ?? '0', 10);
        answerQuestion(container, idx);
      });
    });
  }

  document.getElementById('btn-next-q')?.addEventListener('click', () => {
    if (session) startQuestion(container, session.level);
  });
}

export function renderQuiz(container: HTMLElement): (() => void) {
  session = null;
  renderLevelSelect(container);
  return () => {
    session = null;
  };
}
