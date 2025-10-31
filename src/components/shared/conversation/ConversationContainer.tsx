import { Card } from "@/components/ui/card";
import React from "react";

type Props = React.PropsWithChildren<object>;

const ConversationContainer = ({children}: Props) => {
  return (
    <Card className="w-full h-[calc(100dvh)] lg:h-full p-2 flex flex-col gap-2 rounded-none border-none">
      {children}
    </Card>
  );
};

export default ConversationContainer;
