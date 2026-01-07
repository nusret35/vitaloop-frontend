import CardView from "@/components/CardView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, useColorScheme, View } from "react-native";

const AdvancedOptions = () => {
  const { t } = useTranslation();
  const theme = useColorScheme() ?? "light";

  const aboutButtons = [
    {
      title: t("advancedOptions.resetPassword"),
      action: () => router.push("/profile/advancedOptions/resetPassword/page"),
    },
    {
      title: t("advancedOptions.deleteAccount"),
      action: () =>
        router.push("/(app)/profile/advancedOptions/deleteAccount/page"),
    },
  ];

  const renderItem = ({
    item,
    onPress,
  }: {
    item: string;
    onPress: () => void;
  }) => {
    return (
      <TouchableOpacity
        key={item}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
        }}
        onPress={onPress}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <ThemedText style={{ fontSize: 16 }}>{item}</ThemedText>
        </View>
        <IconSymbol
          name="chevron.right"
          size={16}
          weight="medium"
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <CardView>
        {aboutButtons.map((entry) =>
          renderItem({ item: entry.title, onPress: entry.action })
        )}
      </CardView>
    </ThemedView>
  );
};

export default AdvancedOptions;
