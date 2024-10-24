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
        className={cn(className, `z-0 absolute -inset-10 rounded-3xl blur-3xl bg-cool-color mx-10  md:ml-16 md:mr-16 opacity-[17%] backdrop-blur-3xl `)}
      ></div>
      <div className="relative z-10 ">{children}</div>
    </div>
  );
};

export default BgGlowContainer;
