import type { TextStyleObject } from 'masterfabric-expo-core';

export interface TypographyTestInput {
  fontSize: number;
  fontScale?: number;
  lineHeightMultiplier?: number;
  letterSpacing?: number;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  fontFamily?: string;
  textDecoration?: ('underline' | 'line-through')[];
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  containerWidth?: number;
  containerHeight?: number;
  text?: string;
  textColor?: string;
  stylePreset?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle' | 'body' | 'caption' | 'label' | 'custom';
}

export interface TypographyTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string | number;
  description: string;
}

export interface TypographyPreview {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: string | number;
  fontStyle: 'normal' | 'italic';
  fontFamily: string;
  textDecoration: string;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  previewText: string;
  textColor: string;
  completeStyle: TextStyleObject;
}

