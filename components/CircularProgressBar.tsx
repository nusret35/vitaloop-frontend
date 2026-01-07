import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface CircularProgressBarProps {
  size: number;
  strokeWidth: number;
  progress: number;
  type?: "default" | "secondary";
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size,
  strokeWidth,
  progress,
  type = "default",
}) => {
  const color = useThemeColor({ light: "#3F414E", dark: "#FFFFFF" }, "text");
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
        style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          stroke={type === "default" ? "#fff" : Colors.dark.primary}
          fill="none"
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      <ThemedText
        style={{
          color: type === "default" ? "#fff" : color,
          fontSize: 15,
          fontWeight: "600",
        }}
      >{`${progress.toFixed(0)}%`}</ThemedText>
    </View>
  );
};
export default CircularProgressBar;
