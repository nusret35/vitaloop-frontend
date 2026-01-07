import { ChatProvider } from "@/components/chat/ChatContext";
import DefaultChatScreen from "@/components/chat/DefaultChatScreen";

export default function ChatScreen() {
  return (
    <ChatProvider>
      <DefaultChatScreen />
    </ChatProvider>
  );
}
