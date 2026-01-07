import { View } from "react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import CommonModal from "./CommonModal";
import { ThemedText } from "./ThemedText";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { useTranslation } from "react-i18next";
import { logEvent } from "@react-native-firebase/analytics";
import { analytics } from "@/firebaseConfig";

interface RelapseModalType {
  addictionId: string;
  isVisible: boolean;
  onClose: () => void;
}

const RelapseModal = ({
  addictionId,
  isVisible,
  onClose,
}: RelapseModalType) => {
  const { t } = useTranslation();

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ gap: 12, width: "100%" }}>
        <ThemedText type="header1">
          {t("aboutToRelapse.beforeYouRelapse")}
        </ThemedText>
        <ThemedText>{t("aboutToRelapse.hereForYou")}</ThemedText>
        <PrimaryButton
          onPress={() => {
            router.push(`/chat/addiction/${addictionId}`);
            onClose();
          }}
        >
          <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
            {t("aboutToRelapse.iWantToTalk")}
          </ThemedText>
        </PrimaryButton>
        <SecondaryButton
          onPress={() => {
            onClose();
            logEvent(analytics, "get_addiction_support_pressed");
          }}
        >
          <ThemedText style={{ color: Colors.dark.primary, fontWeight: "600" }}>
            {t("aboutToRelapse.imFine")}
          </ThemedText>
        </SecondaryButton>
      </View>
    </CommonModal>
  );
};

export default RelapseModal;
