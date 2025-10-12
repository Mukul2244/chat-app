"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import PersonalConversationItem from "./_components/PersonalConversationItem";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemList title="Conversations">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex justify-center items-center">
              No conversations found
            </p>
          ) : (
            conversations.map((conv) => {
              return conv.c.isGroup ? null : (
                <PersonalConversationItem
                  key={conv.c._id}
                  id={conv.c._id}
                  username={conv.otherMember?.username || ""}
                  imageUrl={conv.otherMember?.imageUrl || ""}
                />
              );
            })
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
