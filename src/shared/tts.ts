const TTS_KEY = 'plumigo_tts_enabled';

let frenchVoice: SpeechSynthesisVoice | null = null;

// Keywords that indicate higher-quality voices (neural/natural)
const PREFERRED_KEYWORDS = [
  'natural', 'neural', 'wavenet', 'enhanced', 'premium',
  'denise', 'henri', 'vivienne', 'thomas', 'lea',
];

// Lower quality voice indicators
const AVOID_KEYWORDS = ['compact', 'espeak', 'mbrola'];

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;

  // Prefer fr-FR over other French variants
  if (voice.lang === 'fr-FR') score += 10;
  else if (voice.lang.startsWith('fr')) score += 5;

  // Prefer voices with quality keywords
  for (const kw of PREFERRED_KEYWORDS) {
    if (name.includes(kw)) { score += 20; break; }
  }

  // Penalize low-quality voices
  for (const kw of AVOID_KEYWORDS) {
    if (name.includes(kw)) { score -= 30; break; }
  }

  // Prefer non-local voices (Google/Microsoft online voices are usually better)
  if (!voice.localService) score += 5;

  // Prefer female voices (generally clearer for children)
  if (name.includes('female') || name.includes('femme')) score += 2;

  return score;
}

function findFrenchVoice(): void {
  if (typeof speechSynthesis === 'undefined') return;
  const voices = speechSynthesis.getVoices();
  const french = voices.filter((v) => v.lang.startsWith('fr'));

  if (french.length === 0) {
    frenchVoice = null;
    return;
  }

  // Pick the best-scoring French voice
  french.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  frenchVoice = french[0]!;
}

// Voices load asynchronously on most browsers
if (typeof speechSynthesis !== 'undefined') {
  findFrenchVoice();
  speechSynthesis.addEventListener('voiceschanged', findFrenchVoice);
}

export function isTtsEnabled(): boolean {
  return localStorage.getItem(TTS_KEY) !== 'false';
}

export function toggleTts(): boolean {
  const newState = !isTtsEnabled();
  localStorage.setItem(TTS_KEY, String(newState));
  if (!newState && typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  return newState;
}

export function speak(text: string): void {
  if (!isTtsEnabled()) return;
  if (typeof speechSynthesis === 'undefined') return;

  if (!frenchVoice) findFrenchVoice();

  speechSynthesis.cancel();

  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }
    // Slightly slower and natural-sounding settings
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  }, 50);
}

export function speakSpellingError(word: string, suggestion: string | undefined): void {
  if (suggestion) {
    speak(`Le mot ${word} est mal écrit. Essaie ${suggestion}.`);
  } else {
    speak(`Le mot ${word} semble mal écrit.`);
  }
}

export function speakGrammarError(message: string): void {
  speak(message);
}

export function hasTtsSupport(): boolean {
  return typeof speechSynthesis !== 'undefined';
}
