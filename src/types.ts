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

export interface KidWriterState {
  profile: {
    name: string;
    createdAt: string;
    theme: 'light' | 'dark';
    mascot: string;
  };
  writing: {
    stories: Story[];
    currentStoryId: string | null;
    totalCorrections: number;
    grammarCorrections: number;
    bestCleanStreak: number; // best streak of consecutive error-free words
  };
  gamification: {
    totalPoints: number;
    level: number;
    achievements: string[];
    dailyStreak: number;
    lastActiveDate: string;
    dailyActivity: Record<string, DailyActivity>;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (state: KidWriterState) => boolean;
}

export interface Level {
  name: string;
  minPoints: number;
}

export type Route = '' | 'writing' | 'profile';
export type RouteHandler = (container: HTMLElement, params?: string) => void | (() => void);
