import { format, parseISO } from "date-fns";

export type Message = {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  display_name: string;
};

export type GroupedMessage = {
  message_date: string;
  messages: {
    user_id: number;
    username: string;
    display_name: string;
    messages: {
      id: number;
      content: string;
      created_at: string;
    }[];
  }[];
};

export function groupMessagesByDate(messages: Message[]): GroupedMessage[] {
  const groupedByDate: { [date: string]: Message[] } = {};

  // Group messages by date
  messages.forEach((message) => {
    const date = format(parseISO(message.created_at), "yyyy-MM-dd");
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(message);
  });

  // Convert grouped messages to the desired format
  const groupedMessages = Object.entries(groupedByDate).map(
    ([date, messagesForDate]) => {
      const groupedByUser: GroupedMessage["messages"] = [];
      let currentUserId: number | null = null;

      // Sort messages for each date in ascending order
      messagesForDate.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      messagesForDate.forEach((message) => {
        if (message.user_id !== currentUserId) {
          groupedByUser.push({
            user_id: message.user_id,
            username: message.username,
            display_name: message.display_name,
            messages: [
              {
                id: message.id,
                content: message.content,
                created_at: message.created_at,
              },
            ],
          });
          currentUserId = message.user_id;
        } else {
          groupedByUser[groupedByUser.length - 1].messages.push({
            id: message.id,
            content: message.content,
            created_at: message.created_at,
          });
        }
      });

      return {
        message_date: date,
        messages: groupedByUser,
      };
    },
  );

  // Sort the grouped messages by date in ascending order
  return groupedMessages.sort(
    (a, b) =>
      new Date(a.message_date).getTime() - new Date(b.message_date).getTime(),
  );
}
