import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "header1";
};

export function ThemedText({
  style,
  lightColor = "#3F414E",
  darkColor = "#FFFFFF",
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "header1" ? styles.header1 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "HelveticaNeue",
  },
  title: {
    fontFamily: "HelveticaNeue",
    fontSize: 24,
    fontWeight: "bold",
  },
  header1: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontWeight: "bold",
  },
  defaultSemiBold: {
    fontFamily: "HelveticaNeue",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    color: "#A1A4B2",
    fontWeight: "400",
  },
  link: {
    fontFamily: "HelveticaNeue",
    color: "#1B95E0",
  },
});
