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
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1262326c-4a52-497e-b35a-0ce16a89b752',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'in-app-message-service.ts:markAsDismissed',message:'Mark as dismissed start',data:{messageId,userId,deviceId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Check if dismissal already exists
      let query = client
        .from('in_app_message_dismissals')
        .select('id')
        .eq('message_id', messageId);

      if (userId) {
        query = query.eq('user_id', userId).is('device_id', null);
      } else {
        query = query.eq('device_id', deviceId).is('user_id', null);
      }

      const { data: existingDismissal, error: selectError } = await query;

      if (selectError) {
        console.error('[InAppMessageService] Error checking existing dismissal:', selectError);
        throw selectError;
      }

      const dismissedAt = new Date().toISOString();

      if (existingDismissal && existingDismissal.length > 0) {
        // Update existing dismissal
        const { error: updateError } = await client
          .from('in_app_message_dismissals')
          .update({ dismissed_at: dismissedAt })
          .eq('id', existingDismissal[0].id);

        if (updateError) {
          console.error('[InAppMessageService] Error updating dismissal:', updateError);
          throw updateError;
        }
      } else {
        // Insert new dismissal
        const dismissalData: {
          message_id: number;
          user_id?: string;
          device_id?: string;
          dismissed_at: string;
        } = {
          message_id: messageId,
          dismissed_at: dismissedAt,
        };

        if (userId) {
          dismissalData.user_id = userId;
        } else {
          dismissalData.device_id = deviceId;
        }

        const { error: insertError } = await client
          .from('in_app_message_dismissals')
          .insert(dismissalData);

        if (insertError) {
          // Handle unique constraint violation (23505) or conflict (42P10) - race condition
          if (insertError.code === '23505' || insertError.code === '42P10') {
            console.log('[InAppMessageService] Message already dismissed (race condition), ignoring duplicate');
            // Message is already dismissed, which is the desired state - no need to throw
            return;
          }
          console.error('[InAppMessageService] Error inserting dismissal:', insertError);
          throw insertError;
        }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1262326c-4a52-497e-b35a-0ce16a89b752',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'in-app-message-service.ts:markAsDismissed',message:'Mark as dismissed success',data:{messageId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/1262326c-4a52-497e-b35a-0ce16a89b752',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'in-app-message-service.ts:markAsDismissed',message:'Catch error',data:{messageId,errorCode:error?.code,errorMessage:error?.message,isUniqueConstraint:error?.code === '23505' || error?.code === '42P10'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Handle unique constraint violation at catch level too (in case check above didn't catch it)
      if (error?.code === '23505' || error?.code === '42P10') {
        console.log('[InAppMessageService] Message already dismissed (race condition), ignoring duplicate insert');
        // Message is already dismissed, which is the desired state - no need to throw
        return;
      }
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

