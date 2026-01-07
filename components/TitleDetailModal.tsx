import CommonModal from "@/components/CommonModal";
import PrimaryButton from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { View } from "react-native";
import * as Haptics from "expo-haptics";

interface TitleDetailModalProps {
  title: string;
  description: string;
  isVisible: boolean;
  primaryButtonTitle?: string;
  onClose: () => void;
}

const TitleDetailModal = ({
  isVisible,
  onClose,
  title,
  primaryButtonTitle,
  description,
}: TitleDetailModalProps) => {
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ width: "100%" }}>
        <ThemedText
          type="header1"
          style={{ color, justifyContent: "flex-start" }}
        >
          {title}
        </ThemedText>
        <ThemedText style={{ marginVertical: 8 }}>{description}</ThemedText>
        <PrimaryButton
          style={{ marginTop: 8, width: "100%" }}
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
            {primaryButtonTitle ? primaryButtonTitle : "Complete"}
          </ThemedText>
        </PrimaryButton>
      </View>
    </CommonModal>
  );
};

export default TitleDetailModal;
