import { create } from 'zustand';
import { Habit, Completion, Streak, Mood } from '../types';

interface HabitState {
  habits: Habit[];
  todayCompletions: Completion[];
  streaks: Record<string, Streak>;
  isLoadingData: boolean;
  setLoadingData: (v: boolean) => void;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  setTodayCompletions: (completions: Completion[]) => void;
  addCompletion: (completion: Completion) => void;
  removeCompletion: (habitId: string) => void;
  setStreak: (habitId: string, streak: Streak) => void;
  useShield: (habitId: string) => Streak | null;
  isCompletedToday: (habitId: string) => boolean;
  getTodayProgress: () => { completed: number; total: number };
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  todayCompletions: [],
  streaks: {},
  isLoadingData: true,
  setLoadingData: (isLoadingData) => set({ isLoadingData }),

  setHabits: (habits) => set({ habits }),
  addHabit: (habit) => set((s) => ({ habits: [...s.habits, habit] })),
  updateHabit: (id, updates) =>
    set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)) })),
  removeHabit: (id) =>
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

  setTodayCompletions: (completions) => set({ todayCompletions: completions }),
  addCompletion: (completion) =>
    set((s) => ({ todayCompletions: [...s.todayCompletions, completion] })),
  removeCompletion: (habitId) =>
    set((s) => ({ todayCompletions: s.todayCompletions.filter((c) => c.habit_id !== habitId) })),

  setStreak: (habitId, streak) =>
    set((s) => ({ streaks: { ...s.streaks, [habitId]: streak } })),

  useShield: (habitId) => {
    const { streaks } = get();
    const existing = streaks[habitId];
    if (!existing || (existing.shields_remaining ?? 0) <= 0) return null;
    const updated: Streak = {
      ...existing,
      shields_remaining: existing.shields_remaining - 1,
      last_completed_at: new Date().toISOString(),
    };
    set((s) => ({ streaks: { ...s.streaks, [habitId]: updated } }));
    return updated;
  },

  isCompletedToday: (habitId) =>
    get().todayCompletions.some((c) => c.habit_id === habitId),

  getTodayProgress: () => {
    const { habits, todayCompletions } = get();
    const today = new Date().getDay();
    const todayHabits = habits.filter((h) => {
      if (h.frequency_type === 'daily') return true;
      if (h.frequency_type === 'weekly') return h.frequency_days.includes(today);
      return h.frequency_days.includes(today);
    });
    const completed = todayHabits.filter((h) =>
      todayCompletions.some((c) => c.habit_id === h.id)
    ).length;
    return { completed, total: todayHabits.length };
  },
}));
