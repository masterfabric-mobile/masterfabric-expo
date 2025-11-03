declare module 'firebase/app' {
  export type FirebaseApp = any;
  export function initializeApp(config: any): FirebaseApp;
  export function getApps(): any[];
}

declare module 'firebase/auth' {
  export function getAuth(app?: any): any;
  export function initializeAuth(app: any, options?: any): any;
  export function getReactNativePersistence(storage: any): any;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signInAnonymously(auth: any): Promise<any>;
  export function sendPasswordResetEmail(auth: any, email: string): Promise<void>;
  export function signOut(auth: any): Promise<void>;
  export function onAuthStateChanged(auth: any, callback: (user: any | null) => void): () => void;
  export function signInWithCredential(auth: any, credential: any): Promise<any>;
  export class GoogleAuthProvider { constructor(); }
  export class OAuthProvider { constructor(providerId: string); credential(params: any): any; }
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
}

declare module 'firebase/firestore' {
  export function getFirestore(app?: any): any;
  export function collection(db: any, name: string): any;
  export function getDocs(colRef: any): Promise<any>;
  export function addDoc(colRef: any, data: any): Promise<any>;
  export function serverTimestamp(): any;
}

declare module 'firebase/storage' {
  export function getStorage(app?: any): any;
}

