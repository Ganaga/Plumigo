import { getState } from './storage';

export function isBuiltInKeyboardEnabled(): boolean {
  return getState().profile.useBuiltInKeyboard;
}

const ROWS_LOWER = [
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
  ['SHIFT', 'w', 'x', 'c', 'v', 'b', 'n', ',', '.', 'BACK'],
  ['123', 'ESPACE', 'ENTER'],
];

const ROWS_UPPER = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['SHIFT', 'W', 'X', 'C', 'V', 'B', 'N', '!', '?', 'BACK'],
  ['123', 'ESPACE', 'ENTER'],
];

const ROWS_NUMBERS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ô', 'î'],
  ['ABC', 'ç', 'æ', 'œ', '-', "'", '(', ')', ';', 'BACK'],
  ['ABC', 'ESPACE', 'ENTER'],
];

type KeyboardMode = 'lower' | 'upper' | 'numbers';

interface KeyboardState {
  mode: KeyboardMode;
  target: HTMLElement | HTMLInputElement | null;
  containerEl: HTMLElement | null;
  // For contenteditable: track cursor as character offset in plain text
  cursorPos: number;
}

const state: KeyboardState = {
  mode: 'lower',
  target: null,
  containerEl: null,
  cursorPos: 0,
};

function getRows(): string[][] {
  if (state.mode === 'upper') return ROWS_UPPER;
  if (state.mode === 'numbers') return ROWS_NUMBERS;
  return ROWS_LOWER;
}

function getKeyClass(key: string): string {
  if (key === 'ESPACE') return 'vk-key vk-space';
  if (key === 'SHIFT') return `vk-key vk-special ${state.mode === 'upper' ? 'vk-key vk-active' : ''}`;
  if (key === 'BACK') return 'vk-key vk-special';
  if (key === 'ENTER') return 'vk-key vk-special vk-enter';
  if (key === '123' || key === 'ABC') return 'vk-key vk-special';
  return 'vk-key';
}

function getKeyLabel(key: string): string {
  if (key === 'ESPACE') return 'espace';
  if (key === 'SHIFT') return '⇧';
  if (key === 'BACK') return '⌫';
  if (key === 'ENTER') return '↵';
  return key;
}

function getPlainText(el: HTMLElement): string {
  return el.innerText || el.textContent || '';
}

function setCursorInContentEditable(el: HTMLElement, pos: number): void {
  const sel = window.getSelection();
  if (!sel) return;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const len = node.length;
    if (currentOffset + len >= pos) {
      const range = document.createRange();
      range.setStart(node, Math.min(pos - currentOffset, len));
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    currentOffset += len;
  }

  // If pos is beyond text, place at end
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function insertText(text: string): void {
  if (!state.target) return;

  if (state.target instanceof HTMLInputElement) {
    const input = state.target;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    const newPos = start + text.length;
    input.setSelectionRange(newPos, newPos);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    // contenteditable — use plain text manipulation
    const plainText = getPlainText(state.target);
    const pos = state.cursorPos;
    const newText = plainText.slice(0, pos) + text + plainText.slice(pos);
    state.target.innerText = newText;
    state.cursorPos = pos + text.length;
    setCursorInContentEditable(state.target, state.cursorPos);
    state.target.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function handleBackspace(): void {
  if (!state.target) return;

  if (state.target instanceof HTMLInputElement) {
    const input = state.target;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    if (start !== end) {
      input.value = input.value.slice(0, start) + input.value.slice(end);
      input.setSelectionRange(start, start);
    } else if (start > 0) {
      input.value = input.value.slice(0, start - 1) + input.value.slice(start);
      input.setSelectionRange(start - 1, start - 1);
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    // contenteditable — plain text manipulation
    const plainText = getPlainText(state.target);
    const pos = state.cursorPos;
    if (pos > 0) {
      const newText = plainText.slice(0, pos - 1) + plainText.slice(pos);
      state.target.innerText = newText;
      state.cursorPos = pos - 1;
      setCursorInContentEditable(state.target, state.cursorPos);
      state.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

function handleKey(key: string): void {
  if (key === 'SHIFT') {
    state.mode = state.mode === 'upper' ? 'lower' : 'upper';
    render();
    return;
  }
  if (key === '123') {
    state.mode = 'numbers';
    render();
    return;
  }
  if (key === 'ABC') {
    state.mode = 'lower';
    render();
    return;
  }
  if (key === 'BACK') {
    handleBackspace();
    return;
  }
  if (key === 'ENTER') {
    insertText('\n');
    return;
  }
  if (key === 'ESPACE') {
    insertText(' ');
    if (state.mode === 'upper') {
      state.mode = 'lower';
      render();
    }
    return;
  }

  insertText(key);

  if (state.mode === 'upper') {
    state.mode = 'lower';
    render();
  }
}

function render(): void {
  if (!state.containerEl) return;

  const rows = getRows();
  state.containerEl.innerHTML = `
    <div class="vk-keyboard">
      ${rows.map((row) => `
        <div class="vk-row">
          ${row.map((key) => `
            <button class="${getKeyClass(key)}" data-vk-key="${key}" type="button">${getKeyLabel(key)}</button>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;

  state.containerEl.querySelectorAll('[data-vk-key]').forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const key = (btn as HTMLElement).getAttribute('data-vk-key')!;
      btn.classList.add('vk-pressed');
      setTimeout(() => btn.classList.remove('vk-pressed'), 120);
      handleKey(key);
    });
  });
}

// Track cursor position when user taps in the contenteditable
function trackCursorFromTap(el: HTMLElement): () => void {
  const handler = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const preRange = document.createRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.startContainer, range.startOffset);
    state.cursorPos = preRange.toString().length;
  };

  el.addEventListener('pointerup', handler);
  el.addEventListener('keyup', handler);
  return () => {
    el.removeEventListener('pointerup', handler);
    el.removeEventListener('keyup', handler);
  };
}

export function attachKeyboard(
  targetEl: HTMLElement | HTMLInputElement,
  containerEl: HTMLElement,
): () => void {
  if (!isBuiltInKeyboardEnabled()) {
    containerEl.innerHTML = '';
    return () => {};
  }

  // Prevent native keyboard on mobile
  targetEl.setAttribute('inputmode', 'none');

  // Set initial cursor position at end
  if (targetEl instanceof HTMLInputElement) {
    state.cursorPos = targetEl.value.length;
  } else {
    state.cursorPos = getPlainText(targetEl).length;
  }

  state.target = targetEl;
  state.containerEl = containerEl;
  state.mode = 'lower';
  render();

  // Track taps on contenteditable to update cursor position
  let cleanupTracker = () => {};
  if (!(targetEl instanceof HTMLInputElement)) {
    cleanupTracker = trackCursorFromTap(targetEl);
  }

  return () => {
    state.target = null;
    if (state.containerEl) {
      state.containerEl.innerHTML = '';
      state.containerEl = null;
    }
    cleanupTracker();
    targetEl.removeAttribute('inputmode');
  };
}
