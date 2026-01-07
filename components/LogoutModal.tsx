import { View } from "react-native";
import CommonModal from "./CommonModal";
import { ThemedText } from "./ThemedText";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { Colors } from "@/constants/Colors";
import { logOut } from "@/redux/slices/authTokenSlice";
import { deleteFeeling } from "@/redux/slices/dailyFeelingSlice";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import { resetStore } from "@/redux/store";
import { useTranslation } from "react-i18next";
import { userApi } from "@/services/user";
import { userAddictionApi } from "@/services/userAddiction";
import { userGoalApi } from "@/services/userGoal";
import { userRoutineApi } from "@/services/userRoutine";
import { chatApi } from "@/services/chat";
import { supportTicketApi } from "@/services/supportTicket";

interface LogoutModal {
  isVisible: boolean;
  onClose: () => void;
}

const LogoutModal = ({ isVisible, onClose }: LogoutModal) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const logoutAction = () => {
    // Clear user-specific data
    dispatch(logOut());
    dispatch(deleteFeeling());
    
    // Clear RTK Query cache for user data
    dispatch(userApi.util.resetApiState());
    dispatch(userAddictionApi.util.resetApiState());
    dispatch(userGoalApi.util.resetApiState());
    dispatch(userRoutineApi.util.resetApiState());
    dispatch(chatApi.util.resetApiState());
    dispatch(supportTicketApi.util.resetApiState());
    
    // Reset entire store
    dispatch(resetStore());
    
    router.replace("/sign-in");
  };

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <View style={{ gap: 12, width: "100%", paddingHorizontal: 8 }}>
        <ThemedText type="header1">{t("signOutPopup.signOutTitle")}</ThemedText>
        <ThemedText>{t("signOutPopup.areYouSureToSignOut")}</ThemedText>
        <PrimaryButton onPress={logoutAction}>
          <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
            {t("signOutPopup.yesSignOut")}
          </ThemedText>
        </PrimaryButton>
        <SecondaryButton
          onPress={() => {
            onClose();
          }}
        >
          <ThemedText style={{ color: Colors.dark.primary, fontWeight: "600" }}>
            {t("signOutPopup.no")}
          </ThemedText>
        </SecondaryButton>
      </View>
    </CommonModal>
  );
};

export default LogoutModal;
