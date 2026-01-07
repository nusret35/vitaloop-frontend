import CrossIcon from "@/components/icons/CrossIcon";
import { View } from "react-native";

const SkippedSymbol = () => {
  return (
    <View
      style={{
        backgroundColor: "red",
        height: 32,
        width: 32,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CrossIcon size={14} />
    </View>
  );
};

export default SkippedSymbol;
