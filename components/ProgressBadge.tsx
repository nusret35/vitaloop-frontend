import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import Svg, { G, Path, Text } from "react-native-svg";

const ProgressBadge = ({
  progress,
  lightColor = "#FFFFFF",
  darkColor = "#FFFFFF",
}: {
  progress: string;
  lightColor?: string;
  darkColor?: string;
}) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Svg height="25" width="25" viewBox="0 0 512 512">
      <G>
        <G>
          <G>
            <Path
              d="M256,501c-4,0-8-1.2-11.4-3.5c-147.3-99.1-232.4-247.2-233.6-406.4c-0.1-9.3,6.2-17.5,15.2-19.9l224.6-59.6
              c3.4-0.9,7-0.9,10.5,0l224.6,59.6c9,2.4,15.2,10.6,15.2,19.9c-1.1,159.1-86.3,307.3-233.6,406.4c-3.5,2.3-7.5,3.5-11.5,3.5z
              M52.3,106.6c6.2,135.4,79.6,261.3,203.7,349.2c124.1-87.9,197.5-213.8,203.7-349.2L256,52.5L52.3,106.6z"
              fill={color}
            />
          </G>
        </G>
      </G>
      <Text
        x="256"
        y="320"
        fontSize="240"
        fill={color}
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="HelveticaNeue"
      >
        {progress}
      </Text>
    </Svg>
  );
};

export default ProgressBadge;
