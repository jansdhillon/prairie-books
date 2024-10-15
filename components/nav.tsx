"use client";;
import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "@/components/nav-link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const navItems = [
  { href: "/books", label: "Books" },
  { href: "/delivery", label: "Shipping & Delivery" },
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b">
      {/* Logo */}

      <nav className="hidden md:flex space-x-5 items-center justify-center gap-2 py-4 px-12 bg-accent">
        <Link
          href="/"
          className="text-primary text-base font-bold  tracking-wider hover:text-muted-foreground pr-2"
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

        {headerAuth}
        <ThemeSwitcher />

        {/* Search Button */}
        {/* <Button onClick={handleSearch} variant="outline" size={"sm"}>
            Search
          </Button> */}
      </nav>

      <div className="flex items-center w-full justify-between md:hidden py-4 px-12 bg-accent ">
        <Link
          href="/"
          className="text-primary text-base font-bold line-clamp-1 tracking-wider hover:text-muted-foreground"
        >
        Kathrin's Books
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <RxHamburgerMenu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item, index) => (
                <div key={item.href}>
                  <NavLink href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </NavLink>
                  {index !== navItems.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
              <div className="relative my-4">
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
              <div
                className="flex items-center justify-start gap-3"
                onClick={() => setIsOpen(false)}
              >
                {headerAuth}
                <ThemeSwitcher />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
