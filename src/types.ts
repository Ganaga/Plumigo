export interface LessonResult {
  stars: number;
  bestWpm: number;
  bestAccuracy: number;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
}

export interface DailyActivity {
  keysTyped: number;
  wordsWritten: number;
}

export interface KidWriterState {
  profile: {
    name: string;
    createdAt: string;
    theme: 'light' | 'dark';
  };
  typing: {
    completedLessons: Record<string, LessonResult>;
    currentLesson: string;
    totalKeysTyped: number;
    totalCorrectKeys: number;
  };
  writing: {
    stories: Story[];
    currentStoryId: string | null;
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

export type Route = '' | 'typing' | 'writing' | 'profile';
export type RouteHandler = (container: HTMLElement, params?: string) => void | (() => void);
