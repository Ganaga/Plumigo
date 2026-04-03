export type WordStatus = 'correct' | 'incorrect' | 'pending' | 'typing';

export interface ComparisonResult {
  expected: string;
  typed: string;
  status: WordStatus;
}

export function compareWords(expected: string, typed: string): ComparisonResult[] {
  const expectedWords = expected.trim().split(/\s+/);
  const typedWords = typed.trim().split(/\s+/).filter((w) => w.length > 0);
  const typedEndsWithSpace = typed.endsWith(' ');

  return expectedWords.map((exp, i) => {
    if (i >= typedWords.length) {
      return { expected: exp, typed: '', status: 'pending' as const };
    }
    const tw = typedWords[i]!;

    // If this is the last typed word and the user hasn't pressed space yet,
    // they're still typing it — don't judge it yet
    const isLastTypedWord = i === typedWords.length - 1;
    if (isLastTypedWord && !typedEndsWithSpace) {
      return { expected: exp, typed: tw, status: 'typing' as const };
    }

    const match = tw.toLowerCase() === exp.toLowerCase();
    return { expected: exp, typed: tw, status: match ? 'correct' as const : 'incorrect' as const };
  });
}

export function getScore(results: ComparisonResult[]): { correct: number; total: number } {
  const total = results.length;
  const correct = results.filter((r) => r.status === 'correct').length;
  return { correct, total };
}

export function isComplete(results: ComparisonResult[]): boolean {
  return results.length > 0 && results.every((r) => r.status === 'correct' || r.status === 'incorrect');
}

export function isPerfect(results: ComparisonResult[]): boolean {
  return results.every((r) => r.status === 'correct');
}
