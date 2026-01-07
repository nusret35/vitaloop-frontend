import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { FlashList } from "@shopify/flash-list";
import {
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import {
  useGetNotificationsQuery,
  useUpdateSeenStatusMutation,
} from "@/services/notification";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const Notification = () => {
  const { t } = useTranslation();
  const theme = useColorScheme() ?? "light";
  const notifications = useGetNotificationsQuery();
  const [updateSeenStatus] = useUpdateSeenStatusMutation();

  function requestPermissionsAsync() {
    return Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    requestPermissionsAsync();
  }, []);

  const renderItem = ({ item }: { item: AppNotification }) => {
    return (
      <View
        style={{ borderBottomColor: Colors.border, borderBottomWidth: 0.25 }}
      >
        <TouchableOpacity
          onPress={() => {
            updateSeenStatus({ notificationId: item.id });
            router.push(`/(app)/notificationDetail/${item.id}`);
          }}
          style={{
            height: 72,
            flex: 1,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            numberOfLines={2}
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: "600",
              overflow: "hidden",
            }}
          >
            {item.title}
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 16,
              alignItems: "center",
            }}
          >
            {!item.seen && (
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 10,
                  marginRight: 8,
                  backgroundColor: Colors.dark.primary,
                }}
              />
            )}
            <IconSymbol
              name="chevron.right"
              size={18}
              weight="medium"
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        <IconSymbol
          name="bell.slash"
          size={64}
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          style={{ opacity: 0.3, marginBottom: 20 }}
        />
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 8,
            opacity: 0.7,
          }}
        >
          {t("notification.noNotification")}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 16,
            textAlign: "center",
            opacity: 0.5,
            lineHeight: 22,
          }}
        >
          {t("notification.youAreUpToDate")}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {notifications.isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ThemedText style={{ opacity: 0.5 }}>
            {t("notification.loading")}
          </ThemedText>
        </View>
      ) : notifications.data && notifications.data.length > 0 ? (
        <View style={{ height: Dimensions.get("window").height }}>
          <FlashList
            data={notifications.data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 120 }}
            estimatedItemSize={79}
          />
        </View>
      ) : (
        <View
          style={{
            height: Dimensions.get("window").height - 180,
          }}
        >
          {renderEmptyState()}
        </View>
      )}
    </ThemedView>
  );
};

export default Notification;
