import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

const SecondaryButton = ({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: ReactNode;
  style?: ViewStyle;
}) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ ...defaultStyle.container, backgroundColor, ...style }}
    >
      {children}
    </TouchableOpacity>
  );
};

const defaultStyle = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    paddingHorizontal: 16,
  },
});

export default SecondaryButton;
