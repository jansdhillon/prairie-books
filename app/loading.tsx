import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div
      className={`gap-3 h-screen  overflow-hidden grid grid-rows-[25%__25%__25%__25%]`}
    >
      <Skeleton className={`bg-accent/40 dark:bg-accent/40 `} />
      <Skeleton className={`bg-accent/40 dark:bg-accent/40`} />
      <Skeleton className={`bg-accent/40 dark:bg-accent/40`} />
      <Skeleton className={`bg-accent/40 dark:bg-accent/40`} />
    </div>
  );
};

export default Loading;
