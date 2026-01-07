import { Colors } from "@/constants/Colors";
import ChatBubble from "./ChatBubble";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { ThemedText } from "../ThemedText";
import { format } from "date-fns";

const ChatBubbleAi = React.memo(
  ({
    message,
    isLoading = false,
  }: {
    message: ChatMessage;
    isLoading?: boolean;
  }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [opacity]);

    return (
      <Animated.View style={{ opacity }}>
        <ChatBubble
          message={message.message}
          isLoading={isLoading}
          backgroundColor={Colors.dark.primary}
          alignSelf="flex-start"
          textAlign="left"
        />
        <ThemedText style={{ marginLeft: 12, fontSize: 12 }}>
          {format(message.createdAt, "HH:mm")}
        </ThemedText>
      </Animated.View>
    );
  }
);

ChatBubbleAi.displayName = "ChatBubbleAi";

export default ChatBubbleAi;
