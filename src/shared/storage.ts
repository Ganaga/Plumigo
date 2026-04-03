import type { AppState } from '../types';

const STORAGE_KEY = 'plumigo_state';

function defaultState(): AppState {
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
      sentencesValidated: 0,
    },
    gamification: {
      totalPoints: 0,
      level: 1,
      achievements: [],
      dailyStreak: 0,
      lastActiveDate: '',
      dailyActivity: {},
      dailyWordGoal: 20,
    },
    dictation: {
      sentencesCompleted: 0,
      perfectScores: 0,
      currentDifficulty: 'easy',
    },
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const defaults = defaultState();
      return {
        profile: { ...defaults.profile, ...saved.profile },
        writing: { ...defaults.writing, ...saved.writing },
        gamification: { ...defaults.gamification, ...saved.gamification },
        dictation: { ...defaults.dictation, ...saved.dictation },
      };
    }
  } catch {
    // corrupted data, reset
  }
  return defaultState();
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState(): AppState {
  return loadState();
}

export function updateState(updater: (state: AppState) => void): AppState {
  const state = loadState();
  updater(state);
  saveState(state);
  return state;
}
