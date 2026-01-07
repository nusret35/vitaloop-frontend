import Svg, { Rect } from "react-native-svg";

const MinusIcon = ({ color, size = 20 }: { color: string; size?: number }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x="20" y="45" width="60" height="10" fill={color} />
    </Svg>
  );
};

export default MinusIcon;
