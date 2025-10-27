import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, type TextProps, type ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  ...rest
}: {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
} & TextProps) {
  return (
    <SymbolView
      name={name as any}
      size={size}
      type="monochrome"
      tintColor={color}
      style={[styles.icon, style] as any}
      fallback={
        <Text style={[{ fontSize: size, color }, style]} {...rest}>
          ●
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
