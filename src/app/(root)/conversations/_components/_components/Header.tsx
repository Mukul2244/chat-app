import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl?: string;
  name: string;
};
const Header = ({ imageUrl, name }: Props) => {
  return (
    <Card className="w-full flex rounded-lg items-center py-2 px-2 lg:px-4 justify-between">
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
    </Card>
  );
};

export default Header;
