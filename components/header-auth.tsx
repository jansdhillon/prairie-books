import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { NavAvatar } from "./nav-avatar";

import { createClient } from "@/utils/supabase/server";
import { getUserDataById } from "@/utils/supabase/queries";

export default async function AuthButton() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();



  if (!user.user) {
    return (
      <div className="flex gap-5">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  } else {
    const { data: userData } = await getUserDataById(supabase, user?.user!.id);
    return (
      <div className="flex items-center gap-3 md:gap-5">
        {userData && userData.is_admin ? (
          <Link href="/admin">
            <Button variant={"outline"} size={"sm"}>
              Admin
            </Button>
          </Link>
        ) : null}
        <Link href="/cart">
          <Button variant={"ghost"} size={"sm"}>
            <ShoppingCart className="h-4 text-muted-foreground" />
          </Button>
        </Link>
        <NavAvatar userData={userData} />
      </div>
    );
  }
}
