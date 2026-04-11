/**
 * Confirmation modal for web (and optional native).
 * Use for destructive or important confirmations instead of Alert/window.confirm.
 * Responsive: adapts width and padding to screen size.
 * Web-safe: avoids useWindowDimensions/Dimensions on web to prevent "Dimensions is not defined" / "HORIZONTAL_MARGIN is not defined".
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';

const MODAL_MAX_WIDTH = 400;
const MIN_SIDE_MARGIN = 20;
const HORIZONTAL_MARGIN = MIN_SIDE_MARGIN;
const MIN_MODAL_WIDTH = 280;
const BUTTON_STACK_BREAKPOINT = 320;
const MAX_WIDTH_PERCENT = 0.9;

function getWindowSize(): { width: number; height: number } {
  if (typeof window !== 'undefined') {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  try {
    const { Dimensions } = require('react-native');
    const { width, height } = Dimensions.get('window');
    return { width, height };
  } catch {
    return { width: 400, height: 600 };
  }
}

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  /** Optional: use for destructive actions (e.g. red confirm button) */
  destructive?: boolean;
}

export function ConfirmModal({
  visible,
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  destructive = false,
}: ConfirmModalProps) {
  const colors = useRecipioColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        box: {
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
        },
        title: {
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 8,
        },
        message: {
          fontSize: 15,
          color: colors.textSecondary,
          lineHeight: 22,
          marginBottom: 24,
        },
        actions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 12,
        },
        actionsStacked: {
          flexDirection: 'column',
          alignItems: 'stretch',
        },
        button: {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          minWidth: 88,
          alignItems: 'center',
        },
        buttonPressed: {
          opacity: 0.8,
        },
        cancelButton: {
          backgroundColor: colors.border,
        },
        cancelButtonText: {
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
        },
        confirmButton: {
          backgroundColor: colors.primaryAccent,
        },
        confirmButtonText: {
          fontSize: 15,
          fontWeight: '600',
          color: '#FFFFFF',
        },
        confirmButtonDestructive: {
          backgroundColor: colors.error,
        },
        confirmButtonTextDestructive: {
          fontSize: 15,
          fontWeight: '600',
          color: '#FFFFFF',
        },
      }),
    [colors]
  );
  const dimensions = useWindowDimensions();
  const [webSize, setWebSize] = useState(getWindowSize);
  const windowWidth =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? webSize.width
      : dimensions.width;
  const windowHeight =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? webSize.height
      : dimensions.height;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onResize = () => setWebSize(getWindowSize());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sideMargin = Math.max(MIN_SIDE_MARGIN, Math.min(24, Math.round(windowWidth * 0.05)));
  const availableWidth = windowWidth - sideMargin * 2;
  const modalWidth = Math.min(
    availableWidth,
    Math.max(MIN_MODAL_WIDTH, Math.min(availableWidth, windowWidth * MAX_WIDTH_PERCENT)),
    MODAL_MAX_WIDTH
  );
  const verticalMargin = Math.max(16, Math.min(32, windowHeight * 0.05));
  const modalMaxHeight = windowHeight - verticalMargin * 2;
  const boxPadding = Math.max(16, Math.min(24, Math.round(windowWidth * 0.05)));
  const stackButtons = modalWidth < BUTTON_STACK_BREAKPOINT;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable
        style={[styles.backdrop, { padding: sideMargin, paddingVertical: verticalMargin }]}
        onPress={onCancel}
      >
        <Pressable
          style={[
            styles.box,
            {
              width: modalWidth,
              maxWidth: availableWidth,
              maxHeight: modalMaxHeight,
              padding: boxPadding,
              alignSelf: 'center',
            },
          ]}
          onPress={() => {}}
        >
          <ScrollView
            style={{ maxHeight: Math.max(140, modalMaxHeight - boxPadding * 2) }}
            contentContainerStyle={{ flexGrow: 0 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={[styles.actions, stackButtons && styles.actionsStacked]}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  destructive ? styles.confirmButtonDestructive : styles.confirmButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onConfirm}
              >
                <Text
                  style={
                    destructive
                      ? styles.confirmButtonTextDestructive
                      : styles.confirmButtonText
                  }
                >
                  {confirmText}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
