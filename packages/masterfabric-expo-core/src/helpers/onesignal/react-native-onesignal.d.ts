/**
 * Minimal type declaration for react-native-onesignal when used as optional peer.
 * Install react-native-onesignal in the app for full types and runtime.
 */
declare module 'react-native-onesignal' {
  export function initialize(appId: string): void;
  export function login(externalId: string): Promise<void>;
  export function logout(): Promise<void>;
  export const Debug: {
    setLogLevel?(level: number): void;
  };
  export const LogLevel: { Verbose?: number };
  export const Notifications: {
    requestPermission(fallback?: boolean): Promise<boolean>;
    getPermissionAsync(): Promise<boolean>;
    canRequestPermission?(): Promise<boolean>;
    addEventListener?(
      event: string,
      handler: (...args: unknown[]) => void
    ): () => void;
  };
  export const User: {
    pushSubscription?: {
      id?: string | (() => Promise<string>);
      token?: string | (() => Promise<string>);
      optedIn?: boolean;
      optIn?(): Promise<void>;
      optOut?(): Promise<void>;
    };
  };
}
