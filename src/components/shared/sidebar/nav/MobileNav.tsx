"use client";

import { Card } from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";

const MobileNav = () => {
  const paths = useNavigation();
  const { isActive } = useConversation();
  return (
    <Card
      className={cn(
        "fixed bottom-0 w-[calc(100vw)] flex items-center h-16 p-2 lg:hidden",
        {
          hidden: isActive,
        },
        'rounded-none'
      )}
    >
      <nav className="w-full h-full">
        <ul className="flex justify-evenly items-center">
          {paths.map((path) => (
            <li className="relative" key={path.name}>
              <Link href={path.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        size={"icon"}
                        variant={path.active ? "default" : "outline"}
                      >
                        {path.icon}
                      </Button>
                      {path.count ? (
                        <Badge  className="absolute left-6 bottom-7 px-1.5">
                          {path.count}
                        </Badge>
                      ) : null}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{path.name}</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
          <li>
            <ModeToggle />{" "}
          </li>
          <li>
            <Button variant={"outline"} className="p-2">
              <UserButton />
            </Button>
          </li>
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
