import { checkGrammar, cancelCheck, type GrammarError } from './grammar-checker';
import { speakSpellingError, speakGrammarError, isTtsEnabled } from '../../shared/tts';

let currentErrors: GrammarError[] = [];
let onErrorClick: ((error: GrammarError, rect: DOMRect) => void) | null = null;
let onErrorsUpdated: ((errors: GrammarError[]) => void) | null = null;
let oneAtATimeMode = true;

export function setOneAtATimeMode(enabled: boolean): void {
  oneAtATimeMode = enabled;
}

export function isOneAtATimeMode(): boolean {
  return oneAtATimeMode;
}

// Undo/redo history
let undoStack: string[] = [];
let redoStack: string[] = [];
let lastSnapshot = '';
let snapshotTimer: ReturnType<typeof setTimeout> | null = null;

export function setOnErrorClick(cb: (error: GrammarError, rect: DOMRect) => void): void {
  onErrorClick = cb;
}

export function setOnErrorsUpdated(cb: (errors: GrammarError[]) => void): void {
  onErrorsUpdated = cb;
}

function getPlainText(el: HTMLElement): string {
  return el.innerText || el.textContent || '';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildDecoratedHtml(text: string, errors: GrammarError[]): string {
  if (errors.length === 0) return escapeHtml(text);

  // Sort by offset ascending
  const sorted = [...errors]
    .map((e, i) => ({ ...e, originalIdx: i }))
    .sort((a, b) => a.offset - b.offset);

  // In one-at-a-time mode, only show the first error
  const visible = oneAtATimeMode ? sorted.slice(0, 1) : sorted;

  let result = '';
  let lastEnd = 0;

  for (const err of visible) {
    if (err.offset > lastEnd) {
      result += escapeHtml(text.slice(lastEnd, err.offset));
    }
    const match = text.slice(err.offset, err.offset + err.length);
    const cls = err.isGrammar ? 'grammar-error' : 'spell-error';
    result += `<span class="${cls}" data-error-idx="${err.originalIdx}">${escapeHtml(match)}</span>`;
    lastEnd = err.offset + err.length;
  }

  // Add remaining text
  if (lastEnd < text.length) {
    result += escapeHtml(text.slice(lastEnd));
  }

  return result;
}

function saveSelection(el: HTMLElement): number {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;

  const range = selection.getRangeAt(0);
  const preRange = document.createRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.startContainer, range.startOffset);
  return preRange.toString().length;
}

function restoreSelection(el: HTMLElement, offset: number): void {
  const selection = window.getSelection();
  if (!selection) return;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const nodeLength = node.length;

    if (currentOffset + nodeLength >= offset) {
      const range = document.createRange();
      range.setStart(node, offset - currentOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    currentOffset += nodeLength;
  }
}

function applyDecorations(editorEl: HTMLElement): void {
  const text = getPlainText(editorEl);
  const cursorPos = saveSelection(editorEl);
  const html = buildDecoratedHtml(text, currentErrors);
  editorEl.innerHTML = html;
  restoreSelection(editorEl, cursorPos);

  // Attach click handlers
  editorEl.querySelectorAll('[data-error-idx]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt((el as HTMLElement).dataset.errorIdx ?? '0', 10);
      const error = currentErrors[idx];
      if (error && onErrorClick) {
        const rect = el.getBoundingClientRect();
        onErrorClick(error, rect);

        // TTS feedback
        if (isTtsEnabled()) {
          if (error.isGrammar) {
            speakGrammarError(error.message);
          } else {
            const word = text.slice(error.offset, error.offset + error.length);
            speakSpellingError(word, error.replacements[0]);
          }
        }
      }
    });
  });
}

function runGrammarCheck(editorEl: HTMLElement): void {
  const text = getPlainText(editorEl);
  if (text.trim().length < 2) {
    currentErrors = [];
    if (onErrorsUpdated) onErrorsUpdated([]);
    return;
  }

  checkGrammar(text, (errors) => {
    currentErrors = errors;
    applyDecorations(editorEl);
    if (onErrorsUpdated) onErrorsUpdated(errors);
  });
}

function pushSnapshot(text: string): void {
  if (text === lastSnapshot) return;
  undoStack.push(lastSnapshot);
  lastSnapshot = text;
  redoStack = [];
  // Keep history manageable
  if (undoStack.length > 100) undoStack.shift();
}

function scheduleSnapshot(editorEl: HTMLElement): void {
  if (snapshotTimer) clearTimeout(snapshotTimer);
  snapshotTimer = setTimeout(() => {
    pushSnapshot(getPlainText(editorEl));
  }, 500);
}

export function undo(editorEl: HTMLElement): void {
  // Save current state to redo
  const current = getPlainText(editorEl);
  if (undoStack.length === 0) return;
  redoStack.push(current);
  const prev = undoStack.pop()!;
  lastSnapshot = prev;
  editorEl.innerText = prev;
  applyDecorations(editorEl);
  runGrammarCheck(editorEl);
}

export function redo(editorEl: HTMLElement): void {
  if (redoStack.length === 0) return;
  undoStack.push(getPlainText(editorEl));
  const next = redoStack.pop()!;
  lastSnapshot = next;
  editorEl.innerText = next;
  applyDecorations(editorEl);
  runGrammarCheck(editorEl);
}

export function canUndo(): boolean {
  return undoStack.length > 0;
}

export function canRedo(): boolean {
  return redoStack.length > 0;
}

export function initEditor(editorEl: HTMLElement): void {
  editorEl.setAttribute('contenteditable', 'true');
  editorEl.setAttribute('spellcheck', 'false');

  // Init undo history with initial content
  lastSnapshot = getPlainText(editorEl);
  undoStack = [];
  redoStack = [];

  editorEl.addEventListener('input', () => {
    scheduleSnapshot(editorEl);
    runGrammarCheck(editorEl);
  });

  // Keyboard shortcuts for undo/redo
  editorEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo(editorEl);
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      redo(editorEl);
    }
  });
}

export function triggerCheck(editorEl: HTMLElement): void {
  runGrammarCheck(editorEl);
}

export function getEditorText(editorEl: HTMLElement): string {
  return getPlainText(editorEl);
}

export function setEditorText(editorEl: HTMLElement, text: string): void {
  editorEl.innerText = text;
  runGrammarCheck(editorEl);
}

export function replaceError(editorEl: HTMLElement, error: GrammarError, replacement: string): void {
  pushSnapshot(getPlainText(editorEl));
  const text = getPlainText(editorEl);
  const before = text.slice(0, error.offset);
  const after = text.slice(error.offset + error.length);
  const newText = before + replacement + after;

  // Remove this error and adjust offsets
  const diff = replacement.length - error.length;
  currentErrors = currentErrors
    .filter((e) => e !== error)
    .map((e) => {
      if (e.offset > error.offset) {
        return { ...e, offset: e.offset + diff };
      }
      return e;
    });

  editorEl.innerText = newText;
  applyDecorations(editorEl);
  restoreSelection(editorEl, error.offset + replacement.length);
}

export function getCurrentErrors(): GrammarError[] {
  return currentErrors;
}

export function cleanupEditor(): void {
  cancelCheck();
  currentErrors = [];
  onErrorClick = null;
  onErrorsUpdated = null;
  undoStack = [];
  redoStack = [];
  lastSnapshot = '';
  if (snapshotTimer) clearTimeout(snapshotTimer);
}
