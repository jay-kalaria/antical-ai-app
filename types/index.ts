export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Meal {
  id: string;
  name: string;
  dateTime: Date;
  nutriScore: NutriScoreGrade;
  ultraProcessedPercentage: number;
  fiber: number;
  protein: number;
  calories: number;
  isHomemade: boolean;
  tags: string[];
}

export interface Tip {
  id: string;
  emoji: string;
  title: string;
  description: string;
  actionable: boolean;
  category: 'nutrition' | 'lifestyle' | 'health';
}

export interface UserProfile {
  name: string;
  isPro: boolean;
  showMacros: boolean;
  dailyGoals: {
    protein: number;
    fiber: number;
    calories: number;
  };
  connectedDevices: string[];
  language: 'en' | 'es' | 'fr';
}

export type FilterType = 'all' | 'high-protein' | 'low-sugar' | 'homemade';