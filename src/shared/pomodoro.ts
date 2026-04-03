export interface PomodoroConfig {
  writingMinutes: number;
  breakMinutes: number;
}

export type PomodoroPhase = 'writing' | 'break';

export interface PomodoroCallbacks {
  onTick: (remainingSeconds: number, phase: PomodoroPhase) => void;
  onPhaseChange: (phase: PomodoroPhase) => void;
  onComplete: () => void;
}

export interface PomodoroController {
  stop: () => void;
}

export function startPomodoro(
  config: PomodoroConfig,
  callbacks: PomodoroCallbacks,
): PomodoroController {
  let phase: PomodoroPhase = 'writing';
  let remaining = config.writingMinutes * 60;
  let timer: ReturnType<typeof setInterval> | null = null;

  function tick(): void {
    remaining -= 1;
    if (remaining <= 0) {
      if (phase === 'writing') {
        phase = 'break';
        remaining = config.breakMinutes * 60;
        callbacks.onPhaseChange('break');
      } else {
        // Break is over
        stop();
        callbacks.onComplete();
        return;
      }
    }
    callbacks.onTick(remaining, phase);
  }

  function stop(): void {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  callbacks.onTick(remaining, phase);
  callbacks.onPhaseChange('writing');
  timer = setInterval(tick, 1000);

  return { stop };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
