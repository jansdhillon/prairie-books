import { ReactNode } from "react";

export default async function Template({ children }: { children: ReactNode }) {
  return <div className="container mx-auto space-y-6 ">{children}</div>;
}
