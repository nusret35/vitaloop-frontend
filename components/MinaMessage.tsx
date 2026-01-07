import { Colors } from "@/constants/Colors";
import VitaLogo from "./icons/VitaLogo";
import { Text, TouchableOpacity, View } from "react-native";

const MinaMessage = ({
  message,
  maxLines,
  onPress,
}: {
  message: string;
  maxLines?: number;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <View
        style={{
          backgroundColor: Colors.dark.primary,
          flexDirection: "row",
          padding: 8,
          borderRadius: 16,
          alignItems: "center",
          gap: 8,
        }}
      >
        <View>
          <VitaLogo size={18} />
        </View>
        <Text
          numberOfLines={maxLines}
          style={{ color: "#fff", flex: 1, fontSize: 12 }}
        >
          {message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MinaMessage;
