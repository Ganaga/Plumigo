import { checkGrammarImmediate, type GrammarError } from './grammar-checker';
import { renderMascot } from '../../shared/mascot';
import { addPoints } from '../../shared/gamification';
import { updateState } from '../../shared/storage';
import { fireStars, showNotification } from '../../shared/animations';
import { playKeySound, playAchievement } from '../../shared/audio';
import { isTtsEnabled, speakSpellingError, speakGrammarError } from '../../shared/tts';
import './sentence-mode.css';

interface SentenceModeState {
  completedSentences: string[];
  currentText: string;
  checking: boolean;
  errors: GrammarError[];
  errorIndex: number;
}

export function renderSentenceMode(
  container: HTMLElement,
  _storyId: string,
  initialContent: string,
  onContentChange: (fullText: string) => void,
  onExit: () => void,
): () => void {
  const state: SentenceModeState = {
    completedSentences: initialContent
      ? initialContent.split('\n').filter((s) => s.trim().length > 0)
      : [],
    currentText: '',
    checking: false,
    errors: [],
    errorIndex: 0,
  };

  function getFullText(): string {
    const parts = [...state.completedSentences];
    if (state.currentText.trim()) parts.push(state.currentText.trim());
    return parts.join('\n');
  }

  function render(): void {
    const completedHtml = state.completedSentences
      .map((s) => `<div class="sentence-completed">✓ ${s}</div>`)
      .join('');

    const errorHtml = state.errors.length > 0
      ? `<div class="sentence-error-msg">
          ${renderMascot('unhappy', 36)}
          <span>${state.errors[state.errorIndex]?.message ?? ''}</span>
        </div>`
      : '';

    container.innerHTML = `
      <div class="sentence-mode fade-in">
        <div class="sentence-mode-header">
          <button class="back-btn" id="btn-exit-sentence">← Mode libre</button>
          <h2>Mode phrase par phrase</h2>
          <p class="sentence-mode-hint">Écris une phrase, puis clique sur Valider. Si elle est correcte, elle sera verrouillée !</p>
        </div>

        <div class="sentence-completed-list" id="completed-list">
          ${completedHtml || '<p class="sentence-empty">Aucune phrase validée pour l\'instant</p>'}
        </div>

        <div class="sentence-active-area">
          <div class="sentence-input" id="sentence-input" contenteditable="true" data-placeholder="Écris ta phrase ici...">${escapeHtml(state.currentText)}</div>
          ${errorHtml}
          <div class="sentence-actions">
            <button class="btn btn-primary" id="btn-validate" ${state.checking ? 'disabled' : ''}>
              ${state.checking ? '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>' : '✓ Valider'}
            </button>
            <span class="sentence-count">${state.completedSentences.length} phrase${state.completedSentences.length !== 1 ? 's' : ''} validée${state.completedSentences.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    `;

    // Events
    document.getElementById('btn-exit-sentence')?.addEventListener('click', () => {
      onContentChange(getFullText());
      onExit();
    });

    const inputEl = document.getElementById('sentence-input')!;
    inputEl.addEventListener('input', () => {
      state.currentText = inputEl.innerText || '';
      state.errors = [];
      state.errorIndex = 0;
    });

    // Prevent Enter from adding line breaks — use it to validate
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-validate')?.click();
      }
    });

    document.getElementById('btn-validate')?.addEventListener('click', async () => {
      const text = (inputEl.innerText || '').trim();
      if (text.length < 2 || state.checking) return;

      state.checking = true;
      render();

      try {
        const errors = await checkGrammarImmediate(text);

        if (errors.length === 0) {
          // Perfect! Lock the sentence
          state.completedSentences.push(text);
          state.currentText = '';
          state.errors = [];
          state.errorIndex = 0;

          // Rewards
          playKeySound(true);
          fireStars();
          updateState((s) => { s.writing.sentencesValidated += 1; });
          const { newAchievements } = addPoints(3);
          for (const ach of newAchievements) {
            playAchievement();
            showNotification(ach.name, ach.icon);
          }

          onContentChange(getFullText());
        } else {
          // Show first error
          state.errors = errors;
          state.errorIndex = 0;

          // TTS feedback
          if (isTtsEnabled()) {
            const err = errors[0]!;
            if (err.isGrammar) {
              speakGrammarError(err.message);
            } else {
              const word = text.slice(err.offset, err.offset + err.length);
              speakSpellingError(word, err.replacements[0]);
            }
          }
        }
      } catch {
        // API error, let user retry
      }

      state.checking = false;
      render();

      // Re-focus input
      setTimeout(() => {
        document.getElementById('sentence-input')?.focus();
      }, 50);
    });

    // Focus input
    setTimeout(() => inputEl.focus(), 50);
  }

  render();

  return () => {
    onContentChange(getFullText());
  };
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
