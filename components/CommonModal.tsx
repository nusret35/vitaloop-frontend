import { ReactNode } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "@/constants/Colors";

const CommonModal = ({
  isVisible,
  onClose,
  children,
}: {
  isVisible: boolean;
  onClose: () => void;
  children?: ReactNode;
}) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.backgroundView}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={{ ...styles.modalView, backgroundColor }}>
                {children}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 360,
  },
});

export default CommonModal;
