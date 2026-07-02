import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from './client';

export const authService = {
  signUpWithEmail: (email: string, password: string, options?: { data?: Record<string, unknown> }) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        ...options,
        emailRedirectTo: 'bloom://auth/callback',
      },
    }),

  signInWithEmail: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signInWithGoogle: async () => {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    GoogleSignin.configure({
      iosClientId: '106125827120-fhloo467hcd66tgmlhnl50g1eeavg6eq.apps.googleusercontent.com',
      webClientId: '106125827120-vnpt9nonq67kij2ns8r4guobs4dq2ace.apps.googleusercontent.com',
    });
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;
    if (!idToken) return { data: null, error: null };
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    return { data, error };
  },

  signInWithApple: async () => {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('Apple Sign In failed: no identity token');
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    return { data, error };
  },

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
    supabase.auth.onAuthStateChange(callback),

  resendVerificationEmail: (email: string) =>
    supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: 'bloom://auth/callback' } }),

  resetPassword: (email: string) =>
    supabase.auth.resetPasswordForEmail(email),

  updatePassword: (newPassword: string) =>
    supabase.auth.updateUser({ password: newPassword }),
};
