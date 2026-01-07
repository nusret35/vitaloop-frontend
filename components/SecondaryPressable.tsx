import { ReactNode } from "react";
import { ThemedView } from "./ThemedView";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

interface SecondaryPressableProps {
  isSelected?: boolean;
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SecondaryPressable = ({
  isSelected = false,
  onPress,
  children,
  style,
}: SecondaryPressableProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <ThemedView
        style={style}
        lightColor={
          isSelected ? Colors.dark.primary : Colors.light.secondaryBackground
        }
        darkColor={
          isSelected ? Colors.dark.primary : Colors.dark.secondaryBackground
        }
      >
        {children}
      </ThemedView>
    </TouchableOpacity>
  );
};

export default SecondaryPressable;
