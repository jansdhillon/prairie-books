import Feedback from "@/components/feedback";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Feedback>
      <div className="max-w-7xl flex flex-col gap-12 ">{children}</div>
    </Feedback>
  );
}
