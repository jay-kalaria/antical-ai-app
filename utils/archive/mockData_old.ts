import { Meal, Tip, UserProfile, NutriScoreGrade } from '@/types';

// Generate a random date within the last 7 days
const getRandomRecentDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  
  return now;
};

// Mock meals data
export const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Avocado Toast with Egg',
    dateTime: new Date(new Date().setHours(8, 30)),
    nutriScore: 'A',
    ultraProcessedPercentage: 12,
    fiber: 6,
    protein: 14,
    calories: 340,
    isHomemade: true,
    tags: ['breakfast', 'high-protein']
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    dateTime: new Date(new Date().setHours(13, 15)),
    nutriScore: 'A',
    ultraProcessedPercentage: 5,
    fiber: 8,
    protein: 32,
    calories: 420,
    isHomemade: true,
    tags: ['lunch', 'high-protein', 'low-carb']
  },
  {
    id: '3',
    name: 'Takeout Burger and Fries',
    dateTime: new Date(new Date().setHours(19, 45)),
    nutriScore: 'D',
    ultraProcessedPercentage: 78,
    fiber: 4,
    protein: 28,
    calories: 950,
    isHomemade: false,
    tags: ['dinner', 'fast-food']
  },
  {
    id: '4',
    name: 'Greek Yogurt with Berries',
    dateTime: new Date(new Date().setHours(16, 0)),
    nutriScore: 'A',
    ultraProcessedPercentage: 10,
    fiber: 3,
    protein: 18,
    calories: 180,
    isHomemade: true,
    tags: ['snack', 'high-protein']
  },
  {
    id: '5',
    name: 'Spinach and Chickpea Curry',
    dateTime: getRandomRecentDate(),
    nutriScore: 'B',
    ultraProcessedPercentage: 15,
    fiber: 12,
    protein: 16,
    calories: 410,
    isHomemade: true,
    tags: ['dinner', 'vegetarian']
  },
  {
    id: '6',
    name: 'Frozen Pizza',
    dateTime: getRandomRecentDate(),
    nutriScore: 'E',
    ultraProcessedPercentage: 89,
    fiber: 2,
    protein: 14,
    calories: 780,
    isHomemade: false,
    tags: ['dinner', 'ultra-processed']
  },
  {
    id: '7',
    name: 'Overnight Oats with Peanut Butter',
    dateTime: getRandomRecentDate(),
    nutriScore: 'B',
    ultraProcessedPercentage: 8,
    fiber: 9,
    protein: 15,
    calories: 390,
    isHomemade: true,
    tags: ['breakfast', 'high-fiber']
  },
];

// Mock tips data
export const mockTips: Tip[] = [
  {
    id: '1',
    emoji: '🥦',
    title: 'More fiber needed',
    description: 'Try adding an extra serving of vegetables.',
    actionable: true,
    category: 'nutrition'
  },
  {
    id: '2',
    emoji: '💧',
    title: 'Hydration reminder',
    description: "You're tracking below your usual water intake.",
    actionable: true,
    category: 'lifestyle'
  },
  {
    id: '3',
    emoji: '🧘',
    title: 'Stress management',
    description: 'Eating more processed foods this week. Consider a 10-minute meditation break.',
    actionable: true,
    category: 'health'
  },
  {
    id: '4',
    emoji: '🍳',
    title: 'Protein balance',
    description: 'Great job getting consistent protein across all meals today!',
    actionable: false,
    category: 'nutrition'
  },
  {
    id: '5',
    emoji: '🏆',
    title: 'Weekly achievement',
    description: 'You\'ve increased your overall Vital Score by 12 points from last week!',
    actionable: false,
    category: 'health'
  },
];

// Mock user profile data
export const mockUserProfile: UserProfile = {
  name: 'Alex Johnson',
  isPro: false,
  showMacros: false,
  dailyGoals: {
    protein: 100,
    fiber: 30,
    calories: 2200
  },
  connectedDevices: ['Fitbit Charge 5'],
  language: 'en'
};

// Get today's vital score (calculated from meals)
export const getTodaysVitalScore = (): number => {
  // A simple algorithm that averages nutritional scores
  const todaysMeals = mockMeals.filter(meal => {
    const today = new Date();
    return meal.dateTime.setHours(0,0,0,0) === today.setHours(0,0,0,0);
  });
  
  if (todaysMeals.length === 0) return 72; // Default score
  
  const nutriScoreValues: Record<NutriScoreGrade, number> = {
    'A': 100,
    'B': 80,
    'C': 60,
    'D': 40,
    'E': 20
  };
  
  const totalScore = todaysMeals.reduce((sum, meal) => {
    return sum + nutriScoreValues[meal.nutriScore];
  }, 0);
  
  return Math.round(totalScore / todaysMeals.length);
};