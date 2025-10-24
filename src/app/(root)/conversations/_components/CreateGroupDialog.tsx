"use client";
import { useQuery } from "convex/react";
import React, { useMemo } from "react";
import z from "zod";
import { api } from "../../../../../convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CirclePlus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Didact_Gothic } from "next/font/google";

type Props = {};
const createGroupFormSchema = z.object({
  name: z.string().min(1, { message: "This field can't be empty" }),
  members: z
    .string()
    .array()
    .min(1, { message: "You must select at least one member" }),
});

const CreateGroupDialog = (props: Props) => {
  const friends = useQuery(api.friends.get);
  const { mutate: createGroup, pending } = useMutationState(
    api.friends.createGroup
  );
  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });
  const members = form.watch("members", []);
  const unselectedFriends = useMemo(() => {
    return friends
      ? friends.filter((friend: any) => !members.includes(friend._id))
      : [];
  }, [members.length, friends?.length]);

  const handleSubmit = async (
    values: z.infer<typeof createGroupFormSchema>
  ) => {
    try {
      await createGroup(values);
      form.reset();
      toast.success("Group created!");
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Something went wrong!!"
      );
    }
  };
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            {/* <Button size={"icon"} variant={"outline"}> */}
            <CirclePlus />
            {/* </Button> */}
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="block">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>Add friends to create a group</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Group name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Friends</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        disabled={unselectedFriends.length === 0}
                      >
                        <Button className="w-full" variant="outline">
                          Select friends
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {unselectedFriends.map((friend) => (
                          <DropdownMenuCheckboxItem
                            key={friend._id}
                            className="flex items-center gap-2 w-full p-2"
                            onCheckedChange={(checked) => {
                              if (checked) {
                                form.setValue("members", [
                                  ...members,
                                  friend._id,
                                ]);
                              }
                            }}
                          >
                            <Avatar className="size-8">
                              <AvatarImage src={friend.imageUrl} />
                              <AvatarFallback>
                                {friend.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <h4 className="truncate">{friend.username}</h4>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {members && members.length === 0 ? null : (
              <Card className="flex items-start gap-3 overflow-x-auto w-full h-full p-2 no-scrollbar">
                {friends
                  ?.filter((friend) => members.includes(friend._id))
                  .map((friend) => (
                    <div
                      key={friend._id}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="relative">
                        <Avatar key={friend._id}>
                          <AvatarImage src={friend.imageUrl} />
                          <AvatarFallback>
                            {friend.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <X
                          className="text-muted-foreground w-4 h-4 absolute bottom-5 left-8 bg-muted rounded-full cursor-pointer"
                          onClick={() =>
                            form.setValue(
                              "members",
                              members.filter((id) => id !== friend._id)
                            )
                          }
                        />
                      </div>
                      <p className="truncate text-sm">
                        {friend.username.split(" ")[0]}
                      </p>
                    </div>
                  ))}
              </Card>
            )}
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
