import { supabase } from './client';
import { Profile, UserPreferences, Subscription } from '../../types';

export const profileService = {
  getProfile: (userId: string) =>
    supabase.from('profiles').select('*').eq('id', userId).single(),

  createProfile: (profile: Omit<Profile, 'created_at'>) =>
    supabase.from('profiles').insert(profile).select().single(),

  updateProfile: (userId: string, updates: Partial<Profile>) =>
    supabase.from('profiles').update(updates).eq('id', userId).select().single(),

  getPreferences: (userId: string) =>
    supabase.from('user_preferences').select('*').eq('user_id', userId).single(),

  upsertPreferences: (prefs: UserPreferences) =>
    supabase.from('user_preferences').upsert(prefs).select().single(),

  getSubscription: (userId: string) =>
    supabase.from('subscriptions').select('*').eq('user_id', userId).single(),

  isPremium: async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('subscriptions')
      .select('plan, expires_at')
      .eq('user_id', userId)
      .single();
    if (!data || data.plan !== 'premium') return false;
    if (!data.expires_at) return false;
    return new Date(data.expires_at) > new Date();
  },
};
