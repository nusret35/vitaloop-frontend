import CardView from "@/components/CardView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useGetUserAddictionByIdQuery,
  useResetTimerMutation,
} from "@/services/userAddiction";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { getProgress } from "../../util/recoveryUtils";
import ArcProgressBar from "@/components/ArcProgressBar";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { Colors } from "@/constants/Colors";
import RecoveryDurationBold from "@/components/home/RecoveryDurationBold";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MinaMessage from "@/components/MinaMessage";
import * as Haptics from "expo-haptics";
import RelapseModal from "@/components/RelapseModal";
import ResetTimerModal from "@/components/ResetTimerModal";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import { useToast } from "@/toast/ToastContext";
import TitleDetailModal from "@/components/TitleDetailModal";
import { useTranslation } from "react-i18next";
import { logEvent } from "@react-native-firebase/analytics";
import { analytics } from "@/firebaseConfig";

export default function AddictionScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const userAddictionQuery = useGetUserAddictionByIdQuery(id as string);
  const userAddiction = userAddictionQuery.data;
  const lastRelapseDateAsDate = useMemo(
    () =>
      userAddiction?.lastRelapseDate
        ? new Date(Date.parse(userAddiction?.lastRelapseDate))
        : new Date(),
    [userAddiction]
  );
  const [progress, setProgress] = useState(0);
  const [isRelapseModalVisible, setIsRelapseModalVisible] = useState(false);
  const [isResetTimerModalVisible, setIsResetTimerModalVisible] =
    useState(false);
  const [isRelapsedMessageVisible, setIsRelapsedMessageVisible] =
    useState(false);
  const { height: deviceHeight } = Dimensions.get("window");
  const theme = useColorScheme() ?? "light";
  const { showFailToast } = useToast();
  const [resetTimer, { isLoading, isSuccess, isError, data, error }] =
    useResetTimerMutation();

  const resetTimerAction = () => {
    resetTimer({ addictionId: id as string });
    setIsResetTimerModalVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: Colors.dark.primary,
          }}
        >
          {t(`addiction.${userAddiction?.addictionName}`)}
        </ThemedText>
      ),
    });
  }, [
    navigation,
    id,
    userAddictionQuery.isSuccess,
    userAddiction?.addictionName,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userAddiction?.nextAchievement) {
        setProgress(
          getProgress({
            nextAchievement: userAddiction?.nextAchievement,
            lastRelapseDate: lastRelapseDateAsDate,
          })
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [progress, userAddiction?.nextAchievement, lastRelapseDateAsDate]);

  useEffect(() => {
    if (isSuccess) {
      setIsRelapsedMessageVisible(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      showFailToast("Something went wrong");
    }
  }, [isError]);

  return (
    <ThemedView style={{ height: deviceHeight }}>
      <OverlayActivityIndicator isVisible={isLoading} />
      <TitleDetailModal
        isVisible={isRelapsedMessageVisible}
        onClose={() => setIsRelapsedMessageVisible(false)}
        title={data?.title ?? ""}
        description={data?.body ?? ""}
        primaryButtonTitle={t("recovery.iUnderstood")}
      />
      <RelapseModal
        addictionId={id as string}
        isVisible={isRelapseModalVisible}
        onClose={() => setIsRelapseModalVisible(false)}
      />
      <ResetTimerModal
        isVisible={isResetTimerModalVisible}
        resetTimerAction={resetTimerAction}
        onClose={() => setIsResetTimerModalVisible(false)}
      />
      <ScrollView>
        <View style={styles.container}>
          <ThemedText
            style={{ paddingHorizontal: 16, paddingTop: 16 }}
            type="header1"
          >
            {t("recovery.currentObjective")}
          </ThemedText>
          <View
            style={{ justifyContent: "center", alignItems: "center" }}
          ></View>
          <CardView style={{ alignItems: "center" }}>
            <ArcProgressBar
              type="secondary"
              progress={Math.min(progress, 100)}
              size={120}
              strokeWidth={14}
            />
            <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>
              {userAddiction?.nextAchievement.duration}{" "}
              {t(`time.${userAddiction?.nextAchievement.durationType}`)}
            </ThemedText>
            <View style={{ gap: 16, alignItems: "center" }}>
              <RecoveryDurationBold
                title={t("recovery.sinceLastUsage")}
                lastRelapseDate={lastRelapseDateAsDate}
              />
            </View>
          </CardView>
          {!!userAddiction?.aiNote && (
            <View style={{ paddingHorizontal: 16 }}>
              <MinaMessage message={userAddiction?.aiNote ?? ""} />
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              if (userAddiction) {
                router.navigate(
                  `/addiction/achievements/${userAddiction?.addictionId}`
                );
              }
            }}
          >
            <CardView style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <IconSymbol
                    name="target"
                    size={28}
                    color={Colors.dark.primary}
                  />
                  <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>
                    {t("recovery.showAchievements")}
                  </ThemedText>
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={16}
                  weight="medium"
                  color={
                    theme === "light" ? Colors.light.icon : Colors.dark.icon
                  }
                />
              </View>
            </CardView>
          </TouchableOpacity>
          <ThemedView
            style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
          >
            <PrimaryButton
              style={{ alignItems: "center" }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsRelapseModalVisible(true);
                logEvent(analytics, "about_to_relapse_pressed", {
                  addiction: userAddiction?.addictionName,
                });
              }}
            >
              <ThemedText style={{ color: "#fff" }}>
                {t("recovery.imAboutToRelapse")}
              </ThemedText>
            </PrimaryButton>
            <SecondaryButton
              style={{ alignItems: "center" }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setIsResetTimerModalVisible(true);
              }}
            >
              <ThemedText style={{ color: Colors.dark.primary }}>
                {t("recovery.resetTimer")}
              </ThemedText>
            </SecondaryButton>
          </ThemedView>
        </View>
        <View style={{ height: 200 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
