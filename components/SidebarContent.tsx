import {
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { useGetUserQuery } from "@/services/user";
import { ThemedText } from "./ThemedText";
import PrimaryButton from "./PrimaryButton";
import { IconSymbol } from "./ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import NotificationIcon from "@/assets/icons/notification.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import SupportIcon from "@/assets/icons/support.svg";
import AboutIcon from "@/assets/icons/about.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SvgProps } from "react-native-svg";
import { router } from "expo-router";
import SecondaryButton from "./SecondaryButton";
import LogoutModal from "./LogoutModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UpgradeButton from "./UpgradeButton";

const SidebarContent = () => {
  const user = useGetUserQuery();
  const { t } = useTranslation();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <LogoutModal
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
      />
      <SafeAreaView>
        <View style={{ marginTop: 64 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <ThemedText type="title">{user.data?.name}</ThemedText>
            <ThemedText type="title">{user.data?.surname}</ThemedText>
          </View>
          <View style={{ marginTop: 42, gap: 32 }}>
            <SidebarButton
              icon={ProfileIcon}
              title={t("sidebar.profile")}
              action={() => router.push("/profile/page")}
            />
            <SidebarButton
              icon={NotificationIcon}
              title={t("sidebar.notification")}
              action={() => router.push("/notification/page")}
            />
            <SidebarButton
              icon={SupportIcon}
              title={t("sidebar.helpAndSupport")}
              action={() => router.push("/support/page")}
            />
            <SidebarButton
              icon={AboutIcon}
              title={t("sidebar.about")}
              action={() => router.push("/about/page")}
            />
            <View style={{ gap: 16 }}>
              {/* !user.data?.isPremium && <UpgradeButton /> */}
              <SecondaryButton
                style={{ alignItems: "center" }}
                onPress={() => setIsPopupVisible(true)}
              >
                <ThemedText style={{ color: Colors.dark.primary }}>
                  {t("sidebar.logout")}
                </ThemedText>
              </SecondaryButton>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

const SidebarButton = ({
  title,
  icon,
  action,
}: {
  title: string;
  icon: React.FC<SvgProps>;
  action: () => void;
}) => {
  const theme = useColorScheme() ?? "light";
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={action}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        {icon({ height: 24, width: 24, color })}
        <ThemedText style={{ fontSize: 16 }}>{title}</ThemedText>
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

export default SidebarContent;
