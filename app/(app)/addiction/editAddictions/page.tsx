import CommonTwoActionModal from "@/components/CommonTwoActionModal";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  useDeleteUserAddictionByIdMutation,
  useGetUserAddictionsQuery,
} from "@/services/userAddiction";
import { useToast } from "@/toast/ToastContext";
import { FlashList } from "@shopify/flash-list";
import { router, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const EditAddictions = () => {
  const { t } = useTranslation();
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  const userAddictions = useGetUserAddictionsQuery();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRecovery, setSelectedRecovery] = useState<UserAddiction>();
  const [deleteUserAddictionById, { isLoading }] =
    useDeleteUserAddictionByIdMutation();
  const navigation = useNavigation();
  const { showSuccessToast, showFailToast } = useToast();

  const deleteUserAddiction = useCallback(() => {
    try {
      if (selectedRecovery?.addictionId) {
        deleteUserAddictionById({ addictionId: selectedRecovery?.addictionId });
        showSuccessToast(t("toast.recoveryDeleted"));
      }
    } catch {
      showFailToast("Something went wrong");
    }
  }, [deleteUserAddictionById, selectedRecovery]);

  const renderItem = ({ item }: { item: UserAddiction }) => {
    //const IconComponent = iconMapping[];
    return (
      <View>
        <OverlayActivityIndicator isVisible={isLoading} />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 0.25,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomColor: Colors.border,
            justifyContent: "space-between",
          }}
        >
          <ThemedText style={{ fontWeight: "bold" }}>
            {t(`addiction.${item.addictionName}`)}
          </ThemedText>
          <TouchableOpacity
            onPress={() => {
              setSelectedRecovery(item);
              setIsVisible(true);
            }}
          >
            <Icon size={36} name="remove" color={color} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            router.push("/(app)/allAddictions/page");
          }}
          style={{ marginBottom: 10 }}
        >
          <Icon size={28} name="add" color={Colors.dark.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <CommonTwoActionModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        title={t("editAddiction.deleteRecovery")}
        description={t("editAddiction.areYouSure", {
          addictionName: selectedRecovery?.addictionName || "",
        })}
        primaryButtonTitle={t("editAddiction.yesDelete")}
        secondaryButtonTitle={t("editAddiction.no")}
        primaryAction={() => {
          deleteUserAddiction();
          setIsVisible(false);
        }}
        secondaryAction={() => setIsVisible(false)}
      />
      <View style={{ height: Dimensions.get("window").height }}>
        <FlashList data={userAddictions.data} renderItem={renderItem} />
      </View>
    </ThemedView>
  );
};

export default EditAddictions;
