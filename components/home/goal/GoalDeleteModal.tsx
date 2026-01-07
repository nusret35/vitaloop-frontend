import CommonModal from "@/components/CommonModal";
import PrimaryButton from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from "expo-haptics";
import { useDeleteGoalMutation } from "@/services/userGoal";
import { View } from "react-native";
import SecondaryButton from "@/components/SecondaryButton";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

interface GoalDeleteModalProps {
  goal: UserGoal;
  isVisible: boolean;
  onClose: () => void;
}

const GoalDeleteModal = ({
  goal,
  isVisible,
  onClose,
}: GoalDeleteModalProps) => {
  const { t } = useTranslation();
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const [deleteGoal] = useDeleteGoalMutation();

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ width: "100%" }}>
        <ThemedText
          type="header1"
          style={{ color, justifyContent: "flex-start" }}
        >
          {t("deleteGoal.title")}
        </ThemedText>
        <ThemedText>
          {t("deleteGoal.areYouSure", {
            goal: goal.name,
          })}
        </ThemedText>
        <View style={{ gap: 8 }}>
          <PrimaryButton
            style={{ marginTop: 8, width: "100%" }}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              await deleteGoal(goal.id).unwrap();
              onClose();
              router.back();
            }}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
              {t("deleteGoal.yesDelete")}
            </ThemedText>
          </PrimaryButton>
          <SecondaryButton
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
          >
            <ThemedText
              style={{ color: Colors.dark.primary, fontWeight: "600" }}
            >
              {t("deleteGoal.cancel")}
            </ThemedText>
          </SecondaryButton>
        </View>
      </View>
    </CommonModal>
  );
};

export default GoalDeleteModal;
