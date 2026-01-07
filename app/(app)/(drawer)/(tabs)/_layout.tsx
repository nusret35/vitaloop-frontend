import { Redirect, Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, TouchableOpacity, View, Animated } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthToken } from "@/redux/hooks";
import { useTranslation } from "react-i18next";
import VitaLogo from "@/components/icons/VitaLogo";
import SideMenuIcon from "@/components/icons/SideMenuIcon";
import SidebarContent from "@/components/SidebarContent";
import { router } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { token } = useAuthToken();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-280))[0]; // Start off-screen
  const backdropAnim = useState(new Animated.Value(0))[0]; // Start transparent

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  if (!token) {
    return <Redirect href={"/sign-in"} />;
  }

  const toggleSidebar = () => {
    if (!sidebarVisible) {
      setSidebarVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -280,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSidebarVisible(false);
      });
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor },
          headerLeft: () => (
            <TouchableOpacity
              onPress={toggleSidebar}
              style={{ paddingLeft: 8 }}
            >
              <SideMenuIcon color={color} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/chat/default")}
              style={{ paddingRight: 16, marginBottom: 10 }}
            >
              <View
                style={{
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  backgroundColor: Colors.dark.primary,
                }}
              >
                <VitaLogo size={34} />
              </View>
            </TouchableOpacity>
          ),
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.home"),
            tabBarIcon: ({ color }) => (
              <Icon size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="journey"
          options={{
            title: t("tabs.journey"),
            tabBarIcon: ({ color }) => (
              <Icon size={28} name="person" color={color} />
            ),
          }}
        />
      </Tabs>

      {sidebarVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: backdropAnim,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={toggleSidebar}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: 280,
              backgroundColor,
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 5,
              elevation: 5,
              transform: [{ translateX: slideAnim }],
            }}
          >
            <SidebarContent />
          </Animated.View>
        </View>
      )}
    </>
  );
}
