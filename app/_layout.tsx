import "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Platform, useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useEffect } from "react";
import { Slot, SplashScreen, Stack } from "expo-router";
import { ToastProvider } from "@/toast/ToastContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { emptyCharacter } from "@/constants/Characters";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "@/i18n";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const headerOptions = (path?: string) => {
    return {
      headerTitle: () => (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: Colors.dark.primary,
          }}
        >
          {path ?? ""}
        </ThemedText>
      ),
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
      },
    };
  };

  async function getCustomerInfo() {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log(customerInfo);
  }

  useEffect(() => {
    /*
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (Platform.OS === "ios") {
      Purchases.configure({
        apiKey: "appl_pCGJsVkPZrRJDdutweqEAjzlTsi",
      });
      getCustomerInfo();
    }*/
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      registerForPushNotificationsAsync();
    }
  }, [loaded]);

  setTimeout(() => {}, 0);
  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <ToastProvider>
            <KeyboardProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="sign-in" />
                <Stack.Screen
                  name="create-account/credentials"
                  options={headerOptions("Create account")}
                />
                <Stack.Screen
                  name="create-account/profileInfo"
                  options={headerOptions("Create account")}
                />
                <Stack.Screen
                  name="(app)"
                  options={{
                    headerShown: false,
                    gestureEnabled: false,
                  }}
                />
                <Slot />
              </Stack>
            </KeyboardProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
