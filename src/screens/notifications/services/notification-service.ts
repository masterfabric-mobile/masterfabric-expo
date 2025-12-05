import { supabaseIntegration } from 'masterfabric-expo-core';
import { NotificationItem, NotificationReadRow, NotificationRow, notificationRowToItem } from '../models/notification-models';

export interface NotificationServiceError {
  message: string;
  code?: string;
}

class NotificationService {
  private subscriptionChannel: any = null;

  /**
   * Fetch all public notifications from Supabase
   */
  async fetchNotifications(): Promise<NotificationRow[]> {
    if (!supabaseIntegration.isAvailable()) {
      throw new Error('Supabase is not available');
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await client
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[NotificationService] Error fetching notifications:', error);
      throw error;
    }

    return (data as NotificationRow[]) || [];
  }

  /**
   * Fetch read status for a specific user
   */
  async fetchUserReadStatus(userId: string): Promise<NotificationReadRow[]> {
    if (!supabaseIntegration.isAvailable()) {
      throw new Error('Supabase is not available');
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await client
      .from('notification_reads')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[NotificationService] Error fetching read status:', error);
      throw error;
    }

    return (data as NotificationReadRow[]) || [];
  }

  /**
   * Fetch notifications with read status for a user
   */
  async fetchNotificationsWithReadStatus(userId: string | null): Promise<NotificationItem[]> {
    try {
      const notifications = await this.fetchNotifications();
      
      if (!userId) {
        // If user is not authenticated, return all notifications as unread
        return notifications.map(row => notificationRowToItem(row, false));
      }

      const readStatuses = await this.fetchUserReadStatus(userId);
      const readSet = new Set(readStatuses.map(r => r.notification_id));

      return notifications.map(row => 
        notificationRowToItem(row, readSet.has(row.id))
      );
    } catch (error: any) {
      console.error('[NotificationService] Error fetching notifications with read status:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read for a user
   */
  async markAsRead(notificationId: number, userId: string): Promise<void> {
    if (!supabaseIntegration.isAvailable()) {
      throw new Error('Supabase is not available');
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    // Use upsert to handle case where read status already exists
    const { error } = await client
      .from('notification_reads')
      .upsert({
        user_id: userId,
        notification_id: notificationId,
        read_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,notification_id',
      });

    if (error) {
      console.error('[NotificationService] Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    if (!supabaseIntegration.isAvailable()) {
      throw new Error('Supabase is not available');
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    try {
      // Fetch all notification IDs
      const notifications = await this.fetchNotifications();
      const notificationIds = notifications.map(n => n.id);

      if (notificationIds.length === 0) {
        return;
      }

      // Insert read status for all notifications
      const reads = notificationIds.map(notificationId => ({
        user_id: userId,
        notification_id: notificationId,
        read_at: new Date().toISOString(),
      }));

      const { error } = await client
        .from('notification_reads')
        .upsert(reads, {
          onConflict: 'user_id,notification_id',
        });

      if (error) {
        console.error('[NotificationService] Error marking all as read:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('[NotificationService] Error in markAllAsRead:', error);
      throw error;
    }
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string | null): Promise<number> {
    if (!userId) {
      // If user is not authenticated, count all notifications as unread
      const notifications = await this.fetchNotifications();
      return notifications.length;
    }

    try {
      const notifications = await this.fetchNotifications();
      const readStatuses = await this.fetchUserReadStatus(userId);
      const readSet = new Set(readStatuses.map(r => r.notification_id));
      
      return notifications.filter(n => !readSet.has(n.id)).length;
    } catch (error: any) {
      console.error('[NotificationService] Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Subscribe to real-time notification updates
   */
  subscribeToNotifications(
    callback: (notification: NotificationItem) => void,
    userId: string | null
  ): () => void {
    if (!supabaseIntegration.isAvailable()) {
      console.warn('[NotificationService] Supabase not available, skipping real-time subscription');
      return () => {};
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      console.warn('[NotificationService] Supabase client not initialized, skipping real-time subscription');
      return () => {};
    }

    // Clean up existing subscription if any
    if (this.subscriptionChannel) {
      client.removeChannel(this.subscriptionChannel);
    }

    const channel = client
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        async (payload: any) => {
          try {
            const newNotification = payload.new as NotificationRow;
            const notificationItem = notificationRowToItem(
              newNotification,
              false // New notifications are unread by default
            );
            callback(notificationItem);
          } catch (error) {
            console.error('[NotificationService] Error processing real-time notification:', error);
          }
        }
      )
      .subscribe((status: string) => {
        console.log('[NotificationService] Real-time subscription status:', status);
      });

    this.subscriptionChannel = channel;

    // Return unsubscribe function
    return () => {
      if (this.subscriptionChannel) {
        client.removeChannel(this.subscriptionChannel);
        this.subscriptionChannel = null;
      }
    };
  }

  /**
   * Clean up subscriptions
   */
  cleanup(): void {
    if (this.subscriptionChannel && supabaseIntegration.isAvailable()) {
      const client = supabaseIntegration.getClient();
      if (client) {
        client.removeChannel(this.subscriptionChannel);
        this.subscriptionChannel = null;
      }
    }
  }
}

export const notificationService = new NotificationService();

