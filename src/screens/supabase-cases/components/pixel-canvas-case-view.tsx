import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';
const CANVAS_SIZE = 1000;
const PIXEL_SIZE = 4; // Each pixel is 4x4 screen pixels for visibility
const SCREEN_WIDTH = Dimensions.get('window').width;

interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
  user_id: string | null;
  user_nickname: string;
  created_at: string;
}

interface PixelCanvasCaseViewProps {
  user: any | null;
  isConnected: boolean;
  onBack: () => void;
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

// Generate random color
const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#82E0AA',
    '#F1948A', '#85C1E9', '#F7DC6F', '#D7BDE2', '#AED6F1',
    '#A9DFBF', '#F9E79F', '#D5A6BD', '#A3E4D7', '#FAD7A0'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export function PixelCanvasCaseView({
  user,
  isConnected,
  onBack,
}: PixelCanvasCaseViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const [pixels, setPixels] = useState<Map<string, Pixel>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string>('');
  const [pixelCount, setPixelCount] = useState(0);
  const canvasRef = useRef<View>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!isConnected) {
      setError('Supabase is not connected');
      setIsLoading(false);
      return;
    }

    if (!user) {
      setError('Please sign in to play Pixel Canvas');
      setIsLoading(false);
      return;
    }

    // Generate nickname for user
    const nickname = generateNickname(user.id);
    setUserNickname(nickname);

    const initializeCanvas = async () => {
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

        // Fetch existing pixels
        const { data: existingPixels, error: fetchError } = await client
          .from('pixel_canvas')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000);

        if (fetchError) throw fetchError;

        // Convert to map for quick lookup
        const pixelMap = new Map<string, Pixel>();
        if (existingPixels) {
          existingPixels.forEach((pixel: Pixel) => {
            const key = `${pixel.x},${pixel.y}`;
            pixelMap.set(key, pixel);
          });
        }
        console.log('[PixelCanvas] Loaded', pixelMap.size, 'pixels from database');
        setPixels(pixelMap);
        setPixelCount(pixelMap.size);
        setIsLoading(false);

        // Subscribe to real-time changes
        const channel = client
          .channel('pixel_canvas_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'pixel_canvas',
            },
            (payload: any) => {
              console.log('[PixelCanvas] Real-time event:', payload.eventType, payload.new);
              if (payload.eventType === 'INSERT' && payload.new) {
                const newPixel = payload.new as Pixel;
                const key = `${newPixel.x},${newPixel.y}`;
                console.log('[PixelCanvas] Adding pixel:', key, newPixel.color);
                setPixels((prev) => {
                  const updated = new Map(prev);
                  updated.set(key, newPixel);
                  console.log('[PixelCanvas] Total pixels now:', updated.size);
                  return updated;
                });
                setPixelCount((prev) => prev + 1);
              } else if (payload.eventType === 'DELETE') {
                // Canvas was reset
                console.log('[PixelCanvas] Canvas reset detected');
                setPixels(new Map());
                setPixelCount(0);
              }
            }
          )
          .subscribe((status: string) => {
            console.log('[PixelCanvas] Subscription status:', status);
          });

        subscriptionRef.current = channel;

        return () => {
          if (subscriptionRef.current) {
            client.removeChannel(subscriptionRef.current);
          }
        };
      } catch (e: any) {
        console.error('[PixelCanvas] Error initializing:', e);
        setError(e?.message ?? String(e));
        setIsLoading(false);
      }
    };

    initializeCanvas();

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
  }, [isConnected, user]);

  const handleCanvasPress = async (event: any) => {
    if (!isConnected || !user || isLoading) return;

    try {
      const { locationX, locationY } = event.nativeEvent;
      
      // Convert screen coordinates to canvas coordinates
      const x = Math.floor(locationX / PIXEL_SIZE);
      const y = Math.floor(locationY / PIXEL_SIZE);
      
      // Ensure coordinates are within bounds
      if (x < 0 || x >= CANVAS_SIZE || y < 0 || y >= CANVAS_SIZE) return;

      // Check if pixel already exists
      const key = `${x},${y}`;
      if (pixels.has(key)) return; // Pixel already placed

      placePixel(x, y, key);
    } catch (e: any) {
      console.error('[PixelCanvas] Error handling touch:', e);
    }
  };

  const placePixel = async (x: number, y: number, key: string) => {
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

      const color = generateRandomColor();

      // Insert pixel
      const { error: insertError } = await client
        .from('pixel_canvas')
        .insert({
          x,
          y,
          color,
          user_id: user?.id,
          user_nickname: userNickname,
        });

      if (insertError) {
        // If it's a unique constraint error, pixel already exists
        if (insertError.code === '23505') {
          return; // Silently ignore
        }
        throw insertError;
      }

      // Optimistically update local state
      const newPixel: Pixel = {
        id: Date.now(),
        x,
        y,
        color,
        user_id: user?.id || null,
        user_nickname: userNickname,
        created_at: new Date().toISOString(),
      };
      
      console.log('[PixelCanvas] Placing pixel optimistically:', key, color, 'at', x, y);
      setPixels((prev) => {
        const updated = new Map(prev);
        updated.set(key, newPixel);
        console.log('[PixelCanvas] Pixel map updated, total:', updated.size);
        return updated;
      });
      setPixelCount((prev) => prev + 1);
    } catch (e: any) {
      console.error('[PixelCanvas] Error placing pixel:', e);
      setError(e?.message ?? String(e));
    }
  };

  if (!isConnected) {
    return (
      <ScrollView
        style={supabaseCasesScreenStyles.scrollView}
        contentContainerStyle={supabaseCasesScreenStyles.scrollContent}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
          </TouchableOpacity>
          <ThemedText
            type="subtitle"
            style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
          >
            Pixel Canvas
          </ThemedText>
        </View>
        <View
          style={[
            supabaseCasesScreenStyles.card,
            {
              borderColor: colors.surfaceBorder,
              backgroundColor: colors.surfaceBackground,
            },
          ]}
        >
          <ThemedText style={{ color: colors.bodyText }}>
            Supabase is not connected. Please connect to Supabase to play.
          </ThemedText>
        </View>
      </ScrollView>
    );
  }

  if (!user) {
    return (
      <ScrollView
        style={supabaseCasesScreenStyles.scrollView}
        contentContainerStyle={supabaseCasesScreenStyles.scrollContent}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
          </TouchableOpacity>
          <ThemedText
            type="subtitle"
            style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
          >
            Pixel Canvas
          </ThemedText>
        </View>
        <View
          style={[
            supabaseCasesScreenStyles.card,
            {
              borderColor: '#ef4444',
              backgroundColor: '#ef444410',
            },
          ]}
        >
          <Ionicons name="lock-closed" size={48} color="#ef4444" />
          <ThemedText
            style={{
              color: '#ef4444',
              fontWeight: '600',
              marginTop: 12,
              textAlign: 'center',
            }}
          >
            Authentication Required
          </ThemedText>
          <ThemedText
            style={{
              color: '#ef4444',
              fontSize: 14,
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            Please sign in to play Pixel Canvas
          </ThemedText>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ThemedText
            type="subtitle"
            style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
          >
            Pixel Canvas
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 13,
              color: colors.actionDescription,
              marginTop: 2,
            }}
          >
            {userNickname} • {pixelCount}/1000 pixels
          </ThemedText>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={supabaseGreen} />
          <ThemedText
            style={{
              color: colors.actionDescription,
              marginTop: 16,
            }}
          >
            Loading canvas...
          </ThemedText>
        </View>
      ) : error ? (
        <ScrollView
          style={supabaseCasesScreenStyles.scrollView}
          contentContainerStyle={supabaseCasesScreenStyles.scrollContent}
        >
          <View
            style={[
              supabaseCasesScreenStyles.card,
              {
                borderColor: '#ef4444',
                backgroundColor: '#ef444410',
              },
            ]}
          >
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <ThemedText
              style={{
                color: '#ef4444',
                fontWeight: '600',
                marginTop: 12,
                textAlign: 'center',
              }}
            >
              Error
            </ThemedText>
            <ThemedText
              style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              {error}
            </ThemedText>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Canvas Container */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ flex: 1 }}
            contentContainerStyle={{
              minWidth: CANVAS_SIZE * PIXEL_SIZE,
              minHeight: CANVAS_SIZE * PIXEL_SIZE,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              style={{ flex: 1 }}
            >
              <TouchableWithoutFeedback
                onPressIn={handleCanvasPress}
                delayPressIn={0}
              >
                <View
                  ref={canvasRef}
                  style={{
                    width: CANVAS_SIZE * PIXEL_SIZE,
                    height: CANVAS_SIZE * PIXEL_SIZE,
                    backgroundColor: colors.inputBackground || colors.surfaceBackground,
                    borderWidth: 1,
                    borderColor: colors.surfaceBorder,
                    position: 'relative',
                  }}
                >
                {pixels.size > 0 && (
                  <>
                    {Array.from(pixels.values()).map((pixel) => {
                      const left = pixel.x * PIXEL_SIZE;
                      const top = pixel.y * PIXEL_SIZE;
                      return (
                        <View
                          key={`${pixel.x},${pixel.y}`}
                          style={{
                            position: 'absolute',
                            left: left,
                            top: top,
                            width: PIXEL_SIZE,
                            height: PIXEL_SIZE,
                            backgroundColor: pixel.color,
                            borderWidth: 0,
                          }}
                        />
                      );
                    })}
                  </>
                )}
                {pixels.size === 0 && (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <ThemedText style={{ color: colors.actionDescription, textAlign: 'center' }}>
                      No pixels yet. Tap the canvas to place your first pixel!
                    </ThemedText>
                  </View>
                )}
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </ScrollView>
          
          {/* Instructions */}
          <View
            style={{
              padding: 16,
              backgroundColor: colors.surfaceBackground,
              borderTopWidth: 1,
              borderTopColor: colors.surfaceBorder,
            }}
          >
            <ThemedText
              style={{
                color: colors.bodyText,
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Touch the canvas to place a pixel! Scroll to explore the 1000×1000 canvas.
            </ThemedText>
            <ThemedText
              style={{
                color: colors.actionDescription,
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              When 1000 pixels are placed, the canvas resets automatically.
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

