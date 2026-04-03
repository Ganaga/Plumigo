export type WordStatus = 'correct' | 'incorrect' | 'pending';

export interface ComparisonResult {
  expected: string;
  typed: string;
  status: WordStatus;
}

export function compareWords(expected: string, typed: string): ComparisonResult[] {
  const expectedWords = expected.trim().split(/\s+/);
  const typedWords = typed.trim().split(/\s+/).filter((w) => w.length > 0);

  return expectedWords.map((exp, i) => {
    if (i >= typedWords.length) {
      return { expected: exp, typed: '', status: 'pending' as const };
    }
    const tw = typedWords[i]!;
    // Exact match (case-insensitive for tolerance, but keep accents strict)
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
  return results.every((r) => r.status !== 'pending');
}

export function isPerfect(results: ComparisonResult[]): boolean {
  return results.every((r) => r.status === 'correct');
}
