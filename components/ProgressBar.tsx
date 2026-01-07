import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function ProgressBar({
  progress,
  additionalProgress,
  secondaryColor = "#fff",
}: {
  progress: number;
  additionalProgress?: number;
  secondaryColor?: string;
}) {
  const useWidthAnimation = (progress: number) => {
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, [progress, widthAnim]);

    return widthAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    });
  };

  const remainingSpace = 100 - progress;

  const additionalProgressWidth = additionalProgress
    ? Math.min(additionalProgress, remainingSpace)
    : 0;

  const primaryProgressWidth = useWidthAnimation(Math.min(progress, 100));
  const secondaryProgressWidth = useWidthAnimation(additionalProgressWidth);

  return (
    <ThemedView
      lightColor={secondaryColor}
      darkColor={secondaryColor}
      style={styles.container}
    >
      <Animated.View
        style={{
          width: primaryProgressWidth,
          height: "100%",
          backgroundColor: Colors.dark.primary,
          borderRadius: additionalProgress ? 0 : 2,
        }}
      />
      <Animated.View
        style={{
          width: secondaryProgressWidth,
          height: "100%",
          backgroundColor: Colors.dark.recoveryColor,
          borderRadius: 2,
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    flexDirection: "row",
  },
});
