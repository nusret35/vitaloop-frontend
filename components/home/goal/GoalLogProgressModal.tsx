import CommonModal from "@/components/CommonModal";
import CommonTextInput from "@/components/CommonTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import ProgressBar from "@/components/ProgressBar";
import SecondaryButton from "@/components/SecondaryButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from "expo-haptics";
import { useGetUserGoalQuery } from "@/services/userGoal";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useToast } from "@/toast/ToastContext";
import { useTranslation } from "react-i18next";

interface GoalLogProgressModalProps {
  addProgressAction: (progress: number) => void;
  isVisible: boolean;
  onClose: () => void;
}

const GoalLogProgressModal = ({
  isVisible,
  onClose,
  addProgressAction,
}: GoalLogProgressModalProps) => {
  const { t } = useTranslation();
  const userGoal = useGetUserGoalQuery();
  const [progress, setProgress] = useState<number>();
  const [totalProgress, setTotalProgress] = useState<number | undefined>(
    userGoal.data?.progress
  );
  const { showSuccessToast, showFailToast } = useToast();

  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  const handleProgress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      if (progress) {
        addProgressAction(progress);
      }
      showSuccessToast(t("toast.progressLogged"));
    } catch {
      showFailToast("Something went wrong");
    } finally {
      setProgress(undefined);
      onClose();
    }
  };

  useEffect(() => {
    setTotalProgress(
      parseFloat(((userGoal.data?.progress ?? 0) + (progress ?? 0)).toFixed(0))
    );
  }, [progress, userGoal.data?.progress]);

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ width: "100%" }}>
        <View>
          <ThemedText
            type="header1"
            style={{ color, justifyContent: "flex-start" }}
          >
            {t("logProgress.logProgress")}
          </ThemedText>
          <ThemedText style={{ marginVertical: 6, fontSize: 16 }}>
            {userGoal.data?.name}
          </ThemedText>
        </View>

        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <ThemedText>
            {totalProgress} {userGoal.data?.progressUnit}
          </ThemedText>
          <ThemedText>
            {(
              Number((totalProgress ?? 0) / (userGoal.data?.goal ?? 0)) * 100
            ).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            })}
            %
          </ThemedText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 8,
          }}
        >
          <ProgressBar
            progress={userGoal.data?.progressInPercent ?? 0}
            additionalProgress={
              userGoal.data?.goal
                ? ((progress ?? 0) / userGoal.data?.goal) * 100
                : undefined
            }
            secondaryColor={"#D3D3D3"}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              {t("logProgress.progress")}
            </ThemedText>
            <CommonTextInput
              keyboardType="numeric"
              style={{ marginRight: 10 }}
              value={progress?.toString()}
              placeholder={t("logProgress.enterProgress")}
              onChangeValue={(newValue: string) =>
                setProgress(newValue ? Number(newValue) : undefined)
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              {t("logProgress.remaining")}
            </ThemedText>
            <CommonTextInput
              editable={false}
              value={`${userGoal.data?.remainingProgress} ${userGoal.data?.progressUnit}`}
              placeholder="Enter progress"
            />
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <PrimaryButton
            style={{ marginTop: 8, width: "100%" }}
            onPress={handleProgress}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
              {t("logProgress.complete")}
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
              {t("logProgress.cancel")}
            </ThemedText>
          </SecondaryButton>
        </View>
      </View>
    </CommonModal>
  );
};

export default GoalLogProgressModal;
