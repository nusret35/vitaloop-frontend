import { useEffect, useState } from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import ProgressBar from "../ProgressBar";
import { getNextObjectiveText, getProgress } from "@/app/util/recoveryUtils";
import { useGetUserAddictionByIdQuery } from "@/services/userAddiction";
import { useTranslation } from "react-i18next";

const RecoveryProgress = ({ addictionId }: { addictionId: string }) => {
  const { t, i18n } = useTranslation();
  const {
    data,
    refetch,
    isLoading: isRefetching,
  } = useGetUserAddictionByIdQuery(addictionId);
  const [progress, setProgress] = useState(0);
  const [refetchTrial, setRefetchTrial] = useState(0);

  useEffect(() => {
    if (progress >= 100 && !isRefetching) {
      if (refetchTrial === 10) {
        return;
      }
      refetch();
      setRefetchTrial((prev) => prev + 1);
    }
    if (progress < 100 && refetchTrial !== 0) {
      setRefetchTrial(0);
    }
  }, [progress, isRefetching]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data) {
        const lastRelapseDateAsDate = new Date(
          Date.parse(data.lastRelapseDate)
        );
        setProgress(
          getProgress({
            nextAchievement: data.nextAchievement,
            lastRelapseDate: lastRelapseDateAsDate,
          })
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [progress, data?.lastRelapseDate, data?.nextAchievement]);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <ThemedText style={{ color: "#fff" }}>
            {t("addiction.nextObjective")}
          </ThemedText>
          <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
            {data?.nextAchievement &&
              getNextObjectiveText(data?.nextAchievement, i18n.language, t)}
          </ThemedText>
        </View>
        <ThemedText style={{ color: "#fff" }}>
          {progress >= 100 ? 100 : progress.toFixed(0)}%
        </ThemedText>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
      >
        <ProgressBar progress={Math.min(progress, 100)} />
      </View>
    </View>
  );
};

export default RecoveryProgress;
