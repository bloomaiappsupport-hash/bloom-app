import { supabase } from './client';
import { Habit, Completion, Streak, Mood, HabitStack } from '../../types';

export const habitsService = {
  getHabits: (userId: string) =>
    supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),

  createHabit: (habit: Omit<Habit, 'id' | 'created_at'>) =>
    supabase.from('habits').insert(habit).select().single(),

  updateHabit: (id: string, updates: Partial<Habit>) =>
    supabase.from('habits').update(updates).eq('id', id).select().single(),

  deleteHabit: (id: string) =>
    supabase.from('habits').delete().eq('id', id),

  getTodayCompletions: (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return supabase
      .from('completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', `${today}T00:00:00`)
      .lte('completed_at', `${today}T23:59:59`);
  },

  completeHabit: (habitId: string, userId: string, mood?: Mood) =>
    supabase
      .from('completions')
      .insert({ habit_id: habitId, user_id: userId, mood: mood ?? null })
      .select()
      .single(),

  getStreak: (habitId: string, userId: string) =>
    supabase
      .from('streaks')
      .select('*')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .single(),

  getAllStreaks: (userId: string) =>
    supabase.from('streaks').select('*').eq('user_id', userId),

  upsertStreak: (streak: Streak) =>
    supabase.from('streaks').upsert(streak).select().single(),

  deleteCompletion: (habitId: string, userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return supabase
      .from('completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .gte('completed_at', `${today}T00:00:00`)
      .lte('completed_at', `${today}T23:59:59`);
  },

  getStacks: (userId: string) =>
    supabase.from('habit_stacks').select('*').eq('user_id', userId),

  createStack: (stack: Omit<HabitStack, 'id'>) =>
    supabase.from('habit_stacks').insert(stack).select().single(),

  deleteStack: (id: string) =>
    supabase.from('habit_stacks').delete().eq('id', id),

  getCompletionHistory: (userId: string, days: number = 30) => {
    const from = new Date();
    from.setDate(from.getDate() - days);
    return supabase
      .from('completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', from.toISOString())
      .order('completed_at', { ascending: false });
  },
};
