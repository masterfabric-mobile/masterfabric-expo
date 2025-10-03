import { Alert, AppState, AppStateStatus, Linking, Platform } from 'react-native';

type ConnectivityListener = (online: boolean) => void;

class ConnectivityHelper {
  private static instance: ConnectivityHelper;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isOnline: boolean | null = null;
  private alertVisible = false;
  private appState: AppStateStatus = AppState.currentState;
  private listeners: Set<ConnectivityListener> = new Set();
  private appStateSubscription: { remove: () => void } | null = null;

  private constructor() {
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  static getInstance(): ConnectivityHelper {
    if (!ConnectivityHelper.instance) {
      ConnectivityHelper.instance = new ConnectivityHelper();
    }
    return ConnectivityHelper.instance;
  }

  start(pollIntervalMs: number = 5000) {
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange) as unknown as { remove: () => void };
    if (this.appState === 'active') {
      this.beginPolling(pollIntervalMs);
    }
  }

  stop() {
    if (this.appStateSubscription) {
      try { this.appStateSubscription.remove(); } catch {}
      this.appStateSubscription = null;
    }
    this.endPolling();
    this.alertVisible = false;
  }

  onChange(listener: ConnectivityListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async checkNow(): Promise<boolean> {
    const ok = await this.getOnline();
    this.updateState(ok);
    if (!ok) {
      this.showOfflineAlert();
    }
    return ok;
  }

  private beginPolling(pollIntervalMs: number) {
    if (this.intervalId) return;
    this.checkNow();
    this.intervalId = setInterval(() => this.checkNow(), pollIntervalMs);
  }

  private endPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async getOnline(): Promise<boolean> {
    try {
      let Network: any = null;
      try {
        const moduleName = 'expo-' + 'network';
        // @ts-ignore - dynamic import with computed string
        Network = await import(moduleName);
      } catch {}
      if (Network?.getNetworkStateAsync) {
        const state = await Network.getNetworkStateAsync();
        if (typeof state.isInternetReachable === 'boolean') {
          return !!state.isInternetReachable;
        }
        return !!state.isConnected;
      }
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 2000);
        const resp = await fetch('https://clients3.google.com/generate_204', { method: 'HEAD', signal: controller.signal });
        clearTimeout(id);
        return resp.ok;
      } catch {}
      // @ts-ignore
      if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
        // @ts-ignore
        return navigator.onLine;
      }
      return false;
    } catch {
      return false;
    }
  }

  private updateState(nextOnline: boolean) {
    if (this.isOnline === nextOnline) return;
    this.isOnline = nextOnline;
    this.listeners.forEach(l => { try { l(nextOnline); } catch {} });
  }

  private showOfflineAlert() {
    if (this.alertVisible) return;
    this.alertVisible = true;
    Alert.alert(
      'No Internet Connection',
      'You are currently offline. Please check your connection.',
      [
        {
          text: 'Settings',
          onPress: async () => {
            try {
              if (typeof Linking.openSettings === 'function') {
                await Linking.openSettings();
              } else if (Platform.OS === 'ios') {
                await Linking.openURL('app-settings:');
              }
            } catch {}
          }
        },
        {
          text: 'Check again',
          onPress: async () => {
            const ok = await this.checkNow();
            this.alertVisible = false;
            if (!ok) {
              this.showOfflineAlert();
            }
          }
        }
      ],
      { cancelable: false }
    );
  }

  private handleAppStateChange(nextState: AppStateStatus) {
    const prev = this.appState;
    this.appState = nextState;
    if (nextState === 'active') {
      this.beginPolling(5000);
    } else if (prev === 'active' && (nextState === 'background' || nextState === 'inactive')) {
      this.endPolling();
      this.alertVisible = false;
    }
  }
}

export const connectivityHelper = ConnectivityHelper.getInstance();


