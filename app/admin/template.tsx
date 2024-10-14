import { redirect } from "next/navigation";
import { getUserDataAction } from "../actions/get-user";
import { getErrorRedirect } from "@/utils/helpers";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userData, error: authError } = await getUserDataAction();

  if (authError) {
    redirect(
      getErrorRedirect("/", "Error fetching user data", authError.message)
    );
  }

  if (userData.is_admin !== true) {
    getErrorRedirect("/", "Error", "You must be an admin to view this page");
  }

  return <div className="max-w-7xl flex flex-col gap-12 ">{children}</div>;
}
