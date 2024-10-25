import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const BgGlowContainer = ({
  children,
  className
}: {
  children: ReactNode | ReactNode[];
  className?: string;
}) => {
  return (
    <div className="relative">
      <div
        className={cn(className, `z-0 absolute h-full w-full bg-accent `)}
      ></div>
      <div className="relative z-10 ">{children}</div>
    </div>
  );
};

export default BgGlowContainer;
