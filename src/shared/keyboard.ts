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
  onInput: (() => void) | null;
}

const state: KeyboardState = {
  mode: 'lower',
  target: null,
  containerEl: null,
  onInput: null,
};

function getRows(): string[][] {
  if (state.mode === 'upper') return ROWS_UPPER;
  if (state.mode === 'numbers') return ROWS_NUMBERS;
  return ROWS_LOWER;
}

function getKeyClass(key: string): string {
  if (key === 'ESPACE') return 'vk-key vk-space';
  if (key === 'SHIFT') return `vk-key vk-special ${state.mode === 'upper' ? 'vk-active' : ''}`;
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
    // contenteditable
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      state.target.textContent = (state.target.textContent || '') + text;
    }
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
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (!range.collapsed) {
        range.deleteContents();
      } else {
        // Delete one character backwards
        const node = range.startContainer;
        const offset = range.startOffset;
        if (node.nodeType === Node.TEXT_NODE && offset > 0) {
          (node as Text).deleteData(offset - 1, 1);
          range.setStart(node, offset - 1);
          range.collapse(true);
        }
      }
    }
    state.target.dispatchEvent(new Event('input', { bubbles: true }));
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
    // Auto-return to lowercase after space
    if (state.mode === 'upper') {
      state.mode = 'lower';
      render();
    }
    return;
  }

  insertText(key);

  // Auto-return to lowercase after typing one uppercase letter
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
      e.preventDefault(); // Prevent focus loss from target
      const key = (btn as HTMLElement).getAttribute('data-vk-key')!;
      btn.classList.add('vk-pressed');
      setTimeout(() => btn.classList.remove('vk-pressed'), 120);
      handleKey(key);
    });
  });
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
  if (targetEl instanceof HTMLInputElement) {
    targetEl.setAttribute('inputmode', 'none');
    targetEl.setAttribute('readonly', 'readonly');
    // Remove readonly after a tick so the cursor shows but keyboard doesn't
    setTimeout(() => {
      targetEl.removeAttribute('readonly');
      targetEl.setAttribute('inputmode', 'none');
    }, 50);
  } else {
    targetEl.setAttribute('inputmode', 'none');
  }

  state.target = targetEl;
  state.containerEl = containerEl;
  state.mode = 'lower';
  render();

  return () => {
    state.target = null;
    if (state.containerEl) {
      state.containerEl.innerHTML = '';
      state.containerEl = null;
    }
  };
}
