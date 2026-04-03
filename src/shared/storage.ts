import type { KidWriterState } from '../types';

const STORAGE_KEY = 'kidwriter_state';

function defaultState(): KidWriterState {
  return {
    profile: {
      name: '',
      createdAt: new Date().toISOString(),
      theme: 'light',
      mascot: 'owl',
    },
    writing: {
      stories: [],
      currentStoryId: null,
      totalCorrections: 0,
      grammarCorrections: 0,
      bestCleanStreak: 0,
    },
    gamification: {
      totalPoints: 0,
      level: 1,
      achievements: [],
      dailyStreak: 0,
      lastActiveDate: '',
      dailyActivity: {},
    },
  };
}

export function loadState(): KidWriterState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...defaultState(), ...JSON.parse(raw) };
    }
  } catch {
    // corrupted data, reset
  }
  return defaultState();
}

export function saveState(state: KidWriterState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState(): KidWriterState {
  return loadState();
}

export function updateState(updater: (state: KidWriterState) => void): KidWriterState {
  const state = loadState();
  updater(state);
  saveState(state);
  return state;
}
