import CardView from "@/components/CardView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useGetNotificationByIdQuery } from "@/services/notification";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Dimensions, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";

const NotificationDetail = () => {
  const { height: deviceHeight } = Dimensions.get("window");
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const notification = useGetNotificationByIdQuery(id as string);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: Colors.dark.primary,
          }}
          numberOfLines={1}
        >
          {notification.data?.title}
        </ThemedText>
      ),
    });
  }, [navigation, notification.data?.title]);

  return (
    <ScrollView>
      <ThemedView style={{ flex: 1, height: Dimensions.get("screen").height }}>
        <CardView
          style={{ backgroundColor: Colors.dark.primary, marginBottom: 40 }}
        >
          {notification.data?.body && (
            <Markdown
              style={{
                body: {
                  color: "#fff",
                  fontFamily: "HelveticaNeue",
                  lineHeight: 20,
                },
              }}
            >
              {notification.data?.body}
            </Markdown>
          )}
        </CardView>
      </ThemedView>
    </ScrollView>
  );
};

export default NotificationDetail;
