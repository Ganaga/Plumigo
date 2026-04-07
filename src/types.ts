export interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

export interface DailyActivity {
  wordsWritten: number;
}

export interface AppState {
  profile: {
    name: string;
    createdAt: string;
    theme: 'light' | 'dark';
    mascot: string;
    useBuiltInKeyboard: boolean;
  };
  writing: {
    stories: Story[];
    currentStoryId: string | null;
    totalCorrections: number;
    grammarCorrections: number;
    bestCleanStreak: number;
  };
  gamification: {
    totalPoints: number;
    level: number;
    achievements: string[];
    dailyStreak: number;
    lastActiveDate: string;
    dailyActivity: Record<string, DailyActivity>;
    dailyWordGoal: number;
  };
  dictation: {
    sentencesCompleted: number;
    perfectScores: number;
    currentDifficulty: 'easy' | 'medium' | 'hard';
    showSentence: 'flash' | 'hidden';
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (state: AppState) => boolean;
}

export interface Level {
  name: string;
  minPoints: number;
}

export type Route = '' | 'writing' | 'profile' | 'dictation';
export type RouteHandler = (container: HTMLElement, params?: string) => void | (() => void);
