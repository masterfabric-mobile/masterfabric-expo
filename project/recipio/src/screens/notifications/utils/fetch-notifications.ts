import type { NotificationItem } from '../models/notification-models';
import { MOCK_NOTIFICATIONS } from './mock-notifications';

/** Simulated fetch; replace with API when backend exists. */
export async function fetchNotificationsList(): Promise<NotificationItem[]> {
  await new Promise((r) => setTimeout(r, 400));
  return [...MOCK_NOTIFICATIONS];
}
