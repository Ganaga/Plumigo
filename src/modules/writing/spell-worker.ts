/// <reference lib="webworker" />

import nspell from 'nspell';

let spellChecker: ReturnType<typeof nspell> | null = null;
let loading = false;

async function loadDictionary(): Promise<void> {
  if (spellChecker || loading) return;
  loading = true;

  try {
    const base = self.location.href.replace(/\/[^/]*$/, '');
    // Navigate up from assets to find dictionaries
    const dictionaryBase = base.replace(/\/assets\/?$/, '') + '/dictionaries';

    const [affResponse, dicResponse] = await Promise.all([
      fetch(`${dictionaryBase}/fr.aff`),
      fetch(`${dictionaryBase}/fr.dic`),
    ]);

    const aff = await affResponse.text();
    const dic = await dicResponse.text();

    spellChecker = nspell(aff, dic);
    self.postMessage({ type: 'ready' });
  } catch (err) {
    self.postMessage({ type: 'error', message: String(err) });
  } finally {
    loading = false;
  }
}

function checkWords(words: string[]): { word: string; correct: boolean; suggestions: string[] }[] {
  if (!spellChecker) return words.map((w) => ({ word: w, correct: true, suggestions: [] }));

  return words.map((word) => {
    // Skip short words, numbers, and punctuation
    const clean = word.replace(/[.,!?;:'"()\-]/g, '');
    if (clean.length <= 1 || /^\d+$/.test(clean)) {
      return { word, correct: true, suggestions: [] };
    }

    const correct = spellChecker!.correct(clean);
    const suggestions = correct ? [] : spellChecker!.suggest(clean).slice(0, 5);
    return { word, correct, suggestions };
  });
}

self.addEventListener('message', async (e: MessageEvent) => {
  const { type, words, id } = e.data;

  if (type === 'init') {
    await loadDictionary();
  } else if (type === 'check') {
    if (!spellChecker) {
      await loadDictionary();
    }
    const results = checkWords(words);
    self.postMessage({ type: 'results', results, id });
  }
});
