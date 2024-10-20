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
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserType } from "@/lib/types/types";

export const NavAvatar = ({ userData }: { userData: UserType }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="hover:cursor-pointer w-8 h-8 text-xs">
          <AvatarFallback>{userData.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <div className="line-clamp-1 relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
            Hello, {userData?.full_name?.split(" ")[0]}!
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
