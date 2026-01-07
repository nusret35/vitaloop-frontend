import React, { useCallback, useEffect } from "react";
import { useChat } from "./ChatContext";
import ChatView from "./ChatView";
import { Dimensions, LayoutAnimation, SafeAreaView } from "react-native";
import { useFetchGreetUserMutation } from "@/services/chat";
import { MessageType } from "@/types/messageType";
import { useGetUserQuery } from "@/services/user";

const DefaultChatScreen = () => {
  const {
    messages,
    isLimitReached,
    isLoading,
    flatListRef,
    allMessagesRetrieved,
    handleSend,
    renderItem,
    fetchNextPage,
    setMessages,
  } = useChat();
  const user = useGetUserQuery();
  const [fetchGreetUser, { isLoading: isGreetUserLoading }] =
    useFetchGreetUserMutation();

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
    const handleGreetUser = async () => {
      try {
        const response = await fetchGreetUser().unwrap();
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
        user.refetch();
      } catch {
        handleError(messages);
      }
    };
    if (!user.data?.isChattingFirstTime) {
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
      handleGreetUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.data, !!messages.length, allMessagesRetrieved]);

  return (
    <SafeAreaView style={{ height: Dimensions.get("window").height }}>
      <ChatView
        messages={messages}
        allMessagesRetrieved={allMessagesRetrieved}
        isLimitReached={isLimitReached}
        isLoading={isLoading}
        flatListRef={flatListRef}
        handleSend={handleSend}
        renderItem={renderItem}
        fetchNextPage={fetchNextPage}
      />
    </SafeAreaView>
  );
};

export default DefaultChatScreen;
