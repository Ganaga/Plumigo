let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playKeySound(correct: boolean): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    if (correct) {
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
    } else {
      oscillator.frequency.value = 200;
      oscillator.type = 'square';
    }

    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not available
  }
}

export function playLevelUp(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gain.gain.value = 0.1;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
      oscillator.start(ctx.currentTime + i * 0.15);
      oscillator.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  } catch {
    // Audio not available
  }
}

export function playAchievement(): void {
  try {
    const ctx = getAudioContext();
    const notes = [784, 988, 1175]; // G5, B5, D6

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';
      gain.gain.value = 0.12;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
      oscillator.start(ctx.currentTime + i * 0.12);
      oscillator.stop(ctx.currentTime + i * 0.12 + 0.25);
    });
  } catch {
    // Audio not available
  }
}
