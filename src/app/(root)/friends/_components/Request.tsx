import React from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../../../../../convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

type Props = {
  id: Id<"requests">;
  imageUrl: string;
  username: string;
  email: string;
};

const Request = ({ id, imageUrl, username, email }: Props) => {
  const { mutate: rejectRequest, pending: rejectPending } = useMutationState(
    api.request.reject
  );
  const { mutate: acceptRequest, pending: acceptPending } = useMutationState(
    api.request.accept
  );
  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2">
      <div className="truncate flex items-center gap-4 ">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size={"icon"}
          disabled={rejectPending || acceptPending}
          onClick={() =>
            acceptRequest({ id })
              .then(() => {
                toast.success("Friend request accepted!");
              })
              .catch((err) => {
                toast.error(
                  err instanceof ConvexError
                    ? err.data
                    : "Something went wrong!!"
                );
              })
          }
        >
          <Check />
        </Button>
        <Button
          size={"icon"}
          disabled={rejectPending || acceptPending}
          onClick={() =>
            rejectRequest({ id })
              .then(() => {
                toast.success("Friend request rejected!");
              })
              .catch((err) => {
                toast.error(
                  err instanceof ConvexError
                    ? err.data
                    : "Something went wrong!!"
                );
              })
          }
          variant={"destructive"}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default Request;
