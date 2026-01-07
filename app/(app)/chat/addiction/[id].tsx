import { ChatProvider } from "@/components/chat/ChatContext";
import RelapseChatScreen from "@/components/chat/RelapseChatScreen";
import { useLocalSearchParams } from "expo-router";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ChatProvider>
      <RelapseChatScreen addictionId={id as string} />
    </ChatProvider>
  );
}
