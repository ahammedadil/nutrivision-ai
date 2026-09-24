import { create } from 'zustand';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

interface UserState {
  name: string;
  streak: number;
  dailyGoal: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dailyConsumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  recentMeals: Meal[];
  addMeal: (meal: Meal) => void;
  resetDaily: () => void;
}

export const useStore = create<UserState>((set) => ({
  name: 'Ahammed',
  streak: 18,
  dailyGoal: {
    calories: 2200,
    protein: 140,
    carbs: 250,
    fat: 70,
  },
  dailyConsumed: {
    calories: 1430,
    protein: 82,
    carbs: 120,
    fat: 35,
  },
  recentMeals: [
    { id: '1', name: 'Idli with Sambar', calories: 320, protein: 12, carbs: 54, fat: 4, time: '8:30 AM' },
    { id: '2', name: 'Chicken Biryani', calories: 650, protein: 45, carbs: 70, fat: 22, time: '1:15 PM' },
  ],
  addMeal: (meal) => set((state) => ({
    recentMeals: [meal, ...state.recentMeals],
    dailyConsumed: {
      calories: state.dailyConsumed.calories + meal.calories,
      protein: state.dailyConsumed.protein + meal.protein,
      carbs: state.dailyConsumed.carbs + meal.carbs,
      fat: state.dailyConsumed.fat + meal.fat,
    }
  })),
  resetDaily: () => set({
    dailyConsumed: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    recentMeals: []
  })
}));
