import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, type TextProps } from 'react-native';

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
  style?: TextProps['style'];
} & TextProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      type="monochrome"
      tintColor={color}
      style={[styles.icon, style]}
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
