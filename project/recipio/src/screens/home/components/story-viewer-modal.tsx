/**
 * Full-screen story "açılış" (opening) modal.
 * Opens when user taps a story section on home; no routing.
 * Shows section cover image + title with entrance animation; tap to close.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useI18n } from '@/shared/i18n';
import { getStorySectionById } from '../data/story-sections';

interface StoryViewerModalProps {
  sectionId: string | null;
  onClose: () => void;
}

export function StoryViewerModal({ sectionId, onClose }: StoryViewerModalProps) {
  const { t } = useI18n();
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const section = sectionId ? getStorySectionById(sectionId) : null;
  const visible = !!section;

  useEffect(() => {
    if (!visible) return;
    scale.setValue(0.92);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 12,
        tension: 80,
      }),
    ]).start();
  }, [visible, scale, opacity]);

  if (!section) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[styles.content, { opacity, transform: [{ scale }] }]}
          pointerEvents="box-none"
        >
          <Pressable onPress={onClose} style={styles.imageWrap}>
            <Image
              source={{ uri: section.coverImage }}
              style={styles.coverImage}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <Text style={styles.title}>
              {t(section.titleKey as 'home.stories.mostViewed')}
            </Text>
          </Pressable>
        </Animated.View>
        <Pressable
          style={styles.closeBtn}
          onPress={onClose}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 9 / 16,
    maxHeight: '75%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
});
