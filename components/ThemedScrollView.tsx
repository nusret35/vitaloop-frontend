import { ScrollView, ScrollViewProps, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  children,
  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <ScrollView style={[{ backgroundColor }, style]} {...otherProps}>
      {children}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
