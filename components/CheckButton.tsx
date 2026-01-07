import { TouchableOpacity, View } from "react-native";
import CheckMarkIcon from "./icons/CheckMarkIcon";
import * as Haptics from "expo-haptics";

const CheckButton = ({
  checked,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        onChange();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }}
      disabled={disabled}
    >
      <View
        style={{
          backgroundColor: checked ? "#48A705" : "#808080",
          height: 50,
          width: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckMarkIcon />
      </View>
    </TouchableOpacity>
  );
};

export default CheckButton;
