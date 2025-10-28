"use client";
import React, { useEffect } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { useQuery } from "convex/react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import Message from "./Message";
import { useMutationState } from "@/hooks/useMutationState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  members: {
    lastSeenMessageId?: Id<"messages">;
    username?: string;
    [key: string]: unknown;
  }[];
};

const Body = ({ members }: Props) => {
  const { conversationId } = useConversation();
  const messages = useQuery(api.messages.get, {
    conversationId: conversationId as Id<"conversations">,
  });
  const { mutate: markRead } = useMutationState(api.conversation.markRead);

  useEffect(() => {
    if (messages && messages.length > 0) {
      markRead({
        conversationId: conversationId as Id<"conversations">,
        messageId: messages[0].message._id,
      });
    }
  }, [messages?.length, conversationId]);

  const formatSeenBy = (names: string[]) => {
    switch (names.length) {
      case 1: {
        return (
          <p className="text-muted-foreground text-sm text-right">
            Seen by {names[0]}
          </p>
        );
      }
      case 2: {
        return (
          <p className="text-muted-foreground text-sm text-right">
            Seen by {names[0]} and {names[1]}
          </p>
        );
      }
      default: {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-muted-foreground text-sm text-right">
                  Seen by {names[0]}, {names[1]} and {names.length - 2} others
                </p>
              </TooltipTrigger>
              <TooltipContent>
                {/* <p className="text-muted-foreground text-sm text-right">
                  {names.join(", ")}
                </p> */}
                <ul>
                  {names.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    }
  };

  const getSeenMessage = (messageId: Id<"messages">) => {
    const seenUsers = members
      .filter((member) => member.lastSeenMessageId === messageId)
      .map((member) => member.username!.split(" ")[0]);

    if (seenUsers.length === 0) return undefined;
    return formatSeenBy(seenUsers);
  };
  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {messages?.map(
        ({ message, senderImage, senderName, isCurrentUser }, idx) => {
          const lastByUser =
            messages[idx - 1]?.message.senderId ===
            messages[idx].message.senderId;

          const seenMessage = isCurrentUser
            ? getSeenMessage(message._id)
            : undefined;
          return (
            <Message
              key={idx}
              fromCurrentUser={isCurrentUser}
              senderImage={senderImage}
              senderName={senderName}
              lastByUser={lastByUser}
              content={message.content}
              seen={seenMessage}
              createdAt={message._creationTime}
              type={message.type}
            />
          );
        }
      )}
    </div>
  );
};

export default Body;
