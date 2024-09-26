import { signOutAction } from "@/app/actions/sign-out";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ShoppingCart } from "lucide-react";
import { getUser } from "@/app/actions/get-user";

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  } else {
    const { userData } = await getUser(user.id);

    return (
      <div className="flex items-center gap-4">
        {userData && userData.is_admin ? (
          <Link href="/admin">
            <Button variant={"outline"}>Admin</Button>
          </Link>
        ) : null}
        <Link href="/cart">
          <Button variant={"outline"}>
            <ShoppingCart className="h-4" />
          </Button>
        </Link>
        <form action={signOutAction}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      </div>
    );
  }
}
