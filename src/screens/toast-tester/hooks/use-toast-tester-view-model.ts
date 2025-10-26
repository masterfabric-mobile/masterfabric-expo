import { toastHelper } from 'masterfabric-expo-core/src/helpers/toastHelper';
import { useState } from 'react';

export function useToastTesterViewModel() {
  const [title, setTitle] = useState('Test Title');
  const [subtitle, setSubtitle] = useState('This is a test message.');
  const [visibilityTime, setVisibilityTime] = useState('4000');
  const [position, setPosition] = useState<'top' | 'bottom'>('top');

  const isTopPosition = position === 'top';

  const togglePosition = () => {
    setPosition(isTopPosition ? 'bottom' : 'top');
  };

  const showCustomToast = (type: 'success' | 'error' | 'info') => {
    toastHelper.show({
      type: type,
      text1: title,
      text2: subtitle,
      visibilityTime: Number(visibilityTime) || 4000,
      position: position,
    });
  };

  return {
    // State
    title,
    subtitle,
    visibilityTime,
    position,
    isTopPosition,
    // Setters
    setTitle,
    setSubtitle,
    setVisibilityTime,
    // Actions
    togglePosition,
    showCustomToast,
  };
}
