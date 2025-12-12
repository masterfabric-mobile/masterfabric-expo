import { ConfirmationDialog, ThemedText } from '@/src/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { ChatMessage, useRealtimeChatViewModel } from '../hooks/use-realtime-chat-view-model';
import { realtimeChatStyles } from '../styles/realtime-chat.styles';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';

interface RealtimeChatCaseViewProps {
  user: any | null;
  isConnected: boolean;
  onBack: () => void;
}

interface MessageGroup {
  date: string;
  dateLabel: string;
  messages: ChatMessage[];
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
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollOffsetRef = useRef(0);

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

  const handleKeyPress = (e: any) => {
    // Handle Enter key to send message
    // On web: Enter sends, Shift+Enter creates new line
    // On mobile: Enter sends message
    if (e.nativeEvent.key === 'Enter') {
      if (Platform.OS === 'web') {
        // On web, only send if Shift is not pressed
        if (!e.nativeEvent.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      } else {
        // On mobile, send on Enter press
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleEdit = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditText(message.message);
  };

  const handleSaveEdit = async () => {
    if (editingMessageId && editText.trim() && !isEditing) {
      setIsEditing(true);
      try {
        await actions.editMessage(editingMessageId, editText);
        setEditingMessageId(null);
        setEditText('');
        // Scroll to edited message after a short delay
        setTimeout(() => {
          const messageIndex = state.messages.findIndex(m => m.id === editingMessageId);
          if (messageIndex >= 0) {
            flatListRef.current?.scrollToIndex({ index: messageIndex, animated: true });
          }
        }, 100);
      } catch (error: any) {
        // Error is handled by view model (state.error will be set)
        // Keep edit mode open so user can retry or cancel
        // The error will be displayed in the error section
      } finally {
        setIsEditing(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText('');
  };

  const handleDeleteClick = (messageId: number) => {
    setDeletingMessageId(messageId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingMessageId && !isDeleting) {
      setIsDeleting(true);
      try {
        await actions.deleteMessage(deletingMessageId);
        setShowDeleteDialog(false);
        setDeletingMessageId(null);
      } catch (error: any) {
        // Error is handled by view model (state.error will be set)
        // Keep dialog open on error so user can retry or cancel
        // The error will be displayed in the error section
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeletingMessageId(null);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    if (dateStr === todayStr) {
      return 'Today';
    } else if (dateStr === yesterdayStr) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const groupMessagesByDate = useCallback((messages: ChatMessage[]): MessageGroup[] => {
    const groups: { [key: string]: ChatMessage[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.keys(groups)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        dateLabel: formatDate(groups[date][0].created_at),
        messages: groups[date],
      }));
  }, []);

  const groupedMessages = useMemo(() => groupMessagesByDate(state.messages), [state.messages, groupMessagesByDate]);

  const isOwnMessage = (messageUserId: string | null) => {
    return user && messageUserId === user.id;
  };

  const handleTyping = useCallback((text: string) => {
    setMessageText(text);
    
    // Debounce typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (text.trim().length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        actions.setTyping(true);
      }, 500);
    } else {
      actions.setTyping(false);
    }
  }, [actions]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      actions.setTyping(false);
    };
  }, [actions]);

  const renderMessageStatus = (message: ChatMessage, isOwn: boolean) => {
    if (!isOwn || !message.status) return null;

    switch (message.status) {
      case 'sending':
        return <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.7)" style={{ marginLeft: 4 }} />;
      case 'sent':
        return <Ionicons name="checkmark" size={14} color="rgba(255, 255, 255, 0.7)" style={{ marginLeft: 4 }} />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={14} color="rgba(255, 255, 255, 0.7)" style={{ marginLeft: 4 }} />;
      case 'failed':
        return <Ionicons name="alert-circle" size={14} color="#ef4444" style={{ marginLeft: 4 }} />;
      default:
        return null;
    }
  };

  const renderMessage = (message: ChatMessage, isOwn: boolean) => {
    if (editingMessageId === message.id) {
      return (
        <View style={realtimeChatStyles.messageContainer}>
          <View style={[realtimeChatStyles.editContainer, { backgroundColor: colors.surfaceBackground, borderColor: colors.surfaceBorder }]}>
            <TextInput
              style={[realtimeChatStyles.editInput, { color: colors.bodyText, borderColor: colors.surfaceBorder }]}
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
            />
            <View style={realtimeChatStyles.editActions}>
              <TouchableOpacity onPress={handleCancelEdit} style={realtimeChatStyles.editButton}>
                <ThemedText style={{ color: colors.actionDescription }}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                style={[realtimeChatStyles.editButton, { backgroundColor: supabaseGreen }]}
              >
                <ThemedText style={{ color: '#FFFFFF' }}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={realtimeChatStyles.messageContainer}
        onLongPress={() => {
          if (isOwn && !isEditing && !isDeleting) {
            // On web, use a better approach - show edit directly or delete dialog
            if (Platform.OS === 'web') {
              // For web, show a prompt to choose action
              const choice = window.prompt('Choose an action:\n1 = Edit\n2 = Delete\nCancel = Close', '1');
              if (choice === '1') {
                handleEdit(message);
              } else if (choice === '2') {
                handleDeleteClick(message.id);
              }
            } else {
              Alert.alert(
                'Message Options',
                'Choose an action',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Edit', onPress: () => handleEdit(message) },
                  { text: 'Delete', style: 'destructive', onPress: () => handleDeleteClick(message.id) },
                ]
              );
            }
          }
        }}
        activeOpacity={0.7}
      >
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
              {message.user_nickname}
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
            {message.message}
          </ThemedText>
          {message.is_edited && (
            <ThemedText
              style={[
                realtimeChatStyles.editedLabel,
                {
                  color: isOwn ? 'rgba(255, 255, 255, 0.6)' : colors.actionDescription,
                },
              ]}
            >
              (edited)
            </ThemedText>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: isOwn ? 'flex-end' : 'flex-start', marginTop: 4 }}>
            <ThemedText
              style={[
                realtimeChatStyles.messageMeta,
                {
                  color: isOwn ? 'rgba(255, 255, 255, 0.7)' : colors.actionDescription,
                },
              ]}
            >
              {formatTime(message.created_at)}
            </ThemedText>
            {renderMessageStatus(message, isOwn)}
          </View>
        </View>
      </TouchableOpacity>
    );
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

  const renderItem = ({ item }: { item: MessageGroup }) => (
    <View>
      <View style={realtimeChatStyles.dateHeader}>
        <View style={[realtimeChatStyles.dateLine, { backgroundColor: colors.surfaceBorder }]} />
        <ThemedText style={[realtimeChatStyles.dateText, { color: colors.actionDescription }]}>
          {item.dateLabel}
        </ThemedText>
        <View style={[realtimeChatStyles.dateLine, { backgroundColor: colors.surfaceBorder }]} />
      </View>
      {item.messages.map((message) => {
        const isOwn = isOwnMessage(message.user_id);
        return (
          <View key={message.id}>
            {renderMessage(message, isOwn)}
          </View>
        );
      })}
    </View>
  );

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
            backgroundColor: colors.surfaceBackground,
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <ThemedText
                style={{
                  fontSize: 13,
                  color: colors.actionDescription,
                }}
              >
                {state.userNickname} • {state.messages.length} messages
              </ThemedText>
              {state.onlineUsers.length > 0 && (
                <>
                  <ThemedText style={{ fontSize: 13, color: colors.actionDescription, marginHorizontal: 4 }}>•</ThemedText>
                  <Ionicons name="ellipse" size={8} color={supabaseGreen} style={{ marginRight: 4 }} />
                  <ThemedText style={{ fontSize: 13, color: colors.actionDescription }}>
                    {state.onlineUsers.length} online
                  </ThemedText>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Online Users List */}
        {state.onlineUsers.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[realtimeChatStyles.onlineUsersContainer, { backgroundColor: colors.surfaceBackground, borderBottomColor: colors.surfaceBorder }]}
            contentContainerStyle={realtimeChatStyles.onlineUsersContent}
          >
            {state.onlineUsers.map((onlineUser) => (
              <View key={onlineUser.user_id} style={realtimeChatStyles.onlineUserItem}>
                <View style={[realtimeChatStyles.onlineUserAvatar, { backgroundColor: supabaseGreen }]}>
                  <ThemedText style={realtimeChatStyles.onlineUserAvatarText}>
                    {onlineUser.user_nickname.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
                <ThemedText
                  style={[realtimeChatStyles.onlineUserName, { color: colors.bodyText }]}
                  numberOfLines={1}
                >
                  {onlineUser.user_nickname}
                </ThemedText>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Typing Indicator */}
        {state.typingUsers.length > 0 && (
          <View style={[realtimeChatStyles.typingIndicator, { backgroundColor: colors.surfaceBackground }]}>
            <ThemedText style={[realtimeChatStyles.typingText, { color: colors.actionDescription }]}>
              {state.typingUsers.join(', ')} {state.typingUsers.length === 1 ? 'is' : 'are'} typing...
            </ThemedText>
          </View>
        )}

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
              { justifyContent: 'center', alignItems: 'center', minHeight: 400, padding: 20 },
            ]}
          >
            <View
              style={[
                supabaseCasesScreenStyles.card,
                {
                  borderColor: '#ef4444',
                  backgroundColor: '#ef444410',
                  padding: 24,
                  alignItems: 'center',
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
                  fontSize: 18,
                }}
              >
                Unable to Load Chat
              </ThemedText>
              <ThemedText
                style={{
                  color: '#ef4444',
                  fontSize: 14,
                  marginTop: 8,
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                {state.error}
              </ThemedText>
              <TouchableOpacity
                onPress={() => actions.loadMessages()}
                style={{
                  marginTop: 20,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  backgroundColor: '#ef4444',
                  borderRadius: 8,
                }}
              >
                <ThemedText
                  style={{
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: 16,
                  }}
                >
                  Retry
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={groupedMessages}
              keyExtractor={(item) => item.date}
              renderItem={renderItem}
              contentContainerStyle={realtimeChatStyles.messagesList}
              onContentSizeChange={() => {
                if (groupedMessages.length > 0 && !state.isLoadingOlder && scrollOffsetRef.current === 0) {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: false });
                  }, 100);
                }
              }}
              onScroll={(event) => {
                scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
                // Load older messages when scrolling near top
                if (
                  event.nativeEvent.contentOffset.y < 100 &&
                  state.hasMoreMessages &&
                  !state.isLoadingOlder
                ) {
                  actions.loadOlderMessages();
                }
              }}
              scrollEventThrottle={400}
              ListHeaderComponent={
                state.isLoadingOlder ? (
                  <View style={realtimeChatStyles.loadingOlderContainer}>
                    <ActivityIndicator size="small" color={supabaseGreen} />
                  </View>
                ) : null
              }
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
              refreshControl={
                <RefreshControl
                  refreshing={state.isLoading && state.messages.length > 0}
                  onRefresh={actions.loadMessages}
                  tintColor={supabaseGreen}
                  colors={[supabaseGreen]}
                />
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
                onChangeText={handleTyping}
                placeholder="Type a message..."
                placeholderTextColor={colors.actionDescription}
                multiline
                onSubmitEditing={handleSend}
                returnKeyType="send"
                blurOnSubmit={false}
                onKeyPress={handleKeyPress}
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
        
        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          visible={showDeleteDialog}
          title="Delete Message"
          message="Are you sure you want to delete this message? This action cannot be undone."
          confirmLabel={isDeleting ? "Deleting..." : "Delete"}
          cancelLabel="Cancel"
          destructive
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          dismissible={!isDeleting}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
