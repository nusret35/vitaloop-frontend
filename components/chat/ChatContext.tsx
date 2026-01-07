import {
  useFetchIsLimitReachedQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} from "@/services/chat";
import { MessageType } from "@/types/messageType";
import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FlatList, LayoutAnimation, ListRenderItem } from "react-native";
import ChatBubbleAi from "./ChatBubbleAi";
import ChatBubbleUser from "./ChatBubbleUser";

interface ChatContextType {
  messages: ChatMessage[];
  lastMessageDate?: string;
  isLoading: boolean;
  isLimitReached: boolean;
  flatListRef: RefObject<FlatList<ChatMessage | DateSeperator>>;
  allMessagesRetrieved: boolean;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setIsLimitReached: (value: boolean) => void;
  handleSend: (message: string) => void;
  renderItem: ListRenderItem<ChatMessage> | null | undefined;
  fetchNextPage: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const isLimitReachedQuery = useFetchIsLimitReachedQuery();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastMessageDate, setLastMessageDate] = useState<string>();
  const [isAllMessagesRetrieved, setIsAllMessagesRetrieved] =
    useState<boolean>(false);
  const flatListRef = useRef<FlatList<ChatMessage | DateSeperator>>(null);
  const [getMessages, { data }] = useLazyGetMessagesQuery();
  const [allMessagesRetrieved, setAllMessagesRetrieved] =
    useState<boolean>(false);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);

  const fetchNextPage = useCallback(async () => {
    if (isAllMessagesRetrieved) {
      return;
    }
    const response = await getMessages({ before: lastMessageDate }).unwrap();
    if (response.lastMessageDate) {
      setLastMessageDate(response.lastMessageDate);
    } else {
      setIsAllMessagesRetrieved(true);
    }
  }, [lastMessageDate]);

  const handleSend = async (message: string) => {
    const time = new Date();
    if (message.trim()) {
      const updatedMessages = [
        {
          type: MessageType.ASSISTANT,
          message: "",
          isLoading: true,
          createdAt: new Date(time.getTime() + 1000).toISOString(),
        },
        {
          type: MessageType.USER,
          message: message,
          createdAt: time.toISOString(),
        },
        ...messages,
      ];
      setMessages(updatedMessages);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      try {
        const response = await sendMessage({ message }).unwrap();

        if (response && response.message) {
          setMessages([
            {
              message: response.message,
              createdAt: new Date().toISOString(),
              type: MessageType.ASSISTANT,
            },
            ...updatedMessages.filter((item) => item.isLoading !== true),
          ]);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
      } catch (err) {
        setIsLimitReached(true);
        setMessages(updatedMessages.filter((item) => item.isLoading !== true));
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
    }
  };

  const renderItem = useCallback(({ item }: { item: ChatMessage }) => {
    return item.type === MessageType.ASSISTANT ? (
      <ChatBubbleAi message={item} isLoading={item.isLoading} />
    ) : (
      <ChatBubbleUser message={item} />
    );
  }, []);

  useEffect(() => {
    if (data) {
      if (data.messages.length === 0) {
        setAllMessagesRetrieved(true);
      } else {
        setMessages([...messages, ...data.messages]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isLimitReachedQuery.isSuccess) {
      setIsLimitReached(isLimitReachedQuery.data ?? false);
    }
  }, [isLimitReachedQuery.data]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        lastMessageDate,
        isLimitReached,
        isLoading,
        flatListRef,
        allMessagesRetrieved,
        setMessages,
        setIsLimitReached,
        handleSend,
        renderItem,
        fetchNextPage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
