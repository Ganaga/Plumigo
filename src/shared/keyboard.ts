import { LitElement, html, css } from 'lit';
import { customElement, property, state as litState } from 'lit/decorators.js';
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

@customElement('plumigo-keyboard')
export class PlumigoKeyboard extends LitElement {
  @property({ type: Object }) target: HTMLElement | HTMLInputElement | null = null;
  @property({ type: Boolean }) active = false;

  @litState() private mode: KeyboardMode = 'lower';
  private cursorPos = 0;
  private cleanupTracker: (() => void) | null = null;

  static styles = css`
    :host {
      display: block;
    }

    :host(:not([active])) .keyboard {
      display: none;
    }

    .keyboard {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--bg);
      border-top: 2px solid var(--border);
      padding: 0.4rem 0.3rem 0.6rem;
      z-index: 900;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    }

    .row {
      display: flex;
      justify-content: center;
      gap: 0.25rem;
    }

    .key {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 42px;
      padding: 0 0.4rem;
      border: none;
      border-radius: 6px;
      background: var(--surface);
      color: var(--text);
      font-size: 1rem;
      font-family: inherit;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: background 0.08s;
      flex: 1;
      max-width: 42px;
    }

    .key:active, .key.pressed {
      background: var(--primary-light);
      color: white;
    }

    .special {
      background: var(--border);
      font-size: 0.85rem;
      flex: 1.3;
      max-width: 56px;
    }

    .shift-active {
      background: var(--primary);
      color: white;
    }

    .space {
      flex: 5;
      max-width: none;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .enter {
      flex: 1.5;
      max-width: 60px;
    }
  `;

  private getPlainText(el: HTMLElement): string {
    return el.innerText || el.textContent || '';
  }

  private setCursor(el: HTMLElement, pos: number): void {
    const sel = window.getSelection();
    if (!sel) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let offset = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const len = node.length;
      if (offset + len >= pos) {
        const range = document.createRange();
        range.setStart(node, Math.min(pos - offset, len));
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
      offset += len;
    }
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  private insertText(text: string): void {
    if (!this.target) return;
    if (this.target instanceof HTMLInputElement) {
      const input = this.target;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      input.value = input.value.slice(0, start) + text + input.value.slice(end);
      const newPos = start + text.length;
      input.setSelectionRange(newPos, newPos);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      const plain = this.getPlainText(this.target);
      const pos = this.cursorPos;
      this.target.innerText = plain.slice(0, pos) + text + plain.slice(pos);
      this.cursorPos = pos + text.length;
      this.setCursor(this.target, this.cursorPos);
      this.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  private handleBackspace(): void {
    if (!this.target) return;
    if (this.target instanceof HTMLInputElement) {
      const input = this.target;
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
      const plain = this.getPlainText(this.target);
      const pos = this.cursorPos;
      if (pos > 0) {
        this.target.innerText = plain.slice(0, pos - 1) + plain.slice(pos);
        this.cursorPos = pos - 1;
        this.setCursor(this.target, this.cursorPos);
        this.target.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  private handleKey(key: string): void {
    if (key === 'SHIFT') { this.mode = this.mode === 'upper' ? 'lower' : 'upper'; return; }
    if (key === '123') { this.mode = 'numbers'; return; }
    if (key === 'ABC') { this.mode = 'lower'; return; }
    if (key === 'BACK') { this.handleBackspace(); return; }
    if (key === 'ENTER') { this.insertText('\n'); return; }
    if (key === 'ESPACE') {
      this.insertText(' ');
      if (this.mode === 'upper') this.mode = 'lower';
      return;
    }
    this.insertText(key);
    if (this.mode === 'upper') this.mode = 'lower';
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('target') || changed.has('active')) {
      this.cleanupTracker?.();
      this.cleanupTracker = null;

      if (this.active && this.target) {
        this.target.setAttribute('inputmode', 'none');
        document.body.classList.add('vk-active');

        if (this.target instanceof HTMLInputElement) {
          this.cursorPos = this.target.value.length;
        } else {
          this.cursorPos = this.getPlainText(this.target).length;
          const handler = () => {
            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0 || !this.target) return;
            const range = sel.getRangeAt(0);
            const pre = document.createRange();
            pre.selectNodeContents(this.target);
            pre.setEnd(range.startContainer, range.startOffset);
            this.cursorPos = pre.toString().length;
          };
          this.target.addEventListener('pointerup', handler);
          this.target.addEventListener('keyup', handler);
          this.cleanupTracker = () => {
            this.target?.removeEventListener('pointerup', handler);
            this.target?.removeEventListener('keyup', handler);
          };
        }
      } else {
        document.body.classList.remove('vk-active');
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupTracker?.();
    document.body.classList.remove('vk-active');
  }

  private getRows(): string[][] {
    if (this.mode === 'upper') return ROWS_UPPER;
    if (this.mode === 'numbers') return ROWS_NUMBERS;
    return ROWS_LOWER;
  }

  private keyClass(key: string): string {
    if (key === 'ESPACE') return 'key space';
    if (key === 'SHIFT') return `key special ${this.mode === 'upper' ? 'shift-active' : ''}`;
    if (key === 'BACK') return 'key special';
    if (key === 'ENTER') return 'key special enter';
    if (key === '123' || key === 'ABC') return 'key special';
    return 'key';
  }

  private keyLabel(key: string): string {
    if (key === 'ESPACE') return 'espace';
    if (key === 'SHIFT') return '⇧';
    if (key === 'BACK') return '⌫';
    if (key === 'ENTER') return '↵';
    return key;
  }

  render() {
    const rows = this.getRows();
    return html`
      <div class="keyboard">
        ${rows.map((row) => html`
          <div class="row">
            ${row.map((key) => html`
              <button class="${this.keyClass(key)}"
                      type="button"
                      @pointerdown=${(e: Event) => { e.preventDefault(); this.handleKey(key); }}>
                ${this.keyLabel(key)}
              </button>
            `)}
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'plumigo-keyboard': PlumigoKeyboard;
  }
}
