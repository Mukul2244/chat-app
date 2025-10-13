"use client";
import React from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { useQuery } from "convex/react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import Message from "./Message";

const Body = () => {
  const { conversationId } = useConversation();
  const messages = useQuery(api.messages.get, {
    conversationId: conversationId as Id<"conversations">,
  });
  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {messages?.map(
        ({ message, senderImage, senderName, isCurrentUser }, idx) => {
          const lastByUser =
            messages[idx - 1]?.message.senderId ===
            messages[idx].message.senderId;
          return (
            <Message
              key={idx}
              fromCurrentUser={isCurrentUser}
              senderImage={senderImage}
              senderName={senderName}
              lastByUser={lastByUser}
              content={message.content}
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
