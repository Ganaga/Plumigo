import { checkText, initSpellChecker, isReady } from './spell-bridge';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let currentErrors: Map<string, string[]> = new Map(); // word → suggestions
let onSuggestionClick: ((word: string, suggestions: string[]) => void) | null = null;

export function setOnSuggestionClick(cb: (word: string, suggestions: string[]) => void): void {
  onSuggestionClick = cb;
}

function getPlainText(el: HTMLElement): string {
  return el.innerText || el.textContent || '';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function decorateText(text: string, errors: Map<string, string[]>): string {
  if (errors.size === 0) return escapeHtml(text);

  // Split into words and whitespace, preserving structure
  const parts = text.split(/(\s+)/);
  return parts
    .map((part) => {
      if (/^\s+$/.test(part)) return part;
      const clean = part.replace(/[.,!?;:'"()\-]/g, '');
      if (errors.has(clean.toLowerCase())) {
        const suggestions = errors.get(clean.toLowerCase())!;
        return `<span class="spell-error" data-word="${escapeHtml(clean)}" data-suggestions="${escapeHtml(suggestions.join(','))}">${escapeHtml(part)}</span>`;
      }
      return escapeHtml(part);
    })
    .join('');
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

function runSpellCheck(editorEl: HTMLElement): void {
  const text = getPlainText(editorEl);
  if (!isReady() || text.trim().length === 0) return;

  checkText(text, (results) => {
    currentErrors.clear();

    for (const r of results) {
      if (!r.correct) {
        currentErrors.set(r.word.toLowerCase(), r.suggestions);
      }
    }

    // Re-render with decorations
    const cursorPos = saveSelection(editorEl);
    const decorated = decorateText(text, currentErrors);
    editorEl.innerHTML = decorated;
    restoreSelection(editorEl, cursorPos);

    // Attach click handlers to spell errors
    editorEl.querySelectorAll('.spell-error').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = (el as HTMLElement).dataset.word ?? '';
        const suggestions = ((el as HTMLElement).dataset.suggestions ?? '').split(',').filter(Boolean);
        if (onSuggestionClick) {
          onSuggestionClick(word, suggestions);
        }
      });
    });
  });
}

export function initEditor(editorEl: HTMLElement): void {
  editorEl.setAttribute('contenteditable', 'true');
  editorEl.setAttribute('spellcheck', 'false');

  initSpellChecker(() => {
    // Spell checker ready, run initial check
    runSpellCheck(editorEl);
  });

  editorEl.addEventListener('input', () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSpellCheck(editorEl), 500);
  });
}

export function getEditorText(editorEl: HTMLElement): string {
  return getPlainText(editorEl);
}

export function setEditorText(editorEl: HTMLElement, text: string): void {
  editorEl.innerText = text;
  runSpellCheck(editorEl);
}
