import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useRealtimeChatViewModel } from '../hooks/use-realtime-chat-view-model';
import { realtimeChatStyles } from '../styles/realtime-chat.styles';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';

interface RealtimeChatCaseViewProps {
  user: any | null;
  isConnected: boolean;
  onBack: () => void;
}

export function RealtimeChatCaseView({
  user,
  isConnected,
  onBack,
}: RealtimeChatCaseViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { state, actions } = useRealtimeChatViewModel(user, isConnected);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (messageText.trim()) {
      await actions.sendMessage(messageText);
      setMessageText('');
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOwnMessage = (messageUserId: string | null) => {
    return user && messageUserId === user.id;
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
            Realtime Chat
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
            Supabase is not connected. Please connect to Supabase to use chat.
          </ThemedText>
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.surfaceBorder,
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
              Realtime Chat
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 13,
                color: colors.actionDescription,
                marginTop: 2,
              }}
            >
              {state.userNickname} • {state.messages.length} messages
            </ThemedText>
          </View>
        </View>

        {state.isLoading && state.messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={supabaseGreen} />
            <ThemedText
              style={{
                color: colors.actionDescription,
                marginTop: 16,
              }}
            >
              Loading messages...
            </ThemedText>
          </View>
        ) : state.error ? (
          <ScrollView
            style={supabaseCasesScreenStyles.scrollView}
            contentContainerStyle={[
              supabaseCasesScreenStyles.scrollContent,
              { justifyContent: 'center', alignItems: 'center', minHeight: 400 },
            ]}
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
                {state.error}
              </ThemedText>
            </View>
          </ScrollView>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={state.messages}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={realtimeChatStyles.messagesList}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }}
              renderItem={({ item }) => {
                const isOwn = isOwnMessage(item.user_id);
                return (
                  <View style={realtimeChatStyles.messageContainer}>
                    <View
                      style={[
                        realtimeChatStyles.messageBubble,
                        isOwn ? realtimeChatStyles.messageBubbleSent : realtimeChatStyles.messageBubbleReceived,
                        {
                          backgroundColor: isOwn
                            ? supabaseGreen
                            : colors.surfaceBackground,
                          borderWidth: isOwn ? 0 : 1,
                          borderColor: colors.surfaceBorder,
                        },
                      ]}
                    >
                      {!isOwn && (
                        <ThemedText
                          style={[
                            realtimeChatStyles.messageMeta,
                            { color: colors.actionDescription },
                            { marginBottom: 4 },
                          ]}
                        >
                          {item.user_nickname}
                        </ThemedText>
                      )}
                      <ThemedText
                        style={[
                          realtimeChatStyles.messageText,
                          {
                            color: isOwn ? '#FFFFFF' : colors.bodyText,
                          },
                        ]}
                      >
                        {item.message}
                      </ThemedText>
                      <ThemedText
                        style={[
                          realtimeChatStyles.messageMeta,
                          {
                            color: isOwn ? 'rgba(255, 255, 255, 0.7)' : colors.actionDescription,
                            textAlign: isOwn ? 'right' : 'left',
                          },
                        ]}
                      >
                        {formatTime(item.created_at)}
                      </ThemedText>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={realtimeChatStyles.emptyState}>
                  <Ionicons name="chatbubbles-outline" size={64} color={colors.actionDescription} />
                  <ThemedText
                    style={{
                      color: colors.actionDescription,
                      fontSize: 16,
                      marginTop: 12,
                      textAlign: 'center',
                    }}
                  >
                    No messages yet. Start the conversation!
                  </ThemedText>
                </View>
              }
            />

            {/* Input Container */}
            <View
              style={[
                realtimeChatStyles.inputContainer,
                {
                  backgroundColor: colors.surfaceBackground,
                  borderTopColor: colors.surfaceBorder,
                },
              ]}
            >
              <TextInput
                style={[
                  realtimeChatStyles.input,
                  {
                    backgroundColor: colors.inputBackground || colors.surfaceBackground,
                    color: colors.bodyText,
                    borderWidth: 1,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type a message..."
                placeholderTextColor={colors.actionDescription}
                multiline
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!messageText.trim()}
                style={[
                  realtimeChatStyles.sendButton,
                  {
                    backgroundColor: messageText.trim() ? supabaseGreen : colors.surfaceBorder,
                  },
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={messageText.trim() ? '#FFFFFF' : colors.actionDescription}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

