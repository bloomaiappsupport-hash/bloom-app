import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { Profile, Plan } from '../types';

const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  name: 'Demo Kullanıcı',
  avatar_url: null,
  language: 'tr',
  bloom_level: 3,
  created_at: new Date().toISOString(),
};

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  plan: Plan;
  isLoading: boolean;
  isOnboarded: boolean;
  isDemoMode: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setPlan: (plan: Plan) => void;
  setOnboarded: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  enterDemoMode: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  plan: 'free',
  isLoading: true,
  isOnboarded: false,
  isDemoMode: false,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  setPlan: (plan) => set({ plan }),
  setOnboarded: (isOnboarded) => set({ isOnboarded }),
  setLoading: (isLoading) => set({ isLoading }),
  enterDemoMode: () => set({
    isDemoMode: true,
    profile: DEMO_PROFILE,
    isLoading: false,
  }),
  reset: () => set({
    session: null,
    user: null,
    profile: null,
    plan: 'free',
    isOnboarded: false,
    isDemoMode: false,
  }),
}));
