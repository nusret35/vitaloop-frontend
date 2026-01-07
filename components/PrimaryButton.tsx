import { Colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

const PrimaryButton = ({
  onPress,
  disabled = false,
  children,
  style,
}: {
  onPress: () => void;
  disabled?: boolean;
  children: ReactNode;
  style?: ViewStyle;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        ...defaultStyle.container,
        ...style,
        backgroundColor: disabled ? Colors.border : Colors.dark.primary,
      }}
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
    paddingHorizontal: 16,
  },
});

export default PrimaryButton;
