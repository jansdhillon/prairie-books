"use client";

import { FormEvent, ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RxHamburgerMenu } from "react-icons/rx";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "@/components/nav-link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const navItems = [
  { href: "/books", label: "All Books" },
  // { href: "/#about", label: "About" },
  { href: "/orders", label: "Orders" },
  { href: "/contact", label: "Contact" },
];

export const Nav = ({ headerAuth }: { headerAuth: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="bg-secondary/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b">
      {/* Logo */}

      <nav className="hidden md:flex space-x-4 items-center justify-center px-10 gap-2 py-4">
        <Link
          href="/"
          className="text-primary text-base font-bold min-w-[120px] tracking-tight hover:text-muted-foreground"
        >
          Kathrin's Books
        </Link>
        <div className="relative">
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={10}
          />
        </div>
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        ))}
        <ThemeSwitcher />
        {headerAuth}

        {/* Search Button */}
        {/* <Button onClick={handleSearch} variant="outline" size={"sm"}>
            Search
          </Button> */}
      </nav>

      <div className="flex items-center w-full justify-evenly md:hidden px-10 gap-5 py-4">
        <Link
          href="/"
          className="text-primary text-base font-bold line-clamp-1  tracking-tight hover:text-muted-foreground"
        >
          Kathrin's Books
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <RxHamburgerMenu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <div key={item.href}>
                  <NavLink href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </NavLink>
                  <Separator className="my-2" />
                </div>
              ))}
              <div className="relative">
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={14}
                />
              </div>
              {/* <Button onClick={handleSearch} variant="ghost" size={"sm"}>
                  Search
                </Button> */}
              <div className="flex justify-around pt-4 ">
                {" "}
                <ThemeSwitcher />
                {headerAuth}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-3"></div>
    </header>
  );
};
