import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { emptyCharacter } from "@/constants/Characters";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import VitaLogo from "@/components/icons/VitaLogo";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const getHeaderTitleComponent = (path?: string) => {
    if (path === "Vita") {
      return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: Colors.dark.primary,
            }}
          >
            Vita
          </ThemedText>
          <View
            style={{
              backgroundColor: Colors.dark.primary,
              borderRadius: 44,
              padding: 2,
            }}
          >
            <VitaLogo size={24} />
          </View>
        </View>
      );
    }

    return (
      <ThemedText
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: Colors.dark.primary,
        }}
      >
        {path ?? ""}
      </ThemedText>
    );
  };

  const headerOptions = (path?: string) => {
    return {
      headerTitle: () => getHeaderTitleComponent(path),
      headerTitleStyle: {
        fontFamily: "HelveticaNeue",
      },
      headerTintColor: Colors.dark.primary,
      headerBackTitle: emptyCharacter,
      keyboardHandlingEnabled: true,
      headerStyle: {
        backgroundColor:
          colorScheme === "dark"
            ? Colors.dark.background
            : Colors.light.background,
        height: 120, // 👈 adjust values as needed
      },
    };
  };

  return (
    <>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="chat/default" options={headerOptions("Vita")} />
        <Stack.Screen
          name="chat/addiction/[id]"
          options={headerOptions("Vita")}
        />
        <Stack.Screen
          name="chat/feeling/[feeling]"
          options={headerOptions("Vita")}
        />
        <Stack.Screen name="addiction/[id]" options={headerOptions()} />
        <Stack.Screen
          name="addiction/achievements/[id]"
          options={headerOptions(t("navBar.achievements"))}
        />
        <Stack.Screen name="goal" options={headerOptions()} />
        <Stack.Screen
          name="routine/page"
          options={headerOptions(t("navBar.routine"))}
        />
        <Stack.Screen
          name="setNewGoal/[goalName]/[goalUnit]"
          options={headerOptions(t("navBar.setNewGoal"))}
        />
        <Stack.Screen
          name="addNewAddiction/[addictionName]/[addictionIcon]/[addictionId]"
          options={headerOptions(t("navBar.newRecovery"))}
        />
        <Stack.Screen name="allAddictions/page" options={headerOptions()} />
        <Stack.Screen
          name="settings/page"
          options={headerOptions(t("navBar.settings"))}
        />
        <Stack.Screen name="profile/page" options={headerOptions("Profile")} />
        <Stack.Screen
          name="profile/advancedOptions/page"
          options={headerOptions(t("navBar.advancedOptions"))}
        />
        <Stack.Screen
          name="profile/advancedOptions/resetPassword/page"
          options={headerOptions(t("navBar.resetPassword"))}
        />
        <Stack.Screen
          name="profile/advancedOptions/deleteAccount/page"
          options={{
            ...headerOptions(t("navBar.deleteAccount")),
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="notification/page"
          options={headerOptions(t("navBar.notifications"))}
        />
        <Stack.Screen
          name="support/page"
          options={headerOptions(t("navBar.helpAndSupport"))}
        />
        <Stack.Screen
          name="about/page"
          options={headerOptions(t("navBar.about"))}
        />
        <Stack.Screen
          name="goalAdvice/page"
          options={{
            ...headerOptions(t("navBar.goalAdvice")),
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="routineAdvice/page"
          options={{
            ...headerOptions(t("navBar.routineAdvice")),
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="support/supportTicket/page"
          options={{
            ...headerOptions(t("navBar.supportTicket")),
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="addiction/editAddictions/page"
          options={headerOptions(t("navBar.editRecovery"))}
        />
        <Stack.Screen
          name="allGoals/page"
          options={headerOptions(t("navBar.allGoals"))}
        />
        <Stack.Screen
          options={{
            presentation: "modal",
          }}
          name="notificationDetail/[id]"
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
