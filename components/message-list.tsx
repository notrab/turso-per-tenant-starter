import { format, isToday, isYesterday, parseISO } from "date-fns";

import { Avatar } from "./avatar";
import { GroupedMessage } from "@/lib/utils";

function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

export function MessageList({
  groupedMessages,
}: {
  groupedMessages: GroupedMessage[];
}) {
  return (
    <div className="flex flex-col justify-end h-full overflow-y-auto p-4">
      {groupedMessages.map((group) => (
        <div key={group.message_date} className="mb-6">
          <div className="text-center text-sm text-gray-500 mb-4">
            {formatDate(group.message_date)}
          </div>
          {group.messages.map((userGroup) => (
            <div
              key={`${userGroup.user_id}-${userGroup.messages[0]?.id}`}
              className="mb-4 flex"
            >
              <div className="mr-3 flex-shrink-0">
                <Avatar name={userGroup.display_name || userGroup.username} />
              </div>
              <div className="flex-grow">
                <div className="flex items-baseline">
                  <span className="font-bold mr-2">
                    {userGroup.display_name || userGroup.username}
                  </span>
                  {userGroup.messages[0] && (
                    <span className="text-xs text-gray-500">
                      {format(
                        parseISO(userGroup.messages[0].created_at),
                        "h:mm a",
                      )}
                    </span>
                  )}
                </div>
                {userGroup.messages.map((message, index) => (
                  <div key={message.id} className="mt-1 group relative">
                    {index > 0 && (
                      <span className="absolute right-0 top-0 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {format(parseISO(message.created_at), "h:mm a")}
                      </span>
                    )}
                    <p>{message.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// export function MessageList({
//   groupedMessages,
// }: {
//   groupedMessages: GroupedMessage[];
// }) {
//   return (
//     <div className="flex flex-col-reverse overflow-y-auto p-4">
//       {groupedMessages.map((group) => (
//         <div key={group.message_date} className="mb-6">
//           <div className="text-center text-sm text-gray-500 mb-4">
//             {formatDate(group.message_date)}
//           </div>
//           {groupMessagesByUser(group.messages).map((userGroup) => (
//             <div
//               key={`${userGroup[0].user_id}-${userGroup[0].id}`}
//               className="mb-4 flex"
//             >
//               <div className="mr-3 flex-shrink-0">
//                 <Avatar
//                   name={userGroup[0].display_name || userGroup[0].username}
//                 />
//               </div>
//               <div className="flex-grow">
//                 <div className="flex items-baseline">
//                   <span className="font-bold mr-2">
//                     {userGroup[0].display_name || userGroup[0].username}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     {format(parseISO(userGroup[0].created_at), "h:mm a")}
//                   </span>
//                 </div>
//                 {userGroup.map((message, index) => (
//                   <div key={message.id} className="mt-1 group relative">
//                     {index > 0 && (
//                       <span className="absolute right-0 top-0 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         {format(parseISO(message.created_at), "h:mm a")}
//                       </span>
//                     )}

//                     <p>{message.content}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }
