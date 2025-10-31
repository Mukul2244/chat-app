"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import PersonalConversationItem from "./_components/PersonalConversationItem";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import GroupConversationItem from "./_components/GroupConversationItem";

type Props = React.PropsWithChildren<object>;

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemList title="Conversations" action={<CreateGroupDialog />}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex justify-center items-center">
              No conversations found
            </p>
          ) : (
            <div className="w-full h-full flex flex-col gap-2">
              {
              [...conversations]
                .sort((a, b) => (b?.lastMessage?.createdAt || 0) - (a?.lastMessage?.createdAt || 0))
                .map((conv) => {
                  return conv.c.isGroup ? (
                    <GroupConversationItem
                      key={conv.c._id}
                      id={conv.c._id}
                      name={conv.c.name || ""}
                      lastMessageSender={conv.lastMessage?.sender || ""}
                      lastMessageContent={conv.lastMessage?.content || ""}
                      unseenCount={conv.unseenCount}
                    />
                  ) : (
                    <PersonalConversationItem
                      key={conv.c._id}
                      id={conv.c._id}
                      username={conv.otherMember?.username || ""}
                      imageUrl={conv.otherMember?.imageUrl || ""}
                      lastMessageSender={conv.lastMessage?.sender || ""}
                      lastMessageContent={conv.lastMessage?.content || ""}
                      unseenCount={conv.unseenCount}
                    />
                  );
                })}
            </div>
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
