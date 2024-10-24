import Link from "next/link";
import { Button } from "./ui/button";
import { CircleUserRound, ShoppingCart } from "lucide-react";
import { NavAvatar } from "./nav-avatar";

import { createClient } from "@/utils/supabase/server";
import { getUserDataById } from "@/utils/supabase/queries";
import { Avatar } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function AuthButton() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
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
            <Link href="/sign-in">
              <DropdownMenuItem>Sign In</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href="/sign-up">
              <DropdownMenuItem>Sign Up</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    const { data: userData } = await getUserDataById(supabase, user?.user!.id);
    return <NavAvatar userData={userData} />;
  }
}
