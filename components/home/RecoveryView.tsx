import { StyleSheet, View } from "react-native";
import SecondaryPressable from "../SecondaryPressable";
import { ThemedText } from "../ThemedText";
import RecoveryDuration from "./RecoveryDuration";
import RecoveryProgress from "./RecoveryProgress";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

interface RecoveryViewProps {
  userAddiction: UserAddiction;
}

export default function RecoveryView({ userAddiction }: RecoveryViewProps) {
  const { t } = useTranslation();
  const lastRelapseDateAsDate = new Date(
    Date.parse(userAddiction.lastRelapseDate)
  );
  return (
    <SecondaryPressable
      style={styles.container}
      onPress={() => router.navigate(`/addiction/${userAddiction.addictionId}`)}
    >
      <View>
        <ThemedText style={{ fontWeight: "600", fontSize: 20, color: "#fff" }}>
          {t(`addiction.${userAddiction.addictionName}`)}
        </ThemedText>
      </View>
      <RecoveryDuration color="#fff" lastRelapseDate={lastRelapseDateAsDate} />
      <RecoveryProgress addictionId={userAddiction.addictionId} />
    </SecondaryPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    borderRadius: 16,
    padding: 16,
    height: 120,
    marginBottom: 8,
    backgroundColor: "#7bbe3a",
    justifyContent: "space-between",
  },
});
