import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";
import ChatTypingAnimation from "./ChatTypingAnimation";

interface ChatBubbleProps {
  message: string;
  backgroundColor: string;
  alignSelf?: "flex-start" | "flex-end";
  textAlign?: "left" | "right" | "center";
  textColor?: string;
  isLoading?: boolean;
}

const ChatBubble = ({
  message,
  backgroundColor,
  alignSelf = "flex-start",
  textAlign = "left",
  textColor = "#FFF",
  isLoading = false,
}: ChatBubbleProps) => {
  const style = StyleSheet.create({
    container: {
      backgroundColor,
      borderRadius: 12,
      margin: 8,
      alignSelf,
      maxWidth: "84%",
      flexDirection: "row",
    },
  });

  return (
    <Animated.View style={style.container}>
      <View style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
        {isLoading ? (
          <ChatTypingAnimation />
        ) : (
          <Markdown
            style={{
              body: {
                color: textColor,
                fontFamily: "HelveticaNeue",
                textAlign,
                lineHeight: 20,
              },
            }}
          >
            {message}
          </Markdown>
        )}
      </View>
    </Animated.View>
  );
};

export default ChatBubble;
