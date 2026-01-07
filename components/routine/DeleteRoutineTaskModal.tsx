import CommonModal from "../CommonModal";
import { ThemedText } from "../ThemedText";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

interface DeleteRoutineTaskModalType {
  taskName: string;
  deleteAction: () => void;
  isVisible: boolean;
  onClose: () => void;
}

const DeleteRoutineTaskModal = ({
  taskName,
  deleteAction,
  isVisible,
  onClose,
}: DeleteRoutineTaskModalType) => {
  const { t } = useTranslation();

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ gap: 12, width: "100%" }}>
        <ThemedText type="header1">{t("deleteRoutineTask.title")}</ThemedText>
        <ThemedText>
          {t("deleteRoutineTask.confirmMessage", { taskName })}
        </ThemedText>
        <PrimaryButton onPress={() => deleteAction()}>
          <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
            {t("deleteRoutineTask.yesDelete")}
          </ThemedText>
        </PrimaryButton>
        <SecondaryButton onPress={() => onClose()}>
          <ThemedText style={{ color: Colors.dark.primary, fontWeight: "600" }}>
            {t("deleteRoutineTask.cancel")}
          </ThemedText>
        </SecondaryButton>
      </View>
    </CommonModal>
  );
};

export default DeleteRoutineTaskModal;
