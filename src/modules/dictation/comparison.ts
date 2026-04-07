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
    const isLastTypedWord = i === typedWords.length - 1;

    // The word is still being typed if:
    // - it's the last typed word AND
    // - there's no space after it AND
    // - the typed word is shorter than the expected word (still typing)
    //   OR it could still become correct (starts matching)
    if (isLastTypedWord && !typedEndsWithSpace) {
      // Still typing: word is shorter than expected, or same length but let user confirm with space
      // For the last expected word: consider done only when typed length >= expected length
      const isLastExpectedWord = i === expectedWords.length - 1;
      if (!isLastExpectedWord) {
        // Not the last expected word: always wait for space
        return { expected: exp, typed: tw, status: 'typing' as const };
      }
      // Last expected word: wait until typed is at least as long as expected
      if (tw.length < exp.length) {
        return { expected: exp, typed: tw, status: 'typing' as const };
      }
      // Typed is long enough — judge it now
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

export function getErrorRate(results: ComparisonResult[]): number {
  const { correct, total } = getScore(results);
  if (total === 0) return 0;
  return (total - correct) / total;
}
