export type Language = 'tr' | 'en';
export type Plan = 'free' | 'premium';
export type Platform = 'ios' | 'android';
export type Mood = 1 | 2 | 3 | 4 | 5;

export type HabitCategory =
  | 'fitness'
  | 'mind'
  | 'sleep'
  | 'nutrition'
  | 'social'
  | 'work'
  | 'custom';

export type FrequencyType = 'daily' | 'weekly' | 'custom';

export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  language: Language;
  bloom_level: number;
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  notifications_enabled: boolean;
  theme: 'dark';
}

export interface Subscription {
  user_id: string;
  plan: Plan;
  expires_at: string | null;
  platform: Platform | null;
  original_transaction_id: string | null;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  category: HabitCategory;
  icon: string;
  color: string;
  frequency_type: FrequencyType;
  frequency_days: number[];
  reminder_time: string | null;
  created_at: string;
}

export interface HabitStack {
  id: string;
  user_id: string;
  name: string;
  habit_ids: string[];
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface Completion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  mood: Mood | null;
}

export interface Streak {
  habit_id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_at: string | null;
  shields_remaining: number;
}

export interface Insight {
  id: string;
  user_id: string;
  week_start: string;
  content: string;
  generated_at: string;
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
