import React from "react";
import Svg, { Path } from "react-native-svg";

const CheckMarkIcon = ({ size = 30, color = "#ffffff" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M20 6L9 17L4 12" />
    </Svg>
  );
};

export default CheckMarkIcon;
