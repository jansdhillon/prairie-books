import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div
      className={`gap-3 h-screen  overflow-hidden grid grid-rows-[20%__30%__50%]`}
    >
      <Skeleton className={`bg-accent `} />
      <Skeleton className={`bg-accent `} />
      <Skeleton className={`bg-accent `} />
    </div>
  );
};

export default Loading;
