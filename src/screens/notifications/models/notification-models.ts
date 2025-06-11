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
