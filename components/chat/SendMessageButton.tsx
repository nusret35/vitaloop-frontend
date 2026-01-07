import { Colors } from "@/constants/Colors";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface SendMessageButtonProps {
  isDisabled?: boolean;
  onPress: () => void;
}

const SendMessageButton: React.FC<SendMessageButtonProps> = ({
  onPress,
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
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="send" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

export default SendMessageButton;
