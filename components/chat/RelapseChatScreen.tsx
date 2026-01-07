import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, LayoutAnimation, SafeAreaView } from "react-native";
import { useFetchRelapseSupportMutation } from "@/services/chat";
import { MessageType } from "@/types/messageType";
import { useChat } from "./ChatContext";
import ChatView from "./ChatView";

const RelapseChatScreen = ({ addictionId }: { addictionId: string }) => {
  const {
    messages,
    isLimitReached,
    isLoading,
    flatListRef,
    allMessagesRetrieved,
    handleSend,
    fetchNextPage,
    renderItem,
    setMessages,
    setIsLimitReached,
  } = useChat();

  const [fetchRelapseSupport, { isLoading: isFetchRelapseSupportLoading }] =
    useFetchRelapseSupportMutation();

  const handleError = useCallback(
    (updatedMessages: ChatMessage[]) => {
      setMessages([
        {
          type: MessageType.ASSISTANT,
          message: "Sorry, I couldn't process your message. Please try again.",
          createdAt: new Date().toISOString(),
        },
        ...updatedMessages,
      ]);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
    [setMessages, flatListRef]
  );

  useEffect(() => {
    const handleAvoidRelapse = async (addiction: string) => {
      try {
        const response = await fetchRelapseSupport(addiction).unwrap();
        if (response && response.message) {
          setMessages((prevMessages) => [
            {
              message: response.message,
              createdAt: new Date().toISOString(),
              type: MessageType.ASSISTANT,
            },
            ...prevMessages.filter((item) => item.isLoading !== true),
          ]);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages.filter((item) => item.isLoading !== true),
        ]);
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          error.status === 429
        ) {
          setIsLimitReached(true);
          return;
        }

        handleError(messages);
      }
    };
    if (isLimitReached) {
      return;
    }

    if (
      (allMessagesRetrieved && messages.length === 0) ||
      (!allMessagesRetrieved && messages.length > 0)
    ) {
      const time = new Date();
      setMessages(() => [
        {
          type: MessageType.ASSISTANT,
          message: "",
          isLoading: true,
          createdAt: new Date(time.getTime() + 1000).toISOString(),
        },
        ...messages,
      ]);
      handleAvoidRelapse(addictionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!messages.length, allMessagesRetrieved]);

  return (
    <SafeAreaView style={{ height: Dimensions.get("window").height }}>
      <ChatView
        isLimitReached={isLimitReached}
        messages={messages}
        allMessagesRetrieved={allMessagesRetrieved}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading || isFetchRelapseSupportLoading}
        flatListRef={flatListRef}
        handleSend={handleSend}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default RelapseChatScreen;
