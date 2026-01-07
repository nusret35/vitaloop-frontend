import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "../ThemedView";
import RecoveryDuration from "../home/RecoveryDuration";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

const RecoveryEntry = ({ userAddiction }: { userAddiction: UserAddiction }) => {
  const { t } = useTranslation();
  const lastRelapseDateAsDate = new Date(
    Date.parse(userAddiction.lastRelapseDate)
  );

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.navigate(`/addiction/${userAddiction.addictionId}`);
      }}
      style={{
        gap: 8,
        borderRadius: 8,
        borderLeftColor: Colors.dark.recoveryColor,
        borderLeftWidth: 9,
        elevation: 8,
      }}
    >
      <ThemedView
        style={{
          padding: 16,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          gap: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View>
            <ThemedText style={{ fontWeight: "600", fontSize: 20 }}>
              {t(`addiction.${userAddiction.addictionName}`)}
            </ThemedText>
            <ThemedText style={{ fontSize: 14 }}>
              {userAddiction.achievements.length} {t("addiction.achievements")}
            </ThemedText>
          </View>
        </View>
        <RecoveryDuration lastRelapseDate={lastRelapseDateAsDate} />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default RecoveryEntry;
