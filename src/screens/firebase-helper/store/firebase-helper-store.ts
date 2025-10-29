import { create } from 'zustand';

interface FirebaseHelperState {
  lastEvent?: string;
}

interface FirebaseHelperActions {
  setLastEvent: (event: string | undefined) => void;
}

export const useFirebaseHelperStore = create<FirebaseHelperState & FirebaseHelperActions>((set) => ({
  lastEvent: undefined,
  setLastEvent: (event) => set({ lastEvent: event }),
}));


