import { getCurrentLocale } from '@/src/shared/i18n';
import { supabaseIntegration } from 'masterfabric-expo-core';
import {
  InAppMessage,
  InAppMessageRow,
  inAppMessageRowToItem,
} from '../models/in-app-message-models';

export interface InAppMessageServiceError {
  message: string;
  code?: string;
}

class InAppMessageService {
  private subscriptionChannel: any = null;

  /**
   * Fetch active in-app messages from Supabase
   * Filters by active status, date range, target audience, and language
   * Excludes dismissed messages
   */
  async fetchActiveMessages(
    userId: string | null,
    deviceId: string
  ): Promise<InAppMessage[]> {
    if (!supabaseIntegration.isAvailable()) {
      throw new Error('Supabase is not available');
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const currentLanguage = getCurrentLocale();
    const now = new Date().toISOString();

    try {
      // Build query for active messages
      // Note: Date filtering is done in JavaScript for better reliability
      let query = client
        .from('in_app_messages')
        .select('*')
        .eq('is_active', true)
        .eq('language', currentLanguage);

      // Filter by target audience
      const targetAudienceFilter = userId
        ? ['all', 'authenticated']
        : ['all', 'unauthenticated'];
      query = query.in('target_audience', targetAudienceFilter);

      // Order by priority and created_at
      query = query
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('[InAppMessageService] Error fetching active messages:', error);
        throw error;
      }

      const messages = (data as InAppMessageRow[]) || [];

      // Filter by date range and dismissed messages
      const dismissedMessageIds = await this.getDismissedMessageIds(userId, deviceId);
      const activeMessages = messages.filter((msg) => {
        // Check date range
        const isInDateRange =
          (!msg.start_date || new Date(msg.start_date) <= new Date(now)) &&
          (!msg.end_date || new Date(msg.end_date) >= new Date(now));

        // Check if not dismissed
        const isNotDismissed = !dismissedMessageIds.has(msg.id);

        return isInDateRange && isNotDismissed;
      });

      return activeMessages.map(inAppMessageRowToItem);
    } catch (error: any) {
      console.error('[InAppMessageService] Error fetching active messages:', error);
      throw error;
    }
  }

  /**
   * Get set of dismissed message IDs for a user/device
   */
  private async getDismissedMessageIds(
    userId: string | null,
    deviceId: string
  ): Promise<Set<number>> {
    if (!supabaseIntegration.isAvailable()) {
      return new Set();
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      return new Set();
    }

    try {
      let query = client.from('in_app_message_dismissals').select('message_id');

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.eq('device_id', deviceId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[InAppMessageService] Error fetching dismissed messages:', error);
        return new Set();
      }

      const dismissals = (data as { message_id: number }[]) || [];
      return new Set(dismissals.map((d) => d.message_id));
    } catch (error) {
      console.error('[InAppMessageService] Error getting dismissed message IDs:', error);
      return new Set();
    }
  }

  /**
   * Mark a message as dismissed for a user/device
   */
  async markAsDismissed(
    messageId: number,
    userId: string | null,
    deviceId: string
  ): Promise<void> {
    if (!supabaseIntegration.isAvailable()) {
      throw new Error('Supabase is not available');
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    try {
      // First, check if dismissal already exists
      let query = client
        .from('in_app_message_dismissals')
        .select('id')
        .eq('message_id', messageId);

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.eq('device_id', deviceId);
      }

      const { data: existing } = await query;

      const dismissalData: {
        message_id: number;
        user_id?: string;
        device_id?: string;
      } = {
        message_id: messageId,
      };

      if (userId) {
        dismissalData.user_id = userId;
      } else {
        dismissalData.device_id = deviceId;
      }

      // If exists, update dismissed_at; otherwise insert
      if (existing && existing.length > 0) {
        const { error } = await client
          .from('in_app_message_dismissals')
          .update({ dismissed_at: new Date().toISOString() })
          .eq('id', existing[0].id);

        if (error) {
          console.error('[InAppMessageService] Error updating dismissal:', error);
          throw error;
        }
      } else {
        const { error } = await client
          .from('in_app_message_dismissals')
          .insert(dismissalData);

        if (error) {
          console.error('[InAppMessageService] Error inserting dismissal:', error);
          throw error;
        }
      }
    } catch (error: any) {
      console.error('[InAppMessageService] Error marking message as dismissed:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time in-app message updates
   */
  subscribeToMessages(
    callback: (message: InAppMessage) => void,
    userId: string | null
  ): () => void {
    if (!supabaseIntegration.isAvailable()) {
      console.warn('[InAppMessageService] Supabase not available, skipping real-time subscription');
      return () => {};
    }

    const client = supabaseIntegration.getClient();
    if (!client) {
      console.warn('[InAppMessageService] Supabase client not initialized, skipping real-time subscription');
      return () => {};
    }

    // Clean up existing subscription if any
    if (this.subscriptionChannel) {
      client.removeChannel(this.subscriptionChannel);
    }

    const channel = client
      .channel('in_app_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'in_app_messages',
        },
        async (payload: any) => {
          try {
            const newMessage = payload.new as InAppMessageRow;
            
            // Check if message is active and matches criteria
            const now = new Date().toISOString();
            const isActive = newMessage.is_active;
            const isInDateRange =
              (!newMessage.start_date || newMessage.start_date <= now) &&
              (!newMessage.end_date || newMessage.end_date >= now);
            const matchesAudience =
              newMessage.target_audience === 'all' ||
              (userId && newMessage.target_audience === 'authenticated') ||
              (!userId && newMessage.target_audience === 'unauthenticated');

            if (isActive && isInDateRange && matchesAudience) {
              const messageItem = inAppMessageRowToItem(newMessage);
              callback(messageItem);
            }
          } catch (error) {
            console.error('[InAppMessageService] Error processing real-time message:', error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'in_app_messages',
        },
        async (payload: any) => {
          try {
            const updatedMessage = payload.new as InAppMessageRow;
            
            // Check if message is now active and matches criteria
            const now = new Date().toISOString();
            const isActive = updatedMessage.is_active;
            const isInDateRange =
              (!updatedMessage.start_date || updatedMessage.start_date <= now) &&
              (!updatedMessage.end_date || updatedMessage.end_date >= now);
            const matchesAudience =
              updatedMessage.target_audience === 'all' ||
              (userId && updatedMessage.target_audience === 'authenticated') ||
              (!userId && updatedMessage.target_audience === 'unauthenticated');

            if (isActive && isInDateRange && matchesAudience) {
              const messageItem = inAppMessageRowToItem(updatedMessage);
              callback(messageItem);
            }
          } catch (error) {
            console.error('[InAppMessageService] Error processing real-time message update:', error);
          }
        }
      )
      .subscribe((status: string) => {
        console.log('[InAppMessageService] Real-time subscription status:', status);
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

export const inAppMessageService = new InAppMessageService();

