import CardView from "@/components/CardView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation("");
  const theme = useColorScheme() ?? "light";

  const aboutButtons = [
    {
      title: t("about.privacyPolicy"),
      url: "https://vitaloop.app/contracts/privacy-policy.html",
    },
    {
      title: t("about.termsOfUse"),
      url: "https://vitaloop.app/contracts/terms-and-conditions.html",
    },
  ];

  const renderItem = ({ item }: { item: { title: string; url: string } }) => {
    return (
      <TouchableOpacity
        key={item.title}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
        }}
        onPress={async () => {
          await WebBrowser.openBrowserAsync(item.url);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <ThemedText style={{ fontSize: 16 }}>{item.title}</ThemedText>
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
        {aboutButtons.map((entry) => renderItem({ item: entry }))}
      </CardView>
    </ThemedView>
  );
};

export default About;
