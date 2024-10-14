"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/actions/sign-out";
import { Button } from "./ui/button";
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
          <Link href="/" className=" text-ellipsis">
            <DropdownMenuItem className="line-clamp-1">
              Hello, {userData.email}!
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />

          <Link href="/orders">
            <DropdownMenuItem>Orders</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />

          <form action={signOutAction}>
            <button type="submit" className="block w-full cursor-pointer">
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
