import { supabase } from './client';

export const authService = {
  signUpWithEmail: (email: string, password: string, options?: { data?: Record<string, unknown> }) =>
    supabase.auth.signUp({ email, password, options }),

  signInWithEmail: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signInWithGoogle: () =>
    supabase.auth.signInWithOAuth({ provider: 'google' }),

  signInWithApple: () =>
    supabase.auth.signInWithOAuth({ provider: 'apple' }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
    supabase.auth.onAuthStateChange(callback),

  resetPassword: (email: string) =>
    supabase.auth.resetPasswordForEmail(email),

  updatePassword: (newPassword: string) =>
    supabase.auth.updateUser({ password: newPassword }),
};
