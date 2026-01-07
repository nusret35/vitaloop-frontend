import CardView from "@/components/CardView";
import Header from "@/components/home/Header";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { logOut } from "@/redux/slices/authTokenSlice";
import { resetStore } from "@/redux/store";
import { useDeleteUserMutation } from "@/services/user";
import { useToast } from "@/toast/ToastContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useDispatch } from "react-redux";

const DeleteAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showFailToast } = useToast();
  const [deleteUser, { isLoading, isSuccess, isError, error }] =
    useDeleteUserMutation();

  const handleDeleteAccountButtonAction = () => {
    deleteUser();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(logOut());
      dispatch(resetStore());
      router.replace("/sign-in");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log(error);
      showFailToast("Bir sorun oluştu");
    }
  }, [isError]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <OverlayActivityIndicator isVisible={isLoading} />
      <Header
        style={{ paddingBottom: 0 }}
        title={t("deleteAccount.areYouSure")}
      />
      <CardView>
        <ThemedText>{t("deleteAccount.areYouSureToDelete")}</ThemedText>
      </CardView>
      <View style={{ paddingHorizontal: 16, gap: 8 }}>
        <PrimaryButton onPress={() => router.back()}>
          <ThemedText style={{ color: "#fff" }}>
            {t("deleteAccount.noDontDelete")}
          </ThemedText>
        </PrimaryButton>
        <SecondaryButton onPress={handleDeleteAccountButtonAction}>
          <ThemedText style={{ color: Colors.dark.primary }}>
            {t("deleteAccount.yesDelete")}
          </ThemedText>
        </SecondaryButton>
      </View>
    </ThemedView>
  );
};

export default DeleteAccount;
