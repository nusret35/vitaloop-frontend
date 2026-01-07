import Animated from "react-native-reanimated";
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItem,
  SafeAreaView,
  Platform,
} from "react-native";
import ChatInput from "./ChatInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RefObject, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import * as Device from "expo-device";
import { useTranslation } from "react-i18next";

interface ChatViewType {
  messages: ChatMessage[];
  isLimitReached: boolean;
  isLoading: boolean;
  allMessagesRetrieved: boolean;
  flatListRef: RefObject<FlatList<ChatMessage | DateSeperator>>;
  handleSend: (message: string) => void;
  renderItem: ListRenderItem<ChatMessage> | null | undefined;
  fetchNextPage: () => void;
}

const preprocessMessages = (messages: ChatMessage[], todayText: string) => {
  const processedMessages: (ChatMessage | DateSeperator)[] = [];
  let lastDate: string | null = null;
  const today = format(new Date(), "yyyy-MM-dd");

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageDate = format(new Date(message.createdAt), "yyyy-MM-dd");

    if (messageDate !== lastDate) {
      processedMessages.push({
        type: "date",
        date: today === messageDate ? todayText : messageDate,
      });
      lastDate = messageDate;
    }

    processedMessages.push(message);
  }

  return processedMessages.reverse();
};

const ChatView = ({
  messages,
  allMessagesRetrieved,
  isLoading,
  isLimitReached,
  flatListRef,
  renderItem,
  handleSend,
  fetchNextPage,
}: ChatViewType) => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  const processedMessages = useMemo(() => {
    return preprocessMessages(messages, t("chat.today"));
  }, [messages, t]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
        },
        contentContainer: {
          flex: 1,
        },
        flatListContainer: {
          flex: 1,
        },
        inputContainer: {
          paddingBottom:
            Platform.OS === "ios" && (Device.osVersion ?? 0 >= 26) ? 120 : 78,
        },
        dateSeparator: {
          alignSelf: "center",
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 16,
          marginVertical: 8,
        },
      }),
    [backgroundColor]
  );

  const customRenderItem = useCallback<
    ListRenderItem<ChatMessage | DateSeperator>
  >(
    ({ item }) => {
      if ("type" in item && item.type === "date") {
        return (
          <ThemedView
            lightColor="#dddddd"
            darkColor="#333333"
            style={styles.dateSeparator}
          >
            <ThemedText>{(item as DateSeperator).date}</ThemedText>
          </ThemedView>
        );
      }

      return renderItem ? renderItem({ item } as any) : null;
    },
    [renderItem, styles.dateSeparator]
  );

  const keyExtractor = useCallback((item: ChatMessage | DateSeperator) => {
    if ("type" in item && item.type === "date") {
      return `date-${(item as DateSeperator).date}`;
    }
    return (item as ChatMessage).createdAt;
  }, []);

  const ListFooterComponent = useCallback(() => {
    if (allMessagesRetrieved || messages.length < 10) {
      return null;
    }
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }, [allMessagesRetrieved]);

  const onEndReached = useCallback(() => {
    if (!isLoading && !allMessagesRetrieved) {
      fetchNextPage();
    }
  }, [isLoading, allMessagesRetrieved, fetchNextPage]);

  const handleSendMessage = useCallback(
    (message: string) => {
      handleSend(message);

      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
          viewPosition: 0,
        });
      }, 100);
    },
    [handleSend, flatListRef]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.contentContainer]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.flatListContainer}>
            <FlatList
              inverted
              ref={flatListRef}
              data={processedMessages}
              renderItem={customRenderItem}
              keyExtractor={keyExtractor}
              ListFooterComponent={ListFooterComponent}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.1}
              contentContainerStyle={{
                paddingBottom: 20,
                paddingTop: 20,
                flexGrow: 1,
              }}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
              }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              initialNumToRender={20}
              windowSize={10}
              getItemLayout={undefined}
              updateCellsBatchingPeriod={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <ChatInput
              isDisabled={isLoading}
              isLimitReached={isLimitReached}
              handleSend={handleSendMessage}
            />
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChatView;
