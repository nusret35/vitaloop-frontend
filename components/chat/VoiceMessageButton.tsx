import { Colors } from "@/constants/Colors";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface VoiceMessageButtonProps {
  isDisabled?: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

const VoiceMessageButton: React.FC<VoiceMessageButtonProps> = ({
  onPressIn,
  onPressOut,
  isDisabled = false,
}) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: isDisabled ? Colors.disabled : Colors.dark.primary,
      borderRadius: 20,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <TouchableOpacity
      style={styles.button}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Icon name="mic" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

export default VoiceMessageButton;
