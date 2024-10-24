"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/actions/sign-out";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserType } from "@/lib/types/types";
import { CircleUserRound, UserIcon } from "lucide-react";
import { Button } from "./ui/button";

export const NavAvatar = ({ userData }: { userData: UserType }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          <Avatar className="hover:cursor-pointer h-5 w-5">
            <CircleUserRound className="h-5 w-5 stroke-muted-foreground" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <div className="line-clamp-1 relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
            Hello,{" "}
            {userData?.full_name?.split(" ")[0] !== undefined
              ? userData?.full_name?.split(" ")[0]
              : userData?.email.includes("kathrin")
                ? "Kathrin"
                : "Jan"}
            !
          </div>
          <DropdownMenuSeparator />

          {userData.is_admin && (
            <Link href="/admin">
              <DropdownMenuItem>Admin</DropdownMenuItem>
            </Link>
          )}

          <Link href="/orders" className="cursor-pointer">
            <DropdownMenuItem>Your Orders</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />

          <form action={signOutAction}>
            <button type="submit" className="block w-full cursor-pointer">
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
