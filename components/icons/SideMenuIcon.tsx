import Svg, { Line } from "react-native-svg";

const SideMenuIcon = ({ color }: { color: string }) => {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40">
      <Line
        x1="10"
        y1="16"
        x2="30"
        y2="16"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="10"
        y1="24"
        x2="20"
        y2="24"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default SideMenuIcon;
