"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLink = ({ href, children, onClick = () => {} }: any) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link
        href={pathname === "/" ? href : `/${href}`}
        className={`text-sm font-semibold hover:text-primary  transition-colors ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  };
