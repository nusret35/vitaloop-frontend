import CommonModal from "@/components/CommonModal";
import SecondaryButton from "@/components/SecondaryButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import PrimaryButton from "@/components/PrimaryButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import CommonTextInput from "@/components/CommonTextInput";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

const NewGoalTargetModal = ({
  goalName,
  goalUnit,
  isVisible,
  setNewGoalAction,
  onClose,
}: {
  goalName: string;
  goalUnit: string;
  isVisible: boolean;
  setNewGoalAction: (goalDetail: GoalDetail) => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const [goalValue, setGoalValue] = useState("");

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ width: "100%" }}>
        <ThemedText
          type="header1"
          style={{ color, justifyContent: "flex-start" }}
        >
          {goalName}
        </ThemedText>
        <View>
          <View style={{ paddingTop: 8 }}>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              Goal {`(${goalUnit})`}
            </ThemedText>
            <CommonTextInput
              keyboardType="numeric"
              value={goalValue}
              onChangeValue={(newValue) => setGoalValue(newValue)}
              placeholder="Enter goal"
            />
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <PrimaryButton
            disabled={!goalValue}
            style={{ marginTop: 8, width: "100%" }}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (goalValue) {
                setNewGoalAction({
                  goalName,
                  goalUnit,
                  targetQuantity: Number(goalValue),
                });
              }
              onClose();
            }}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
              {t("goal.complete")}
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
              {t("goal.cancel")}
            </ThemedText>
          </SecondaryButton>
        </View>
      </View>
    </CommonModal>
  );
};

export default NewGoalTargetModal;
