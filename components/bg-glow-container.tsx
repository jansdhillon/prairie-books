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
    <div className="relative mx-auto p-4 ">
      <div
        className={cn(className, `z-0 absolute -inset-10  rounded-full blur-3xl bg-cool-color  opacity-[12%]   backdrop-blur-3xl `)}
      ></div>
      <div className="relative z-10 ">{children}</div>
    </div>
  );
};

export default BgGlowContainer;
