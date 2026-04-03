const API_URL = 'https://api.languagetool.org/v2/check';

export interface GrammarError {
  offset: number;
  length: number;
  message: string;
  shortMessage: string;
  replacements: string[];
  isGrammar: boolean; // true = grammar, false = spelling
  ruleId: string;
}

interface LTMatch {
  offset: number;
  length: number;
  message: string;
  shortMessage: string;
  replacements: { value: string }[];
  rule: {
    id: string;
    category: { id: string };
  };
}

interface LTResponse {
  matches: LTMatch[];
}

const SPELLING_CATEGORIES = new Set([
  'TYPOS',
  'SPELLING',
  'CASING',
]);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastCheckedText = '';

export function checkGrammar(
  text: string,
  callback: (errors: GrammarError[]) => void,
  onError?: (err: string) => void,
): void {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const trimmed = text.trim();
    if (trimmed.length < 2) {
      callback([]);
      return;
    }

    if (trimmed === lastCheckedText) return;
    lastCheckedText = trimmed;

    try {
      const body = new URLSearchParams({
        text: trimmed,
        language: 'fr',
        disabledRules: 'WHITESPACE_RULE',
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`LanguageTool API error: ${response.status}`);
      }

      const data: LTResponse = await response.json();

      const errors: GrammarError[] = data.matches.map((match) => ({
        offset: match.offset,
        length: match.length,
        message: match.message,
        shortMessage: match.shortMessage || match.message,
        replacements: match.replacements.slice(0, 5).map((r) => r.value),
        isGrammar: !SPELLING_CATEGORIES.has(match.rule.category.id),
        ruleId: match.rule.id,
      }));

      callback(errors);
    } catch (err) {
      if (onError) onError(String(err));
    }
  }, 800);
}

export async function checkGrammarImmediate(text: string): Promise<GrammarError[]> {
  const trimmed = text.trim();
  if (trimmed.length < 2) return [];

  const body = new URLSearchParams({
    text: trimmed,
    language: 'fr',
    disabledRules: 'WHITESPACE_RULE',
  });

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) throw new Error(`LanguageTool API error: ${response.status}`);

  const data: LTResponse = await response.json();

  return data.matches.map((match) => ({
    offset: match.offset,
    length: match.length,
    message: match.message,
    shortMessage: match.shortMessage || match.message,
    replacements: match.replacements.slice(0, 5).map((r) => r.value),
    isGrammar: !SPELLING_CATEGORIES.has(match.rule.category.id),
    ruleId: match.rule.id,
  }));
}

export function cancelCheck(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}
