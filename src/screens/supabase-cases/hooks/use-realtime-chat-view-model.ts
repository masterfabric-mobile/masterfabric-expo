import { useCallback, useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id: number;
  user_id: string | null;
  user_nickname: string;
  message: string;
  created_at: string;
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
  error: string | null;
  userNickname: string;
}

export interface RealtimeChatActions {
  sendMessage: (message: string) => Promise<void>;
  loadMessages: () => Promise<void>;
}

export function useRealtimeChatViewModel(user: any | null, isConnected: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string>('');
  const subscriptionRef = useRef<any>(null);

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

      // Fetch existing messages
      const { data: existingMessages, error: fetchError } = await client
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (fetchError) throw fetchError;

      setMessages((existingMessages as ChatMessage[]) || []);
      setIsLoading(false);
      setError(null);
    } catch (e: any) {
      console.error('[RealtimeChat] Error loading messages:', e);
      setError(e?.message ?? String(e));
      setIsLoading(false);
    }
  }, [isConnected]);

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

      const nickname = userNickname || generateNickname(user?.id || null);
      if (!userNickname) {
        setUserNickname(nickname);
      }

      const { error: insertError } = await client
        .from('chat_messages')
        .insert({
          user_id: user?.id || null,
          user_nickname: nickname,
          message: messageText.trim(),
        });

      if (insertError) {
        throw insertError;
      }
    } catch (e: any) {
      console.error('[RealtimeChat] Error sending message:', e);
      setError(e?.message ?? String(e));
    }
  }, [isConnected, user, userNickname]);

  useEffect(() => {
    if (!isConnected) {
      setError('Supabase is not connected');
      setIsLoading(false);
      return;
    }

    // Generate nickname for user
    const nickname = generateNickname(user?.id || null);
    setUserNickname(nickname);

    loadMessages();

    // Subscribe to real-time changes
    const setupSubscription = async () => {
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

        const channel = client
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
                setMessages((prev) => {
                  // Check if message already exists to avoid duplicates
                  if (prev.some((m) => m.id === newMessage.id)) {
                    return prev;
                  }
                  return [...prev, newMessage].sort((a, b) => 
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                  );
                });
              }
            }
          )
          .subscribe((status: string) => {
            console.log('[RealtimeChat] Subscription status:', status);
          });

        subscriptionRef.current = channel;
      } catch (e: any) {
        console.error('[RealtimeChat] Error setting up subscription:', e);
      }
    };

    setupSubscription();

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
    };
  }, [isConnected, user, loadMessages]);

  const state: RealtimeChatState = {
    messages,
    isLoading,
    error,
    userNickname,
  };

  const actions: RealtimeChatActions = {
    sendMessage,
    loadMessages,
  };

  return { state, actions };
}

