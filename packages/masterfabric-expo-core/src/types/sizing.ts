import { Sizing } from '../constants/Sizing';

export type SpacingSize = keyof typeof Sizing.spacing;
export type PaddingSize = keyof typeof Sizing.padding;
export type MarginSize = keyof typeof Sizing.margin;
export type GapSize = keyof typeof Sizing.gap;
export type BorderRadiusSize = keyof typeof Sizing.borderRadius;
export type BorderWidthSize = keyof typeof Sizing.borderWidth;
export type IconSize = keyof typeof Sizing.icon;
export type AvatarSize = keyof typeof Sizing.avatar;
export type ButtonSize = 'small' | 'medium' | 'large';
export type WidthSize = keyof typeof Sizing.width;
export type HeightSize = keyof typeof Sizing.height;
export type SpacerSize = keyof typeof Sizing.spacer;

