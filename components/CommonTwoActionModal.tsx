import { View } from "react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import CommonModal from "./CommonModal";
import { ThemedText } from "./ThemedText";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

interface CommonTwoActionModalType {
  title: string;
  description: string;
  isVisible: boolean;
  primaryButtonTitle: string;
  secondaryButtonTitle: string;
  primaryAction: () => void;
  secondaryAction: () => void;
  onClose: () => void;
}

const CommonTwoActionModal = ({
  title,
  description,
  isVisible,
  primaryButtonTitle,
  secondaryButtonTitle,
  primaryAction,
  secondaryAction,
  onClose,
}: CommonTwoActionModalType) => {
  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ width: "100%", gap: 12 }}>
        <ThemedText type="header1">{title}</ThemedText>
        <ThemedText>{description}</ThemedText>
        <PrimaryButton
          onPress={() => {
            primaryAction();
          }}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
            {primaryButtonTitle}
          </ThemedText>
        </PrimaryButton>
        <SecondaryButton
          onPress={() => {
            secondaryAction();
          }}
        >
          <ThemedText style={{ color: Colors.dark.primary, fontWeight: "600" }}>
            {secondaryButtonTitle}
          </ThemedText>
        </SecondaryButton>
      </View>
    </CommonModal>
  );
};

export default CommonTwoActionModal;
