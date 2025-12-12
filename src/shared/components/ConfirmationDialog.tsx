import { BlurView } from 'expo-blur';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Button } from './button';
import { ThemedText } from './ThemedText';

export interface ConfirmationDialogProps {
  /**
   * Whether the dialog is visible
   */
  visible: boolean;
  
  /**
   * Title of the dialog
   */
  title: string;
  
  /**
   * Message/content to display in the dialog
   */
  message: string;
  
  /**
   * Label for the confirm button
   * @default 'Confirm'
   */
  confirmLabel?: string;
  
  /**
   * Label for the cancel button
   * @default 'Cancel'
   */
  cancelLabel?: string;
  
  /**
   * Variant for the confirm button
   * @default 'primary'
   */
  confirmVariant?: 'primary' | 'secondary' | 'outline';
  
  /**
   * Variant for the cancel button
   * @default 'outline'
   */
  cancelVariant?: 'primary' | 'secondary' | 'outline';
  
  /**
   * Whether the confirm action is destructive (e.g., delete)
   * When true, confirm button will use error color
   * @default false
   */
  destructive?: boolean;
  
  /**
   * Callback when confirm button is pressed
   */
  onConfirm: () => void;
  
  /**
   * Callback when cancel button is pressed or backdrop is tapped
   */
  onCancel: () => void;
  
  /**
   * Whether to show the cancel button
   * @default true
   */
  showCancel?: boolean;
  
  /**
   * Whether the dialog can be dismissed by tapping the backdrop
   * @default true
   */
  dismissible?: boolean;
}

/**
 * ConfirmationDialog Component
 * 
 * A reusable confirmation dialog component that works on both web and native platforms.
 * Provides a consistent UI for confirmation actions throughout the app.
 * 
 * @example
 * ```tsx
 * const [showDialog, setShowDialog] = useState(false);
 * 
 * <ConfirmationDialog
 *   visible={showDialog}
 *   title="Delete File"
 *   message="Are you sure you want to delete this file?"
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   destructive
 *   onConfirm={() => {
 *     // Handle delete
 *     setShowDialog(false);
 *   }}
 *   onCancel={() => setShowDialog(false)}
 * />
 * ```
 */
export function ConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  cancelVariant = 'outline',
  destructive = false,
  onConfirm,
  onCancel,
  showCancel = true,
  dismissible = true,
}: ConfirmationDialogProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { width, height } = useWindowDimensions();
  
  // Responsive calculations
  const isTablet = Math.min(width, height) >= 768;
  const isLandscape = width > height;
  const isSmallScreen = width < 375;
  
  // Calculate dialog width based on screen size
  const dialogWidth = isTablet 
    ? Math.min(width * 0.5, 500) 
    : isSmallScreen 
      ? width * 0.95 
      : width * 0.9;
  
  // Responsive padding
  const horizontalPadding = isTablet ? 24 : isSmallScreen ? 16 : 20;
  const verticalPadding = isTablet ? 24 : isSmallScreen ? 16 : 20;
  
  // Responsive font sizes
  const titleFontSize = isTablet ? 22 : isSmallScreen ? 18 : 20;
  const messageFontSize = isTablet ? 17 : isSmallScreen ? 15 : 16;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleBackdropPress = () => {
    if (dismissible) {
      handleCancel();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        {Platform.OS === 'web' ? (
          <View 
            style={[
              styles.blurView,
              {
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backdrop}
              activeOpacity={1}
              onPress={handleBackdropPress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            />
          </View>
        ) : (
          <BlurView 
            style={styles.blurView}
            intensity={50}
            tint={isDark ? 'dark' : 'light'}
          >
            <TouchableOpacity
              style={styles.backdrop}
              activeOpacity={1}
              onPress={handleBackdropPress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            />
          </BlurView>
        )}
        
        <View 
          style={[
            styles.dialogContainer,
            {
              backgroundColor: colors.surfaceBackground || colors.background,
              borderColor: colors.divider || colors.headerBorder,
              width: dialogWidth,
              maxWidth: isTablet ? 500 : '90%',
              minWidth: isSmallScreen ? width * 0.9 : width * 0.7,
            },
          ]}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel={title}
        >
          {/* Title */}
          <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
            <ThemedText 
              type="subtitle"
              style={[
                styles.title,
                { 
                  color: colors.sectionTitle || colors.text,
                  fontSize: titleFontSize,
                },
              ]}
            >
              {title}
            </ThemedText>
          </View>

          {/* Message */}
          <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
            <ThemedText 
              style={[
                styles.message,
                { 
                  color: colors.bodyText || colors.text,
                  fontSize: messageFontSize,
                },
              ]}
            >
              {message}
            </ThemedText>
          </View>

          {/* Actions */}
          <View 
            style={[
              styles.actions,
              { 
                paddingHorizontal: horizontalPadding,
                paddingVertical: verticalPadding,
                flexDirection: isLandscape && !isTablet ? 'row-reverse' : 'row',
              },
            ]}
          >
            {showCancel && (
              <View style={[styles.buttonContainer, { flex: isTablet ? 0 : 1 }]}>
                <Button
                  title={cancelLabel}
                  onPress={handleCancel}
                  variant={cancelVariant}
                  style={styles.button}
                  size={isSmallScreen ? 'small' : 'medium'}
                />
              </View>
            )}
            <View style={[styles.buttonContainer, { flex: isTablet ? 0 : 1 }]}>
              <Button
                title={confirmLabel}
                onPress={handleConfirm}
                variant={destructive ? 'secondary' : confirmVariant}
                style={styles.button}
                textStyle={destructive ? { color: '#FFFFFF' } : undefined}
                size={isSmallScreen ? 'small' : 'medium'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    flex: 1,
  },
  dialogContainer: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontWeight: '700',
  },
  content: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  message: {
    lineHeight: 22,
  },
  actions: {
    justifyContent: 'flex-end',
    gap: 12,
  },
  buttonContainer: {
    minWidth: 100,
  },
  button: {
    width: '100%',
  },
});

