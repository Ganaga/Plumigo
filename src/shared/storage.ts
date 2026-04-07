import type { AppState } from '../types';

const PROFILES_KEY = 'plumigo_profiles';
const ACTIVE_KEY = 'plumigo_active';

export interface ProfileEntry {
  id: string;
  name: string;
}

function stateKey(profileId: string): string {
  return `plumigo_state_${profileId}`;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function defaultState(name: string = ''): AppState {
  return {
    profile: {
      name,
      createdAt: new Date().toISOString(),
      theme: 'light',
      mascot: 'owl',
      useBuiltInKeyboard: false,
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
      dailyWordGoal: 20,
    },
    dictation: {
      sentencesCompleted: 0,
      perfectScores: 0,
      currentDifficulty: 'easy',
      showSentence: 'flash',
    },
  };
}

// ─── Profile management ──────────────────────────

export function getProfiles(): ProfileEntry[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* */ }
  return [];
}

function saveProfiles(profiles: ProfileEntry[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfileId(): string {
  let id = localStorage.getItem(ACTIVE_KEY);
  const profiles = getProfiles();

  // Migrate from old single-profile format
  if (profiles.length === 0) {
    const oldData = localStorage.getItem('plumigo_state');
    id = generateId();
    let name = '';
    if (oldData) {
      try {
        const parsed = JSON.parse(oldData);
        name = parsed.profile?.name || '';
        localStorage.setItem(stateKey(id), oldData);
      } catch { /* */ }
      localStorage.removeItem('plumigo_state');
    }
    saveProfiles([{ id, name: name || 'Mon profil' }]);
    localStorage.setItem(ACTIVE_KEY, id);
    return id;
  }

  if (!id || !profiles.some((p) => p.id === id)) {
    id = profiles[0]!.id;
    localStorage.setItem(ACTIVE_KEY, id);
  }
  return id;
}

export function setActiveProfile(profileId: string): void {
  localStorage.setItem(ACTIVE_KEY, profileId);
}

export function createProfile(name: string): ProfileEntry {
  const id = generateId();
  const profiles = getProfiles();
  const entry: ProfileEntry = { id, name: name || 'Nouveau profil' };
  profiles.push(entry);
  saveProfiles(profiles);
  // Create default state for this profile
  localStorage.setItem(stateKey(id), JSON.stringify(defaultState(name)));
  return entry;
}

export function deleteProfile(profileId: string): void {
  let profiles = getProfiles();
  profiles = profiles.filter((p) => p.id !== profileId);
  saveProfiles(profiles);
  localStorage.removeItem(stateKey(profileId));

  // If we deleted the active profile, switch to first remaining
  const activeId = localStorage.getItem(ACTIVE_KEY);
  if (activeId === profileId && profiles.length > 0) {
    localStorage.setItem(ACTIVE_KEY, profiles[0]!.id);
  }
}

export function renameProfile(profileId: string, newName: string): void {
  const profiles = getProfiles();
  const p = profiles.find((x) => x.id === profileId);
  if (p) {
    p.name = newName;
    saveProfiles(profiles);
    // Also update the state's profile.name
    const state = loadStateFor(profileId);
    state.profile.name = newName;
    localStorage.setItem(stateKey(profileId), JSON.stringify(state));
  }
}

// ─── State load/save (always for active profile) ─

function loadStateFor(profileId: string): AppState {
  try {
    const raw = localStorage.getItem(stateKey(profileId));
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
  } catch { /* */ }
  return defaultState();
}

export function loadState(): AppState {
  return loadStateFor(getActiveProfileId());
}

export function saveState(state: AppState): void {
  localStorage.setItem(stateKey(getActiveProfileId()), JSON.stringify(state));
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
