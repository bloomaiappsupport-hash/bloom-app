import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Assessment: undefined;
  BloomCreation: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Paywall: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  Habits: undefined;
  Coach: undefined;
  Insights: undefined;
  Profile: undefined;
};

export type HabitsStackParamList = {
  HabitsList: undefined;
  HabitDetail: { habitId: string };
  HabitCreate: undefined;
  HabitEdit: { habitId: string };
  StackBuilder: undefined;
};
