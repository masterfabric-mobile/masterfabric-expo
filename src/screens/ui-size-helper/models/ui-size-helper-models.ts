export interface UISizeTestInput {
  spacingSize: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
  paddingSize: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
  marginSize: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';
  gapSize: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  borderRadius: 'small' | 'large';
  borderWidth: 's' | 'm' | 'l';
  buttonHeight: 'small' | 'medium' | 'large';
  inputHeight: 'small' | 'medium' | 'large';
  cardPadding: 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl';
  scrollPadding: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  scrollMargin: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  deviceType?: 'phone' | 'tablet' | 'desktop';
  screenWidth?: number;
}

export interface UISizeTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string | number;
  description: string;
  category: 'spacing' | 'responsive' | 'calculation' | 'device';
}

export interface UISizePreview {
  spacing: number;
  padding: number;
  margin: number;
  gap: number;
  borderRadius: number;
  borderWidth: number;
  buttonHeight: number;
  inputHeight: number;
  cardPadding: number;
  scrollPadding: number;
  scrollMargin: number;
  deviceType: 'phone' | 'tablet' | 'desktop';
  columns: number;
  baseUnit: number;
}

