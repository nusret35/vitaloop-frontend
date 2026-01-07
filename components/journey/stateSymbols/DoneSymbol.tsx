import CheckMarkIcon from "@/components/icons/CheckMarkIcon";
import { View } from "react-native";

const DoneSymbol = () => {
  return (
    <View
      style={{
        backgroundColor: "#48A705",
        height: 32,
        width: 32,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CheckMarkIcon size={22} />
    </View>
  );
};

export default DoneSymbol;
