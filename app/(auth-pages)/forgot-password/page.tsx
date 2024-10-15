import { forgotPasswordAction } from "@/app/actions/forgot-password";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="flex flex-1 flex-col space-y-6 mx-auto text-primary">
      <h1 className="text-2xl font-bold text-left">Reset Password</h1>
      <Separator />
      <p className="text-lg text-muted-foreground">
        Already have an account?{" "}
        <Link className=" font-medium underline" href="/sign-in">
          Sign In
        </Link>
      </p>



      <form className="flex-1 flex flex-col text-base">
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />

          <SubmitButton formAction={forgotPasswordAction} pendingText="Resetting...">
            Reset Password
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
