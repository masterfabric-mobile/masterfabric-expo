import { create } from 'zustand';
import { InAppMessage } from '../models/in-app-message-models';

interface InAppMessageState {
  currentMessage: InAppMessage | null;
  isVisible: boolean;
  isLoading: boolean;
}

interface InAppMessageStoreState extends InAppMessageState {
  // Actions
  setCurrentMessage: (message: InAppMessage | null) => void;
  showMessage: () => void;
  hideMessage: () => void;
  setLoading: (loading: boolean) => void;
}

const initialState: InAppMessageState = {
  currentMessage: null,
  isVisible: false,
  isLoading: false,
};

export const useInAppMessageStore = create<InAppMessageStoreState>((set) => ({
  ...initialState,

  setCurrentMessage: (message: InAppMessage | null) => {
    set({ currentMessage: message });
  },

  showMessage: () => {
    set({ isVisible: true });
  },

  hideMessage: () => {
    set({ isVisible: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

