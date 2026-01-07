import MinusIcon from "@/components/icons/MinusIcon";
import { View } from "react-native";

const NeutralSymbol = () => {
  return (
    <View
      style={{
        backgroundColor: "#808080",
        height: 32,
        width: 32,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MinusIcon color="#FFF" size={30} />
    </View>
  );
};

export default NeutralSymbol;
