import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

interface ArcProgressBarProps {
  size: number;
  strokeWidth: number;
  progress: number;
  type?: "default" | "secondary";
  arcSweepAngle?: number;
  duration?: number; // Animation duration in ms
}

const ArcProgressBar: React.FC<ArcProgressBarProps> = ({
  size,
  strokeWidth,
  progress,
  type = "default",
  arcSweepAngle = 270,
  duration = 800,
}) => {
  const radius = (size - strokeWidth) / 2;
  const fullCircumference = 2 * Math.PI * radius;
  const arcLength = (arcSweepAngle / 360) * fullCircumference;

  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [progress, duration, animatedProgress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [arcLength, 0],
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          transform: [{ rotate: `${(0 + arcSweepAngle) / 2}deg` }],
        }}
      >
        <Circle
          stroke={
            type === "default"
              ? Colors.dark.primary
              : Colors.light.progressBarBackground
          }
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${fullCircumference}`}
          strokeLinecap="round"
        />
        <AnimatedCircle
          stroke={type === "default" ? "#fff" : Colors.dark.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${fullCircumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <ThemedText
        style={{
          fontSize: 18,
          fontWeight: "600",
        }}
      >
        {`${progress.toFixed(0)}%`}
      </ThemedText>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default ArcProgressBar;
