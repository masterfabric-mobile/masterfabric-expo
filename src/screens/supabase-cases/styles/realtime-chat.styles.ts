import { StyleSheet } from 'react-native';

export const realtimeChatStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageBubbleSent: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageBubbleReceived: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageMeta: {
    marginTop: 4,
    fontSize: 11,
    opacity: 0.7,
  },
  editedLabel: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
    opacity: 0.8,
  },
  editContainer: {
    maxWidth: '80%',
    alignSelf: 'flex-end',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  editInput: {
    fontSize: 15,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 44,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 8,
  },
  dateLine: {
    flex: 1,
    height: 1,
  },
  dateText: {
    fontSize: 12,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  onlineUsersContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  onlineUsersContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  onlineUserItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  onlineUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  onlineUserAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  onlineUserName: {
    fontSize: 11,
    maxWidth: 60,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  typingText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  loadingOlderContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
