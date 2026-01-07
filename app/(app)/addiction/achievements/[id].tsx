import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useGetUserAddictionByIdQuery } from "@/services/userAddiction";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";

export default function Achievements() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const userAddictionQuery = useGetUserAddictionByIdQuery(id as string);
  const userAddiction = userAddictionQuery.data;

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  const renderItem = ({ item }: { item: SobrietyAchievement }) => {
    return (
      <View
        style={{
          backgroundColor: backgroundColor,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <IconSymbol name="target" size={28} color={Colors.dark.primary} />
        <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>
          {item.duration} {t(`time.${item.durationType}`)}
        </ThemedText>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{
          backgroundColor,
        }}
        data={userAddiction?.achievements ?? []}
        renderItem={renderItem}
      />
    </View>
  );
}
