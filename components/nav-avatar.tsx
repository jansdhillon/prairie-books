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
import { CircleUserRound, ShoppingCart, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const NavAvatar = ({ userData }: { userData: UserType }) => {
  return (
    <div className="flex items-center gap-4">
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={"sm"}>
                <Avatar className="hover:cursor-pointer h-5 w-5">
                  <CircleUserRound className="h-5 w-5 stroke-muted-foreground" />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {userData ? "Your Account" : "Sign In / Sign Up"}
          </TooltipContent>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <div className="line-clamp-1 relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none font-medium">
                Hello,{" "}
                <span className="ml-1 font-semibold">
                  {userData?.full_name?.split(" ")[0] !== undefined
                    ? userData?.full_name?.split(" ")[0]
                    : userData?.email.includes("kathrin")
                      ? "Kathrin"
                      : "Jan"}
                </span>
                !
              </div>
              <DropdownMenuSeparator />

              {userData.is_admin && (
                <Link href="/admin" className="font-medium">
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )}

              <Link href="/orders" className="cursor-pointer font-medium">
                <DropdownMenuItem>Your Orders</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />

              <form action={signOutAction}>
                <button type="submit" className="block w-full cursor-pointer font-medium">
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
      <Link href="/cart">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} size={"sm"}>
              <ShoppingCart className="h-4 text-muted-foreground fill-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Your Cart
          </TooltipContent>
        </Tooltip>
      </Link>
    </div>
  );
};
