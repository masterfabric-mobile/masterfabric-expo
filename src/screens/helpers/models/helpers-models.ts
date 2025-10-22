export interface HelperItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route?: string;
  available: boolean;
  category: string;
}

export interface HelperCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  available: boolean;
  helpers: HelperItem[];
}

export interface HelpersState {
  categories: HelperCategory[];
  isLoading: boolean;
}

