import { ChatProvider } from "@/components/chat/ChatContext";
import FeelingChatScreen from "@/components/chat/FeelingChatScreen";
import Feeling from "@/types/feeling";
import { useLocalSearchParams } from "expo-router";

export default function ChatScreen() {
  const { feeling } = useLocalSearchParams();

  return (
    <ChatProvider>
      <FeelingChatScreen feeling={feeling as Feeling} />
    </ChatProvider>
  );
}
