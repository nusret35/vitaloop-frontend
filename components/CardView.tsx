import { ReactNode } from "react";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";
import { ViewStyle } from "react-native";

const CardView = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) => {
  return (
    <ThemedView
      lightColor={"#fff"}
      darkColor={Colors.dark.secondaryBackground}
      style={{
        padding: 16,
        margin: 16,
        borderRadius: 16,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        ...style,
      }}
    >
      {children}
    </ThemedView>
  );
};

export default CardView;
