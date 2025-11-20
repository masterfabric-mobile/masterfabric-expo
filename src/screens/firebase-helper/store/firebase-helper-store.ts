import { create } from 'zustand';

interface FirebaseHelperState {
  lastEvent?: string;
  writeCount: number;
}

interface FirebaseHelperActions {
  setLastEvent: (event: string | undefined) => void;
  incrementWriteCount: () => void;
  resetSession: () => void;
}

export const useFirebaseHelperStore = create<FirebaseHelperState & FirebaseHelperActions>((set) => ({
  lastEvent: undefined,
  writeCount: 0,
  setLastEvent: (event) => set({ lastEvent: event }),
  incrementWriteCount: () => set((s) => ({ writeCount: s.writeCount + 1 })),
  resetSession: () => set({ lastEvent: undefined, writeCount: 0 }),
}));


