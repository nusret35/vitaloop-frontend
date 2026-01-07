import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, LayoutAnimation, SafeAreaView } from "react-native";
import { useFetchFeelingSupportMutation } from "@/services/chat";
import { MessageType } from "@/types/messageType";
import { useChat } from "./ChatContext";
import ChatView from "./ChatView";
import Feeling from "@/types/feeling";
import { object } from "yup";

const FeelingChatScreen = ({ feeling }: { feeling: Feeling }) => {
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

  const [fetchFeelingSupport, { isLoading: isFetchFeelingSupportLoading }] =
    useFetchFeelingSupportMutation();

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
    const handleFeelingSupport = async (feeling: Feeling) => {
      try {
        const response = await fetchFeelingSupport({
          feeling,
          date: new Date().toISOString(),
        }).unwrap();
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
      handleFeelingSupport(feeling);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!messages.length, allMessagesRetrieved]);

  return (
    <SafeAreaView style={{ height: Dimensions.get("window").height }}>
      <ChatView
        messages={messages}
        isLimitReached={isLimitReached}
        allMessagesRetrieved={allMessagesRetrieved}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading || isFetchFeelingSupportLoading}
        flatListRef={flatListRef}
        handleSend={handleSend}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default FeelingChatScreen;
