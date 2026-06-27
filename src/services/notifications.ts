import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') return true;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleHabitNotification(
  habitId: string,
  habitTitle: string,
  hour: number,
  minute: number,
): Promise<string | null> {
  const granted = await requestNotificationPermission();
  if (!granted) return null;

  await cancelHabitNotification(habitId);

  const id = await Notifications.scheduleNotificationAsync({
    identifier: `habit-${habitId}`,
    content: {
      title: '🌱 Bloom',
      body: `${habitTitle} zamanı!`,
      data: { habitId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  return id;
}

export async function cancelHabitNotification(habitId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(`habit-${habitId}`);
}

export async function cancelAllHabitNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
