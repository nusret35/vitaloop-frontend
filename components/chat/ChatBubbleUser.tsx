import React, { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Animated } from "react-native";
import { ThemedText } from "../ThemedText";
import { format } from "date-fns";

interface ChatBubbleUserProps {
  message: ChatMessage;
  darkColor?: string;
  lightColor?: string;
}

const ChatBubbleUser = React.memo(
  ({
    message,
    lightColor = "#CAE9F5",
    darkColor = "#3F414E",
  }: ChatBubbleUserProps) => {
    const opacity = useRef(new Animated.Value(0)).current;

    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );

    const textColor = useThemeColor(
      { light: "#3F414E", dark: "#FFFFFF" },
      "background"
    );

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
          backgroundColor={backgroundColor}
          textColor={textColor}
          alignSelf="flex-end"
          textAlign="right"
        />
        <ThemedText
          style={{
            marginLeft: 12,
            fontSize: 12,
            textAlign: "right",
            marginRight: 12,
          }}
        >
          {format(message.createdAt, "HH:mm")}
        </ThemedText>
      </Animated.View>
    );
  }
);

ChatBubbleUser.displayName = "ChatBubbleUser";

export default ChatBubbleUser;
