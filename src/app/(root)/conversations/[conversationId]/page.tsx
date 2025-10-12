"use client";
import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import { Loader2 } from "lucide-react";
import Header from "../_components/_components/Header";
import Body from "../_components/_components/body/Body";
import ChatInput from "../_components/_components/input/ChatInput";
import { use } from "react";

type Props = {
  params: Promise<{ conversationId: Id<"conversations"> }>;
};

const ConversationPage = ({ params }: Props) => {
  const { conversationId } = use(params);
  const conversation = useQuery(api.conversation.get, { id: conversationId });
  return conversation === undefined ? (
    <div className="flex w-full h-full items-center justify-center">
      <Loader2 className="h-8 w-8" />
    </div>
  ) : conversation === null ? (
    <p className="flex w-full h-full items-center justify-center">
      {" "}
      Conversation not found
    </p>
  ) : (
    <ConversationContainer>
      <Header
        imageUrl={
          conversation.isGroup ? undefined : conversation.otherMember?.imageUrl
        }
        name={
          (conversation.isGroup
            ? conversation.name
            : conversation.otherMember.username) || ""
        }
      />
      <Body />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;
