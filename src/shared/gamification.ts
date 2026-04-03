import type { Achievement, Level } from '../types';
import { updateState, getState } from './storage';

export const LEVELS: Level[] = [
  { name: 'Débutant', minPoints: 0 },
  { name: 'Apprenti', minPoints: 100 },
  { name: 'Explorateur', minPoints: 300 },
  { name: 'Aventurier', minPoints: 600 },
  { name: 'Champion', minPoints: 1000 },
  { name: 'Maître des mots', minPoints: 1500 },
  { name: 'Légendaire', minPoints: 2500 },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    name: 'Première touche',
    description: 'Termine ta première leçon de frappe',
    icon: '⌨️',
    check: (s) => Object.keys(s.typing.completedLessons).length >= 1,
  },
  {
    id: 'home-row',
    name: 'Dix doigts',
    description: 'Termine toutes les leçons de la rangée du milieu',
    icon: '🖐️',
    check: (s) => {
      for (let i = 1; i <= 5; i++) {
        if (!s.typing.completedLessons[`lesson-${i}`]) return false;
      }
      return true;
    },
  },
  {
    id: 'speed-20',
    name: 'Rapide comme l\'éclair',
    description: 'Atteins 20 mots par minute',
    icon: '⚡',
    check: (s) => Object.values(s.typing.completedLessons).some((r) => r.bestWpm >= 20),
  },
  {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: 'Obtiens 3 étoiles sur une leçon',
    icon: '⭐',
    check: (s) => Object.values(s.typing.completedLessons).some((r) => r.stars >= 3),
  },
  {
    id: 'first-story',
    name: 'Auteur en herbe',
    description: 'Écris ta première histoire',
    icon: '📝',
    check: (s) => s.writing.stories.length >= 1,
  },
  {
    id: 'novelist',
    name: 'Romancier',
    description: 'Écris une histoire de plus de 100 mots',
    icon: '📖',
    check: (s) => s.writing.stories.some((st) => st.wordCount >= 100),
  },
  {
    id: 'spell-fixer',
    name: 'Correcteur',
    description: 'Corrige 10 fautes d\'orthographe',
    icon: '🔧',
    check: (s) => (s.gamification.totalPoints >= 100), // simplified: tracked via points
  },
  {
    id: 'streak-7',
    name: 'Fidèle',
    description: 'Utilise KidWriter 7 jours de suite',
    icon: '🔥',
    check: (s) => s.gamification.dailyStreak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Inarrêtable',
    description: 'Utilise KidWriter 30 jours de suite',
    icon: '🏆',
    check: (s) => s.gamification.dailyStreak >= 30,
  },
  {
    id: 'all-lessons',
    name: 'Diplômé',
    description: 'Termine toutes les leçons de frappe',
    icon: '🎓',
    check: (s) => Object.keys(s.typing.completedLessons).length >= 20,
  },
];

function computeLevel(points: number): number {
  let level = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i]!.minPoints) {
      level = i + 1;
      break;
    }
  }
  return level;
}

export function getCurrentLevel(): Level {
  const state = getState();
  return LEVELS[state.gamification.level - 1] ?? LEVELS[0]!;
}

export function getNextLevel(): Level | null {
  const state = getState();
  return LEVELS[state.gamification.level] ?? null;
}

export function addPoints(amount: number): { newAchievements: Achievement[]; leveledUp: boolean } {
  let leveledUp = false;
  const newAchievements: Achievement[] = [];

  updateState((state) => {
    state.gamification.totalPoints += amount;
    const newLevel = computeLevel(state.gamification.totalPoints);
    if (newLevel > state.gamification.level) {
      leveledUp = true;
    }
    state.gamification.level = newLevel;

    // Check achievements
    for (const achievement of ACHIEVEMENTS) {
      if (!state.gamification.achievements.includes(achievement.id) && achievement.check(state)) {
        state.gamification.achievements.push(achievement.id);
        newAchievements.push(achievement);
      }
    }
  });

  return { newAchievements, leveledUp };
}

export function updateDailyStreak(): void {
  updateState((state) => {
    const today = new Date().toISOString().slice(0, 10);
    const last = state.gamification.lastActiveDate;

    if (last === today) return;

    if (last) {
      const lastDate = new Date(last);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);

      if (diffDays === 1) {
        state.gamification.dailyStreak += 1;
      } else if (diffDays > 2) {
        // Allow 1 day forgiveness
        state.gamification.dailyStreak = 1;
      }
    } else {
      state.gamification.dailyStreak = 1;
    }

    state.gamification.lastActiveDate = today;

    // Daily bonus
    if (!state.gamification.dailyActivity[today]) {
      state.gamification.dailyActivity[today] = { keysTyped: 0, wordsWritten: 0 };
      state.gamification.totalPoints += 20;
      state.gamification.level = computeLevel(state.gamification.totalPoints);
    }
  });
}

export function recordTypingActivity(correctKeys: number, totalKeys: number): void {
  updateState((state) => {
    state.typing.totalKeysTyped += totalKeys;
    state.typing.totalCorrectKeys += correctKeys;
    const today = new Date().toISOString().slice(0, 10);
    if (!state.gamification.dailyActivity[today]) {
      state.gamification.dailyActivity[today] = { keysTyped: 0, wordsWritten: 0 };
    }
    state.gamification.dailyActivity[today]!.keysTyped += totalKeys;
  });
}

export function recordWritingActivity(words: number): void {
  updateState((state) => {
    const today = new Date().toISOString().slice(0, 10);
    if (!state.gamification.dailyActivity[today]) {
      state.gamification.dailyActivity[today] = { keysTyped: 0, wordsWritten: 0 };
    }
    state.gamification.dailyActivity[today]!.wordsWritten += words;
  });
}
