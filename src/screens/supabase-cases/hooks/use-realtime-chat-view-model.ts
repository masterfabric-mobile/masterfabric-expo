import { useCallback, useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id: number;
  user_id: string | null;
  user_nickname: string;
  message: string;
  created_at: string;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
  edited_at?: string | null;
  deleted_at?: string | null;
  is_edited?: boolean;
}

export interface OnlineUser {
  user_id: string;
  user_nickname: string;
  last_seen: string;
  is_typing: boolean;
  updated_at: string;
}

// Generate random lovely nickname
const generateNickname = (userId: string | null): string => {
  const adjectives = [
    'Happy', 'Sunny', 'Bright', 'Cheerful', 'Joyful', 'Lovely', 'Sweet', 'Kind',
    'Gentle', 'Warm', 'Cozy', 'Snug', 'Calm', 'Peaceful', 'Serene', 'Tranquil',
    'Magical', 'Wonderful', 'Amazing', 'Brilliant', 'Sparkly', 'Shiny', 'Glowing'
  ];
  const nouns = [
    'Star', 'Moon', 'Sun', 'Cloud', 'Flower', 'Butterfly', 'Bird', 'Rabbit',
    'Panda', 'Kitten', 'Puppy', 'Dolphin', 'Unicorn', 'Rainbow', 'Heart', 'Gem',
    'Crystal', 'Pearl', 'Diamond', 'Rose', 'Lily', 'Daisy', 'Tulip'
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = userId ? parseInt(userId.slice(0, 4), 16) % 1000 : Math.floor(Math.random() * 1000);
  
  return `${adj}${noun}${num}`;
};

export interface RealtimeChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingOlder: boolean;
  error: string | null;
  userNickname: string;
  onlineUsers: OnlineUser[];
  typingUsers: string[];
  hasMoreMessages: boolean;
}

export interface RealtimeChatActions {
  sendMessage: (message: string) => Promise<void>;
  editMessage: (messageId: number, newText: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  loadMessages: () => Promise<void>;
  loadOlderMessages: () => Promise<void>;
  setTyping: (isTyping: boolean) => Promise<void>;
}

export function useRealtimeChatViewModel(user: any | null, isConnected: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string>('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const subscriptionRef = useRef<any>(null);
  const onlineSubscriptionRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onlineHeartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const oldestMessageIdRef = useRef<number | null>(null);
  const userNicknameRef = useRef<string>('');
  const initializedRef = useRef<boolean>(false);
  const hasEnhancedColumnsRef = useRef<boolean | null>(null); // null = not checked, true/false = checked

  // Check if enhanced columns exist (migration 012)
  const checkEnhancedColumns = useCallback(async (client: any): Promise<boolean> => {
    if (hasEnhancedColumnsRef.current !== null) {
      return hasEnhancedColumnsRef.current;
    }

    try {
      // Try to query with deleted_at filter - if it fails, columns don't exist
      const { error } = await client
        .from('chat_messages')
        .select('id')
        .is('deleted_at', null)
        .limit(1);
      
      const hasColumns = !error || !error.message?.includes('does not exist');
      hasEnhancedColumnsRef.current = hasColumns;
      return hasColumns;
    } catch (e: any) {
      // If query fails, assume columns don't exist
      hasEnhancedColumnsRef.current = false;
      return false;
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!isConnected) {
      setError('Supabase is not connected');
      setIsLoading(false);
      return;
    }

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        throw new Error('Supabase is not available');
      }

      const client = supabase.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      // Check if enhanced columns exist
      const hasEnhancedColumns = await checkEnhancedColumns(client);

      // Fetch existing messages (order by created_at DESC, limit 20)
      let query = client
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Only filter deleted_at if column exists
      if (hasEnhancedColumns) {
        query = query.is('deleted_at', null);
      }

      const { data: existingMessages, error: fetchError } = await query;

      if (fetchError) {
        // If error is about missing column, retry without filter
        if (fetchError.message?.includes('deleted_at') && hasEnhancedColumns) {
          hasEnhancedColumnsRef.current = false;
          const { data: retryData, error: retryError } = await client
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
          if (retryError) throw retryError;
          const sortedMessages = ((retryData as ChatMessage[]) || []).sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setMessages(sortedMessages);
          setHasMoreMessages((retryData?.length || 0) === 20);
          if (sortedMessages.length > 0) {
            oldestMessageIdRef.current = sortedMessages[0].id;
          } else {
            oldestMessageIdRef.current = null;
          }
          setIsLoading(false);
          setError(null);
          return;
        }
        throw fetchError;
      }

      const sortedMessages = ((existingMessages as ChatMessage[]) || []).sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setMessages(sortedMessages);
      setHasMoreMessages((existingMessages?.length || 0) === 20);
      if (sortedMessages.length > 0) {
        // Set oldest message ID (first in chronological order)
        oldestMessageIdRef.current = sortedMessages[0].id;
      } else {
        oldestMessageIdRef.current = null;
      }
      setIsLoading(false);
      setError(null);
    } catch (e: any) {
      console.error('[RealtimeChat] Error loading messages:', e);
      setError(e?.message ?? String(e));
      setIsLoading(false);
    }
  }, [isConnected]);

  const loadOlderMessages = useCallback(async () => {
    if (!isConnected || isLoadingOlder || !hasMoreMessages || !oldestMessageIdRef.current) {
      return;
    }

    setIsLoadingOlder(true);
    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        throw new Error('Supabase is not available');
      }

      const client = supabase.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      // Check if enhanced columns exist
      const hasEnhancedColumns = await checkEnhancedColumns(client);

      // Load messages older than the oldest message we have
      let query = client
        .from('chat_messages')
        .select('*')
        .lt('id', oldestMessageIdRef.current)
        .order('created_at', { ascending: false })
        .limit(20);

      // Only filter deleted_at if column exists
      if (hasEnhancedColumns) {
        query = query.is('deleted_at', null);
      }

      const { data: olderMessages, error: fetchError } = await query;

      if (fetchError) {
        // If error is about missing column, retry without filter
        if (fetchError.message?.includes('deleted_at') && hasEnhancedColumns) {
          hasEnhancedColumnsRef.current = false;
          const { data: retryData, error: retryError } = await client
            .from('chat_messages')
            .select('*')
            .lt('id', oldestMessageIdRef.current)
            .order('created_at', { ascending: false })
            .limit(20);
          if (retryError) throw retryError;
          const sortedOlderMessages = ((retryData as ChatMessage[]) || []).sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          if (sortedOlderMessages.length > 0) {
            setMessages((prev) => [...sortedOlderMessages, ...prev]);
            oldestMessageIdRef.current = sortedOlderMessages[0].id;
            setHasMoreMessages(sortedOlderMessages.length === 20);
          } else {
            setHasMoreMessages(false);
          }
          setIsLoadingOlder(false);
          return;
        }
        throw fetchError;
      }

      const sortedOlderMessages = ((olderMessages as ChatMessage[]) || []).sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      if (sortedOlderMessages.length > 0) {
        setMessages((prev) => [...sortedOlderMessages, ...prev]);
        oldestMessageIdRef.current = sortedOlderMessages[0].id;
        setHasMoreMessages(sortedOlderMessages.length === 20);
      } else {
        setHasMoreMessages(false);
      }
      setIsLoadingOlder(false);
    } catch (e: any) {
      console.error('[RealtimeChat] Error loading older messages:', e);
      // Don't show error for older messages, just stop loading
      setIsLoadingOlder(false);
      setHasMoreMessages(false);
    }
  }, [isConnected, isLoadingOlder, hasMoreMessages, checkEnhancedColumns]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!isConnected || !messageText.trim()) {
      return;
    }

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        throw new Error('Supabase is not available');
      }

      const client = supabase.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const nickname = userNickname || userNicknameRef.current || generateNickname(user?.id || null);
      if (!userNickname) {
        setUserNickname(nickname);
        userNicknameRef.current = nickname;
      }

      // Optimistic update with sending status
      const tempId = -Date.now(); // Use negative ID to avoid conflicts
      const optimisticMessage: ChatMessage = {
        id: tempId,
        user_id: user?.id || null,
        user_nickname: nickname,
        message: messageText.trim(),
        created_at: new Date().toISOString(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      const { data: insertedData, error: insertError } = await client
        .from('chat_messages')
        .insert({
          user_id: user?.id || null,
          user_nickname: nickname,
          message: messageText.trim(),
          status: 'sent',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Replace optimistic message with real one
      if (insertedData) {
        setMessages((prev) => 
          prev.map((m) => m.id === tempId ? { ...insertedData, status: 'sent' } as ChatMessage : m)
        );
      }

      // Update status to delivered after a short delay (only if status column exists)
      if (insertedData && hasEnhancedColumnsRef.current) {
        setTimeout(async () => {
          try {
            await client
              .from('chat_messages')
              .update({ status: 'delivered' })
              .eq('id', insertedData.id);
          } catch (e: any) {
            // If status column doesn't exist, silently fail
            if (!e?.message?.includes('does not exist')) {
              console.error('[RealtimeChat] Error updating message status:', e);
            }
          }
        }, 500);
      }
    } catch (e: any) {
      console.error('[RealtimeChat] Error sending message:', e);
      // Provide user-friendly error messages
      let errorMessage = e?.message ?? String(e);
      if (errorMessage.includes('does not exist')) {
        errorMessage = 'Unable to send message. Database schema may need updates.';
      } else if (errorMessage.includes('permission denied') || errorMessage.includes('policy')) {
        errorMessage = 'Permission denied. Unable to send message.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      setError(errorMessage);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id < 0));
    }
  }, [isConnected, user, userNickname]);

  const editMessage = useCallback(async (messageId: number, newText: string) => {
    if (!isConnected || !newText.trim()) {
      return;
    }

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        throw new Error('Supabase is not available');
      }

      const client = supabase.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      // Check if enhanced columns exist
      const hasEnhancedColumns = await checkEnhancedColumns(client);

      // Optimistic update
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { 
                ...m, 
                message: newText.trim(), 
                ...(hasEnhancedColumns && {
                  is_edited: true, 
                  edited_at: new Date().toISOString()
                })
              }
            : m
        )
      );

      // Build update object based on available columns
      const updateData: any = { message: newText.trim() };
      if (hasEnhancedColumns) {
        updateData.edited_at = new Date().toISOString();
        updateData.is_edited = true;
      }

      const { error: updateError } = await client
        .from('chat_messages')
        .update(updateData)
        .eq('id', messageId);

      if (updateError) {
        // If error is about missing columns, retry with basic update
        if (updateError.message?.includes('does not exist') && hasEnhancedColumns) {
          hasEnhancedColumnsRef.current = false;
          const { error: retryError } = await client
            .from('chat_messages')
            .update({ message: newText.trim() })
            .eq('id', messageId);
          if (retryError) throw retryError;
          return;
        }
        throw updateError;
      }
    } catch (e: any) {
      console.error('[RealtimeChat] Error editing message:', e);
      // Provide user-friendly error messages
      let errorMessage = e?.message ?? String(e);
      if (errorMessage.includes('does not exist')) {
        errorMessage = 'Unable to edit message. Database schema may need updates.';
      } else if (errorMessage.includes('permission denied') || errorMessage.includes('policy')) {
        errorMessage = 'Permission denied. Unable to edit message.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      setError(errorMessage);
      // Reload messages on error to restore original state
      loadMessages();
    }
  }, [isConnected, loadMessages, checkEnhancedColumns]);

  const deleteMessage = useCallback(async (messageId: number) => {
    if (!isConnected) {
      return;
    }

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        throw new Error('Supabase is not available');
      }

      const client = supabase.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      // Check if enhanced columns exist
      const hasEnhancedColumns = await checkEnhancedColumns(client);

      // Optimistic update (remove from UI immediately)
      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      let deleteError: any = null;

      // Try soft delete first if columns exist, fallback to hard delete
      if (hasEnhancedColumns) {
        const { error: softDeleteError } = await client
          .from('chat_messages')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', messageId);
        
        if (softDeleteError) {
          // If deleted_at column doesn't exist, fallback to hard delete
          if (softDeleteError.message?.includes('deleted_at') || softDeleteError.message?.includes('does not exist')) {
            hasEnhancedColumnsRef.current = false;
            const { error: hardDeleteError } = await client
              .from('chat_messages')
              .delete()
              .eq('id', messageId);
            deleteError = hardDeleteError;
          } else {
            deleteError = softDeleteError;
          }
        }
      } else {
        // Hard delete if columns don't exist
        const { error: hardDeleteError } = await client
          .from('chat_messages')
          .delete()
          .eq('id', messageId);
        deleteError = hardDeleteError;
      }

      if (deleteError) {
        throw deleteError;
      }
    } catch (e: any) {
      console.error('[RealtimeChat] Error deleting message:', e);
      // Provide user-friendly error messages
      let errorMessage = e?.message ?? String(e);
      if (errorMessage.includes('does not exist')) {
        errorMessage = 'Unable to delete message. Database schema may need updates.';
      } else if (errorMessage.includes('permission denied') || errorMessage.includes('policy')) {
        errorMessage = 'Permission denied. Unable to delete message.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      setError(errorMessage);
      // Reload messages on error to restore deleted message
      loadMessages();
      // Re-throw so UI can handle it
      throw e;
    }
  }, [isConnected, loadMessages, checkEnhancedColumns]);

  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!isConnected || !userNickname) {
      return;
    }

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        return;
      }

      const client = supabase.getClient();
      if (!client) {
        return;
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Update typing status
      await client
        .from('chat_online_users')
        .upsert({
          user_id: user?.id || null,
          user_nickname: userNickname,
          is_typing: isTyping,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      // Auto-clear typing after 3 seconds
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false);
        }, 3000);
      }
    } catch (e: any) {
      console.error('[RealtimeChat] Error setting typing status:', e);
    }
  }, [isConnected, user, userNickname]);

  const updateOnlineStatus = useCallback(async () => {
    const currentNickname = userNicknameRef.current || userNickname;
    if (!isConnected || !currentNickname) {
      return;
    }

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        return;
      }

      const client = supabase.getClient();
      if (!client) {
        return;
      }

      await client
        .from('chat_online_users')
        .upsert({
          user_id: user?.id || null,
          user_nickname: currentNickname,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });
    } catch (e: any) {
      console.error('[RealtimeChat] Error updating online status:', e);
    }
  }, [isConnected, user]);

  const loadOnlineUsers = useCallback(async () => {
    if (!isConnected) {
      return;
    }

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        return;
      }

      const client = supabase.getClient();
      if (!client) {
        return;
      }

      // Get users active in last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: users, error: fetchError } = await client
        .from('chat_online_users')
        .select('*')
        .gte('last_seen', fiveMinutesAgo)
        .order('last_seen', { ascending: false });

      if (!fetchError && users) {
        setOnlineUsers(users as OnlineUser[]);
        // Extract typing users
        const typing = (users as OnlineUser[])
          .filter((u) => u.is_typing && u.user_id !== user?.id)
          .map((u) => u.user_nickname);
        setTypingUsers(typing);
      }
    } catch (e: any) {
      console.error('[RealtimeChat] Error loading online users:', e);
    }
  }, [isConnected, user]);

  useEffect(() => {
    if (!isConnected) {
      setError('Supabase is not connected');
      setIsLoading(false);
      initializedRef.current = false;
      return;
    }

    // Only initialize once per user/connection change
    if (!initializedRef.current) {
      // Generate nickname for user
      const nickname = generateNickname(user?.id || null);
      setUserNickname(nickname);
      userNicknameRef.current = nickname;
      initializedRef.current = true;
    }

    loadMessages();
    loadOnlineUsers();
    updateOnlineStatus();

    // Set up heartbeat for online status
    onlineHeartbeatRef.current = setInterval(() => {
      updateOnlineStatus();
    }, 30000); // Every 30 seconds

    // Subscribe to real-time changes
    const setupSubscriptions = async () => {
      try {
        const masterfabricCore = await import('masterfabric-expo-core');
        const supabase = (masterfabricCore as any).supabaseIntegration;
        
        if (!supabase || !supabase.isAvailable()) {
          return;
        }

        const client = supabase.getClient();
        if (!client) {
          return;
        }

        // Messages subscription
        const messagesChannel = client
          .channel('chat_messages_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'chat_messages',
            },
            (payload: any) => {
              console.log('[RealtimeChat] Real-time event:', payload.eventType, payload.new);
              if (payload.eventType === 'INSERT' && payload.new) {
                const newMessage = payload.new as ChatMessage;
                // Skip if deleted (only if deleted_at column exists and is set)
                if (newMessage.deleted_at) return;
                setMessages((prev) => {
                  // Check if message already exists to avoid duplicates
                  if (prev.some((m) => m.id === newMessage.id)) {
                    return prev;
                  }
                  // Replace optimistic message if exists (negative ID)
                  const hasOptimistic = prev.some((m) => m.id < 0);
                  if (hasOptimistic) {
                    return prev
                      .filter((m) => m.id >= 0)
                      .concat(newMessage)
                      .sort((a, b) => 
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                      );
                  }
                  return [...prev, newMessage].sort((a, b) => 
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                  );
                });
              } else if (payload.eventType === 'UPDATE' && payload.new) {
                const updatedMessage = payload.new as ChatMessage;
                // Remove if deleted (only if deleted_at column exists and is set)
                if (updatedMessage.deleted_at) {
                  setMessages((prev) => prev.filter((m) => m.id !== updatedMessage.id));
                } else {
                  setMessages((prev) =>
                    prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
                  );
                }
              } else if (payload.eventType === 'DELETE') {
                // Handle hard delete
                setMessages((prev) => prev.filter((m) => m.id !== payload.old?.id));
              }
            }
          )
          .subscribe((status: string) => {
            console.log('[RealtimeChat] Messages subscription status:', status);
          });

        subscriptionRef.current = messagesChannel;

        // Online users subscription
        const onlineChannel = client
          .channel('online_users_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'chat_online_users',
            },
            async (payload: any) => {
              console.log('[RealtimeChat] Online users event:', payload.eventType);
              await loadOnlineUsers();
            }
          )
          .subscribe((status: string) => {
            console.log('[RealtimeChat] Online users subscription status:', status);
          });

        onlineSubscriptionRef.current = onlineChannel;
      } catch (e: any) {
        console.error('[RealtimeChat] Error setting up subscriptions:', e);
      }
    };

    setupSubscriptions();

    return () => {
      if (subscriptionRef.current) {
        const masterfabricCore = require('masterfabric-expo-core');
        const supabase = (masterfabricCore as any).supabaseIntegration;
        if (supabase && supabase.isAvailable()) {
          const client = supabase.getClient();
          if (client) {
            client.removeChannel(subscriptionRef.current);
          }
        }
      }
      if (onlineSubscriptionRef.current) {
        const masterfabricCore = require('masterfabric-expo-core');
        const supabase = (masterfabricCore as any).supabaseIntegration;
        if (supabase && supabase.isAvailable()) {
          const client = supabase.getClient();
          if (client) {
            client.removeChannel(onlineSubscriptionRef.current);
          }
        }
      }
      if (onlineHeartbeatRef.current) {
        clearInterval(onlineHeartbeatRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      initializedRef.current = false;
    };
  }, [isConnected, user?.id, loadMessages, loadOnlineUsers, updateOnlineStatus]);

  const state: RealtimeChatState = {
    messages,
    isLoading,
    isLoadingOlder,
    error,
    userNickname,
    onlineUsers,
    typingUsers,
    hasMoreMessages,
  };

  const actions: RealtimeChatActions = {
    sendMessage,
    editMessage,
    deleteMessage,
    loadMessages,
    loadOlderMessages,
    setTyping,
  };

  return { state, actions };
}

