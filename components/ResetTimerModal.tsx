import { View } from "react-native";
import CommonModal from "./CommonModal";
import { ThemedText } from "./ThemedText";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { Colors } from "@/constants/Colors";
import { useResetTimerMutation } from "@/services/userAddiction";
import { useTranslation } from "react-i18next";

interface ResetTimerModalType {
  isVisible: boolean;
  resetTimerAction: () => void;
  onClose: () => void;
}

const ResetTimerModal = ({
  isVisible,
  resetTimerAction,
  onClose,
}: ResetTimerModalType) => {
  const { t } = useTranslation();

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ gap: 12 }}>
        <ThemedText type="header1">{t("resetTimer.resetTimer")}</ThemedText>
        <ThemedText>{t("resetTimer.youAreResettingTimer")}</ThemedText>
        <PrimaryButton
          onPress={() => {
            resetTimerAction();
          }}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
            {t("resetTimer.resetTheTimer")}
          </ThemedText>
        </PrimaryButton>
        <SecondaryButton
          onPress={() => {
            onClose();
          }}
        >
          <ThemedText style={{ color: Colors.dark.primary, fontWeight: "600" }}>
            {t("resetTimer.dontReset")}
          </ThemedText>
        </SecondaryButton>
      </View>
    </CommonModal>
  );
};

export default ResetTimerModal;
