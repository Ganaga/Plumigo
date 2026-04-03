// AZERTY keyboard layout with finger assignments
interface KeyDef {
  label: string;
  code: string;       // the character it produces (lowercase)
  finger: string;     // CSS class for finger color
  width?: string;     // CSS class for key width
}

const ROW_1: KeyDef[] = [
  { label: '&', code: '&', finger: 'finger-pinky-l' },
  { label: 'é', code: 'é', finger: 'finger-pinky-l' },
  { label: '"', code: '"', finger: 'finger-ring-l' },
  { label: "'", code: "'", finger: 'finger-middle-l' },
  { label: '(', code: '(', finger: 'finger-index-l' },
  { label: '-', code: '-', finger: 'finger-index-l' },
  { label: 'è', code: 'è', finger: 'finger-index-r' },
  { label: '_', code: '_', finger: 'finger-index-r' },
  { label: 'ç', code: 'ç', finger: 'finger-middle-r' },
  { label: 'à', code: 'à', finger: 'finger-ring-r' },
  { label: ')', code: ')', finger: 'finger-pinky-r' },
];

const ROW_2: KeyDef[] = [
  { label: 'A', code: 'a', finger: 'finger-pinky-l' },
  { label: 'Z', code: 'z', finger: 'finger-ring-l' },
  { label: 'E', code: 'e', finger: 'finger-middle-l' },
  { label: 'R', code: 'r', finger: 'finger-index-l' },
  { label: 'T', code: 't', finger: 'finger-index-l' },
  { label: 'Y', code: 'y', finger: 'finger-index-r' },
  { label: 'U', code: 'u', finger: 'finger-index-r' },
  { label: 'I', code: 'i', finger: 'finger-middle-r' },
  { label: 'O', code: 'o', finger: 'finger-ring-r' },
  { label: 'P', code: 'p', finger: 'finger-pinky-r' },
];

const ROW_3: KeyDef[] = [
  { label: 'Q', code: 'q', finger: 'finger-pinky-l' },
  { label: 'S', code: 's', finger: 'finger-ring-l' },
  { label: 'D', code: 'd', finger: 'finger-middle-l' },
  { label: 'F', code: 'f', finger: 'finger-index-l' },
  { label: 'G', code: 'g', finger: 'finger-index-l' },
  { label: 'H', code: 'h', finger: 'finger-index-r' },
  { label: 'J', code: 'j', finger: 'finger-index-r' },
  { label: 'K', code: 'k', finger: 'finger-middle-r' },
  { label: 'L', code: 'l', finger: 'finger-ring-r' },
  { label: 'M', code: 'm', finger: 'finger-pinky-r' },
];

const ROW_4: KeyDef[] = [
  { label: 'W', code: 'w', finger: 'finger-pinky-l' },
  { label: 'X', code: 'x', finger: 'finger-ring-l' },
  { label: 'C', code: 'c', finger: 'finger-middle-l' },
  { label: 'V', code: 'v', finger: 'finger-index-l' },
  { label: 'B', code: 'b', finger: 'finger-index-l' },
  { label: 'N', code: 'n', finger: 'finger-index-r' },
  { label: ',', code: ',', finger: 'finger-middle-r' },
  { label: '.', code: '.', finger: 'finger-ring-r' },
  { label: '!', code: '!', finger: 'finger-pinky-r' },
];

const ALL_ROWS = [ROW_1, ROW_2, ROW_3, ROW_4];

// Map from character → key code for highlighting
const charToCode = new Map<string, string>();
for (const row of ALL_ROWS) {
  for (const key of row) {
    charToCode.set(key.code, key.code);
    charToCode.set(key.label.toLowerCase(), key.code);
  }
}
charToCode.set(' ', ' ');

function renderRow(keys: KeyDef[]): string {
  return keys
    .map((k) => `<div class="key ${k.finger} ${k.width ?? ''}" data-code="${k.code}">${k.label}</div>`)
    .join('');
}

export function renderKeyboard(): string {
  return `
    <div class="keyboard">
      <div class="keyboard-row">${renderRow(ROW_1)}</div>
      <div class="keyboard-row">${renderRow(ROW_2)}</div>
      <div class="keyboard-row">${renderRow(ROW_3)}</div>
      <div class="keyboard-row">${renderRow(ROW_4)}</div>
      <div class="keyboard-row">
        <div class="key key-space finger-index-r" data-code=" ">Espace</div>
      </div>
    </div>
  `;
}

export function highlightKey(char: string): void {
  // Remove previous highlights
  document.querySelectorAll('.key-highlight').forEach((el) => el.classList.remove('key-highlight'));

  const code = charToCode.get(char.toLowerCase());
  if (code) {
    const keyEl = document.querySelector(`.key[data-code="${CSS.escape(code)}"]`);
    if (keyEl) {
      keyEl.classList.add('key-highlight');
    }
  }
}

export function pressKey(char: string): void {
  const code = charToCode.get(char.toLowerCase());
  if (code) {
    const keyEl = document.querySelector(`.key[data-code="${CSS.escape(code)}"]`);
    if (keyEl) {
      keyEl.classList.add('key-pressed');
      setTimeout(() => keyEl.classList.remove('key-pressed'), 150);
    }
  }
}
