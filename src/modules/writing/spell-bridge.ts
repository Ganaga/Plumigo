type CheckResult = { word: string; correct: boolean; suggestions: string[] };
type CheckCallback = (results: CheckResult[]) => void;

let worker: Worker | null = null;
let ready = false;
let readyCallbacks: (() => void)[] = [];
let pendingChecks = new Map<number, CheckCallback>();
let nextId = 0;

export function initSpellChecker(onReady: () => void): void {
  if (worker) {
    if (ready) onReady();
    else readyCallbacks.push(onReady);
    return;
  }

  worker = new Worker(new URL('./spell-worker.ts', import.meta.url), { type: 'module' });

  worker.addEventListener('message', (e: MessageEvent) => {
    const { type, results, id } = e.data;

    if (type === 'ready') {
      ready = true;
      readyCallbacks.forEach((cb) => cb());
      readyCallbacks = [];
    } else if (type === 'results') {
      const cb = pendingChecks.get(id);
      if (cb) {
        cb(results);
        pendingChecks.delete(id);
      }
    }
  });

  readyCallbacks.push(onReady);
  worker.postMessage({ type: 'init' });
}

export function checkText(text: string, callback: CheckCallback): void {
  if (!worker || !ready) return;

  const words = text.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return;

  const id = nextId++;
  pendingChecks.set(id, callback);
  worker.postMessage({ type: 'check', words, id });
}

export function isReady(): boolean {
  return ready;
}
