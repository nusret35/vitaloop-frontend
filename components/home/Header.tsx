import { StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";

export default function Header({
  title,
  subtitle,
  style,
}: {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={{ ...styles.header, ...style }}>
      <ThemedText type="title">{title}</ThemedText>
      {subtitle && <ThemedText type="subtitle">{subtitle}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    padding: 16,
  },
});
