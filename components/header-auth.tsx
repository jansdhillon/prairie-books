import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { getUserAndUserData } from "@/app/actions/get-user";
import { NavAvatar } from "./nav-avatar";

export default async function AuthButton() {
  const data = await getUserAndUserData();

  const user = data?.user;
  const userData = data?.userData;

  if (!user) {
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
    return (
      <div className="flex items-center gap-3 md:gap-5">
        {userData && userData.is_admin ? (
          <Link href="/admin">
            <Button variant={"outline"}  size={"sm"}>Admin</Button>
          </Link>
        ) : null}
        <Link href="/cart">
          <Button variant={"ghost"} size={"sm"}>
            <ShoppingCart className="h-4 text-muted-foreground" />
          </Button>
        </Link>
        <NavAvatar userData={userData} user={user} />
      </div>
    );
  }
}
