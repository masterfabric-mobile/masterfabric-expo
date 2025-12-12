export type NotificationTab = 'all' | 'app' | 'system';

export interface TabItem {
  key: NotificationTab;
  label: string;
}

export interface NotificationTabsProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
}

export interface ScaffoldMessageState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface NotificationScreenProps {
  // Add any props if needed in the future
}

export interface NotificationActionBarProps {
  onMarkAllRead: () => void;
  onClearAll: () => void;
  hasNotifications: boolean;
}

export interface NotificationEmptyStateProps {
  activeTab: NotificationTab;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  category: string;
  icon?: string;
  language?: string;
}

export interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export interface NotificationFilter {
  type?: NotificationItem['type'];
  category?: string;
  isRead?: boolean;
}

export interface NotificationItemProps {
  notification: NotificationItem;
  onPress: (notification: NotificationItem) => void;
  onDelete?: (notification: NotificationItem) => void;
}

export interface GestureContext extends Record<string, unknown> {
  startX: number;
}

// Database schema interfaces
export interface NotificationRow {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: string;
  icon: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationReadRow {
  id: number;
  user_id: string;
  notification_id: number;
  read_at: string;
}

// Helper function to convert database row to NotificationItem
export function notificationRowToItem(
  row: NotificationRow,
  isRead: boolean = false
): NotificationItem {
  return {
    id: row.id.toString(),
    title: row.title,
    message: row.message,
    timestamp: new Date(row.created_at),
    isRead,
    type: row.type,
    category: row.category,
    icon: row.icon || undefined,
    language: row.language,
  };
}
