import { View } from "react-native";
import CommonModal from "../CommonModal";
import { ThemedText } from "../ThemedText";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Feeling from "@/types/feeling";

interface EmotionsModel {
  isVisible: boolean;
  onClose: () => void;
  selectedEmotion?: Feeling;
}

const EmotionsModal = ({
  isVisible,
  onClose,
  selectedEmotion,
}: EmotionsModel) => {
  const { t } = useTranslation();

  const getEmotionMessage = () => {
    switch (selectedEmotion) {
      case Feeling.Sad:
        return t("emotionsModal.sad");
      case Feeling.Angry:
        return t("emotionsModal.angry");
      case Feeling.Anxious:
        return t("emotionsModal.anxious");
      case Feeling.Stressed:
        return t("emotionsModal.stressed");
      default:
        return t("emotionsModal.sad");
    }
  };

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ gap: 12, width: "100%" }}>
        <ThemedText type="header1">
          {t("emotionsModal.isEverythingAlright")}
        </ThemedText>
        <ThemedText>{getEmotionMessage()}</ThemedText>
        <PrimaryButton
          onPress={() => {
            if (selectedEmotion) {
              router.push(`/chat/feeling/${selectedEmotion}`);
            }
            onClose();
          }}
        >
          <ThemedText
            style={{ color: "#fff", fontWeight: "600", width: "100%" }}
          >
            {t("emotionsModal.yesIWantToTalk")}
          </ThemedText>
        </PrimaryButton>
        <SecondaryButton
          onPress={() => {
            onClose();
          }}
        >
          <ThemedText style={{ color: Colors.dark.primary, fontWeight: "600" }}>
            {t("emotionsModal.noImFine")}
          </ThemedText>
        </SecondaryButton>
      </View>
    </CommonModal>
  );
};

export default EmotionsModal;
