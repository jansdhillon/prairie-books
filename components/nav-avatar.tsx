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

export const NavAvatar = ({ user, userData }: { user: any; userData: any }) => {
  console.log(user.email);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="hover:cursor-pointer w-10 h-10 text-xs">
          <AvatarFallback>{userData.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Link href="/" className=" text-ellipsis">
            <DropdownMenuItem className="line-clamp-1">Hello, {userData.email}!</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Separator />
          <Link href="/orders">
            <DropdownMenuItem>Orders</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Separator />
          <Link href="/">
            <DropdownMenuItem>Home</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Separator />
          <form action={signOutAction}>
            <DropdownMenuItem>
              <button type="submit">Sign out</button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
