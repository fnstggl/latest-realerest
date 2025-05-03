
import { Message } from '@/hooks/useMessages';

export const groupMessagesByDate = (messages: Message[]) => {
  // Group messages by date
  const messagesByDate: Record<string, Message[]> = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!messagesByDate[date]) {
      messagesByDate[date] = [];
    }
    messagesByDate[date].push(message);
  });
  
  return Object.entries(messagesByDate).map(([date, messages]) => ({
    date,
    messages
  }));
};
