// Navigation types for the application
export type RootStackParamList = {
  splash: undefined;
  '(tabs)': undefined;
  notifications: undefined;
  '+not-found': undefined;
};

export type TabParamList = {
  index: undefined;
  explore: undefined;
};

export type NavigationRoute = {
  name: keyof RootStackParamList;
  params?: RootStackParamList[keyof RootStackParamList];
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
