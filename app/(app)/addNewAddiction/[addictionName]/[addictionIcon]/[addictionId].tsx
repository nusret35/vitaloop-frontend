import iconMapping from "@/assets/iconMapping";
import CardView from "@/components/CardView";
import PrimaryButton from "@/components/PrimaryButton";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
/*
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";*/
import { useCreateUserAddictionMutation } from "@/services/userAddiction";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import { useToast } from "@/toast/ToastContext";
import DatePicker from "react-native-date-picker";
import { useTranslation } from "react-i18next";
import { ThemedView } from "@/components/ThemedView";
import { logEvent } from "@react-native-firebase/analytics";
import { analytics } from "@/firebaseConfig";

const NewAddiction = () => {
  const { t } = useTranslation();
  const { height: deviceHeight } = Dimensions.get("window");
  const [createUserAddiction, { isSuccess, isError, isLoading, error }] =
    useCreateUserAddictionMutation();
  const { addictionName, addictionIcon, addictionId } = useLocalSearchParams();
  const { showSuccessToast, showFailToast } = useToast();
  const IconComponent = iconMapping[addictionIcon as string];
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (isSuccess || isError) {
      if (isSuccess) {
        showSuccessToast(t("addiction.newRecoveryAdded"));
      }
      if (isError) {
        showFailToast("Something went wrong");
        console.log(error);
      }
      router.dismissTo("/(app)/(drawer)/(tabs)");
    }
  }, [isSuccess, isError]);

  return (
    <ThemedView style={{ height: deviceHeight }}>
      <OverlayActivityIndicator isVisible={isLoading} />
      <ThemedScrollView style={{ height: deviceHeight - 120 }}>
        <CardView style={{ alignItems: "center", gap: 16 }}>
          <View style={{ gap: 8, alignItems: "center" }}>
            <IconComponent width={64} height={64} fill={Colors.dark.primary} />
            <ThemedText type="header1">
              {t(`addiction.${addictionName}`)}
            </ThemedText>
          </View>
          <View style={{ flex: 1, width: "100%" }}>
            <ThemedText
              style={{
                fontSize: 14,
                marginBottom: 4,
                fontWeight: "600",
              }}
            >
              {t("addiction.lastRelapseTime")}
            </ThemedText>
            <TouchableOpacity onPress={() => setIsDateModalOpen(true)}>
              <View
                style={{
                  justifyContent: "center",
                  padding: 14,
                  borderRadius: 8,
                  borderColor: Colors.border,
                  borderWidth: 1,
                }}
              >
                <ThemedText>{date.toLocaleDateString()}</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </CardView>
        <View style={{ marginHorizontal: 16, gap: 16 }}>
          <PrimaryButton
            onPress={async () => {
              logEvent(analytics, `addiction_add`, {
                addiction: addictionName,
              });
              createUserAddiction({
                addictionId: addictionId as string,
                lastRelapseDate: date.toISOString(),
              });
            }}
          >
            <Text style={{ color: "#fff" }}>{t("addiction.continue")}</Text>
          </PrimaryButton>
        </View>
      </ThemedScrollView>
      <DatePicker
        modal
        open={isDateModalOpen}
        onConfirm={(date) => {
          setDate(date);
          setIsDateModalOpen(false);
        }}
        maximumDate={new Date()}
        onCancel={() => setIsDateModalOpen(false)}
        mode="date"
        date={date}
        onDateChange={(newDate) => setDate(newDate)}
      />
    </ThemedView>
  );
};

export default NewAddiction;
