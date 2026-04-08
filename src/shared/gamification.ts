import type { Achievement, Level } from '../types';
import { updateState, getState } from './storage';

export const LEVELS: Level[] = [
  { name: 'Débutant', minPoints: 0 },
  { name: 'Apprenti', minPoints: 20 },
  { name: 'Explorateur', minPoints: 50 },
  { name: 'Aventurier', minPoints: 100 },
  { name: 'Champion', minPoints: 200 },
  { name: 'Maître des mots', minPoints: 350 },
  { name: 'Légendaire', minPoints: 500 },
];

export const ACHIEVEMENTS: Achievement[] = [
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
    id: 'great-writer',
    name: 'Grand écrivain',
    description: 'Écris une histoire de plus de 500 mots',
    icon: '✒️',
    check: (s) => s.writing.stories.some((st) => st.wordCount >= 500),
  },
  {
    id: 'zero-fault',
    name: 'Zéro faute',
    description: 'Écris un texte sans aucune erreur',
    icon: '🏆',
    check: (s) => s.gamification.achievements.includes('zero-fault'),
  },
  {
    id: 'fixer-10',
    name: 'Correcteur',
    description: 'Corrige 10 fautes',
    icon: '🔧',
    check: (s) => s.writing.totalCorrections >= 10,
  },
  {
    id: 'grammar-fixer-10',
    name: 'Grammairien',
    description: 'Corrige 10 fautes de grammaire',
    icon: '📐',
    check: (s) => s.writing.grammarCorrections >= 10,
  },
  {
    id: 'rich-vocab',
    name: 'Vocabulaire riche',
    description: 'Utilise 100 mots différents dans une histoire',
    icon: '🌟',
    check: (s) => {
      return s.writing.stories.some((st) => {
        const words = st.content.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
        return new Set(words).size >= 100;
      });
    },
  },
  // Gamme : mots sans faute
  {
    id: 'clean-4',
    name: 'Première gamme',
    description: 'Écris 4 mots sans aucune faute',
    icon: '🎵',
    check: (s) => s.writing.bestCleanStreak >= 4,
  },
  {
    id: 'clean-8',
    name: 'Gamme montante',
    description: 'Écris 8 mots sans aucune faute',
    icon: '🎶',
    check: (s) => s.writing.bestCleanStreak >= 8,
  },
  {
    id: 'clean-12',
    name: 'Bonne mélodie',
    description: 'Écris 12 mots sans aucune faute',
    icon: '🎸',
    check: (s) => s.writing.bestCleanStreak >= 12,
  },
  {
    id: 'clean-16',
    name: 'En harmonie',
    description: 'Écris 16 mots sans aucune faute',
    icon: '🎹',
    check: (s) => s.writing.bestCleanStreak >= 16,
  },
  {
    id: 'clean-20',
    name: 'Solo parfait',
    description: 'Écris 20 mots sans aucune faute',
    icon: '🎺',
    check: (s) => s.writing.bestCleanStreak >= 20,
  },
  {
    id: 'clean-28',
    name: 'Symphonie',
    description: 'Écris 28 mots sans aucune faute',
    icon: '🎻',
    check: (s) => s.writing.bestCleanStreak >= 28,
  },
  {
    id: 'clean-36',
    name: 'Orchestre',
    description: 'Écris 36 mots sans aucune faute',
    icon: '🥁',
    check: (s) => s.writing.bestCleanStreak >= 36,
  },
  {
    id: 'clean-50',
    name: 'Virtuose',
    description: 'Écris 50 mots sans aucune faute !',
    icon: '🏅',
    check: (s) => s.writing.bestCleanStreak >= 50,
  },
  {
    id: 'streak-7',
    name: 'Fidèle',
    description: 'Utilise Plumigo 7 jours de suite',
    icon: '🔥',
    check: (s) => s.gamification.dailyStreak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Inarrêtable',
    description: 'Utilise Plumigo 30 jours de suite',
    icon: '💎',
    check: (s) => s.gamification.dailyStreak >= 30,
  },
  {
    id: 'library',
    name: 'Bibliothèque',
    description: 'Écris 10 histoires',
    icon: '📚',
    check: (s) => s.writing.stories.length >= 10,
  },
  {
    id: 'daily-goal',
    name: 'Objectif du jour',
    description: 'Atteins ton objectif quotidien de mots',
    icon: '🎯',
    check: (s) => {
      const today = new Date().toISOString().slice(0, 10);
      const activity = s.gamification.dailyActivity[today];
      return (activity?.wordsWritten ?? 0) >= s.gamification.dailyWordGoal;
    },
  },
  {
    id: 'dictation-5',
    name: 'Bon élève',
    description: 'Réussis 5 dictées',
    icon: '🎧',
    check: (s) => s.dictation.sentencesCompleted >= 5,
  },
  {
    id: 'dictation-perfect-3',
    name: 'Oreille parfaite',
    description: '3 dictées parfaites d\'affilée',
    icon: '👂',
    check: (s) => s.dictation.perfectScores >= 3,
  },
  {
    id: 'hangman-5',
    name: 'Devineur',
    description: 'Gagne 5 parties au pendu',
    icon: '🎯',
    check: (s) => s.hangman.wordsWon >= 5,
  },
  {
    id: 'hangman-20',
    name: 'Maître du pendu',
    description: 'Gagne 20 parties au pendu',
    icon: '🏹',
    check: (s) => s.hangman.wordsWon >= 20,
  },
  {
    id: 'quiz-10',
    name: 'Bon élève',
    description: 'Réponds correctement à 10 questions',
    icon: '✏️',
    check: (s) => s.quiz.correctAnswers >= 10,
  },
  {
    id: 'quiz-50',
    name: 'Expert orthographe',
    description: 'Réponds correctement à 50 questions',
    icon: '🎓',
    check: (s) => s.quiz.correctAnswers >= 50,
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

    for (const achievement of ACHIEVEMENTS) {
      if (!state.gamification.achievements.includes(achievement.id) && achievement.check(state)) {
        state.gamification.achievements.push(achievement.id);
        newAchievements.push(achievement);
      }
    }
  });

  return { newAchievements, leveledUp };
}

export function recordCorrection(isGrammar: boolean): void {
  updateState((state) => {
    state.writing.totalCorrections += 1;
    if (isGrammar) {
      state.writing.grammarCorrections += 1;
    }
  });
}

export function awardZeroFault(): void {
  updateState((state) => {
    if (!state.gamification.achievements.includes('zero-fault')) {
      state.gamification.achievements.push('zero-fault');
    }
  });
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
        state.gamification.dailyStreak = 1;
      }
    } else {
      state.gamification.dailyStreak = 1;
    }

    state.gamification.lastActiveDate = today;

    if (!state.gamification.dailyActivity[today]) {
      state.gamification.dailyActivity[today] = { wordsWritten: 0 };
      state.gamification.totalPoints += 5;
      state.gamification.level = computeLevel(state.gamification.totalPoints);
    }
  });
}

export function updateCleanStreak(totalWords: number, errorCount: number): { newAchievements: Achievement[]; leveledUp: boolean } {
  // If no errors, the entire text is a clean streak
  const cleanWords = errorCount === 0 ? totalWords : 0;
  let result = { newAchievements: [] as Achievement[], leveledUp: false };

  if (cleanWords > 0) {
    updateState((state) => {
      if (cleanWords > state.writing.bestCleanStreak) {
        state.writing.bestCleanStreak = cleanWords;
      }
    });
    // Check for new achievements
    result = addPoints(0);
  }

  return result;
}

export function recordWritingActivity(words: number): void {
  updateState((state) => {
    const today = new Date().toISOString().slice(0, 10);
    if (!state.gamification.dailyActivity[today]) {
      state.gamification.dailyActivity[today] = { wordsWritten: 0 };
    }
    state.gamification.dailyActivity[today]!.wordsWritten += words;
  });
}

export function getDailyWordsWritten(): number {
  const state = getState();
  const today = new Date().toISOString().slice(0, 10);
  return state.gamification.dailyActivity[today]?.wordsWritten ?? 0;
}

export function getDailyWordGoal(): number {
  const state = getState();
  return state.gamification.dailyWordGoal;
}
