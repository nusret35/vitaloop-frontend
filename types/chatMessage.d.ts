interface ChatMessage {
  message: string;
  createdAt: string;
  type: MessageType;
  isLoading?: boolean;
}
