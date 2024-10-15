import { signInAction } from "@/app/actions/sign-in";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-1 flex-col space-y-6 mx-auto">
      <h1 className="text-2xl font-bold text-left">Sign In</h1>
      <Separator />

      <p className="text-lg text-muted-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign Up
        </Link>
      </p>
      <form className="flex-1 flex flex-col text-base">
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-sm text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign In
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
