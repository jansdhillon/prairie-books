import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div
      className={`h-full w-full overflow-hidden p-6`}
    >
      <Skeleton className={`bg-accent `} />
    </div>
  );
};

export default Loading;
