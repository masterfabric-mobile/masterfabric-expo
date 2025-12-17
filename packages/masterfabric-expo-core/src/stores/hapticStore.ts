import { create } from 'zustand';
import { HapticFeedbackState, HapticFeedbackType } from '../types/videoPlayerHaptic';
import { isHapticSupported } from '../helpers/videoPlayerHapticHelper';

interface HapticStore extends HapticFeedbackState {
  // Haptic actions
  setLastTriggeredHaptic: (type: HapticFeedbackType | null) => void;
  setHapticOnVideoEvents: (enabled: boolean) => void;
  resetHapticState: () => void;
  checkSupport: () => void;
}

const initialHapticState: HapticFeedbackState = {
  lastTriggered: null,
  hapticOnVideoEvents: false,
  isSupported: false, // Will be checked on initialization
};

export const useHapticStore = create<HapticStore>((set, get) => ({
  ...initialHapticState,

  // Haptic actions
  setLastTriggeredHaptic: (type: HapticFeedbackType | null) =>
    set({ lastTriggered: type }),

  setHapticOnVideoEvents: (enabled: boolean) =>
    set({ hapticOnVideoEvents: enabled }),

  resetHapticState: () =>
    set(initialHapticState),

  checkSupport: () => {
    const supported = isHapticSupported();
    set({ isSupported: supported });
  },
}));

