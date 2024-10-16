import { signOutAction } from "@/app/actions/sign-out";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ShoppingCart } from "lucide-react";

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className="flex items-center">

      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
      <Link href="/cart">
        <Button variant={"ghost"}>
          <ShoppingCart className="h-4 fill-muted-foreground text-muted-foreground" />
        </Button>
      </Link>
    </div>
  ) : (
    <div className="flex pt-4">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
