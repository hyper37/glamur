import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export const colors = {
  bg: '#FCFAF7',
  white: '#FFFFFF',
  ink: '#352D30',
  muted: '#82777B',
  rose: '#A7526A',
  roseDark: '#884056',
  blush: '#F4E8EB',
  line: '#ECE5E3',
  green: '#487361',
  greenBg: '#EEF4EE',
};
export const fonts = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_600SemiBold',
  title: 'CormorantGaramond_500Medium',
  italic: 'CormorantGaramond_500Medium_Italic',
};
export function Txt({ children, style, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      {...props}
      style={[
        { fontFamily: fonts.regular, fontSize: 14, color: colors.ink, lineHeight: 22 },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Heading({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Txt
      accessibilityRole="header"
      style={[{ fontFamily: fonts.title, fontSize: 36, lineHeight: 40 }, style]}
    >
      {children}
    </Txt>
  );
}
export function Icon({
  name,
  size = 19,
  color = colors.ink,
}: {
  name: React.ComponentProps<typeof Feather>['name'];
  size?: number;
  color?: string;
}) {
  return <Feather name={name} size={size} color={color} />;
}
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
  testID,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'green';
  icon?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const primary = variant === 'primary' || variant === 'green';
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor:
            variant === 'primary'
              ? colors.rose
              : variant === 'green'
                ? colors.green
                : variant === 'secondary'
                  ? colors.white
                  : 'transparent',
          borderColor: variant === 'secondary' ? colors.line : 'transparent',
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={17} color={primary ? colors.white : colors.rose} />}
      <Txt
        style={{
          fontFamily: fonts.bold,
          color: primary ? colors.white : colors.rose,
          fontSize: 13,
        }}
      >
        {label}
      </Txt>
    </Pressable>
  );
}
export function Pill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[s.pill, selected && { backgroundColor: colors.rose, borderColor: colors.rose }]}
    >
      <Txt
        style={{ fontSize: 12, color: selected ? 'white' : colors.muted, fontFamily: fonts.medium }}
      >
        {label}
      </Txt>
    </Pressable>
  );
}
export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 7, flexShrink: 1 }}>
      <Txt style={{ fontFamily: fonts.medium, fontSize: 12 }}>{label}</Txt>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#A1979B"
        {...props}
        style={[s.input, style]}
      />
    </View>
  );
}
export function Card({
  children,
  style,
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Eyebrow({ children }: React.PropsWithChildren) {
  return (
    <Txt style={{ fontSize: 10, letterSpacing: 2.2, color: colors.rose, fontFamily: fonts.bold }}>
      {children}
    </Txt>
  );
}
export function Notice({ children, error = false }: React.PropsWithChildren<{ error?: boolean }>) {
  return (
    <View
      accessibilityRole="alert"
      style={{ borderRadius: 12, backgroundColor: error ? '#FBEDEE' : colors.greenBg, padding: 14 }}
    >
      <Txt style={{ color: error ? '#9F354C' : colors.green, fontSize: 12 }}>{children}</Txt>
    </View>
  );
}
export const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  stack: { gap: 20 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 24,
  },
  button: {
    minHeight: 46,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderRadius: 24,
    borderColor: colors.line,
    borderWidth: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  input: {
    minHeight: 49,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.white,
  },
});
