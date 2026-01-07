import CommonModal from "@/components/CommonModal";
import PrimaryButton from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

interface NewGoalSetModalProps {
  title: string;
  description: string;
  isVisible: boolean;
  onClose: () => void;
}

const NewGoalSetModal = ({
  isVisible,
  onClose,
  title,
  description,
}: NewGoalSetModalProps) => {
  const { t } = useTranslation();

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
        <ThemedText>{description}</ThemedText>
        <PrimaryButton
          style={{ marginTop: 8, width: "100%" }}
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
            {t("goal.complete")}
          </ThemedText>
        </PrimaryButton>
      </View>
    </CommonModal>
  );
};

export default NewGoalSetModal;
