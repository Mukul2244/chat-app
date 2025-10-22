import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CircleArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl?: string;
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
};
const Header = ({ imageUrl, name, options }: Props) => {
  return (
    <Card className="w-full flex flex-row rounded-lg items-center py-2 px-2 lg:px-4 justify-between">
      <div className="flex items-center gap-2 lg:gap-4 w-full">
        <Link href="/conversations" className="block lg:hidden">
          <CircleArrowLeft />
        </Link>
        <Avatar className="h-8 w-8">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
      </div>
      <div className="flex gap-2">
        {options ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size={"icon"} variant={"secondary"}>
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options.map((option, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onClick={option.onClick}
                  className={cn("font-semibold", {
                    "text-destructive": option.destructive,
                  })}
                ></DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </Card>
  );
};

export default Header;
