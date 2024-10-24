"use client";
import { ReactNode, Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "@/components/nav-link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import Loading from "@/app/loading";

const navItems = [
  { href: "/books", label: "Books" },
  { href: "/delivery", label: "Shipping" },
  { href: "/contact", label: "Contact" },
];

const Searchbar = ({setIsOpen} : {setIsOpen?: (isOpen: boolean) => void}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [searchTerm, setSearchTerm] = useState(query || "");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen && setIsOpen(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (query) {
      console.log("query", query);
      setSearchTerm(decodeURIComponent(query));
    }
  }, [query]);

  return (
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
  );
};

export const Nav = ({ headerAuth }: { headerAuth: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b">
      <nav className="hidden lg:flex space-x-5 items-center justify-center gap-3 py-4 px-10 bg-accent">
        <Link href="/" className="flex items-center gap-4 ">
          <div className="w-6 h-6 relative">
            <Image
              src="/logo.png"
              alt="Kathrin's Books"
              className="object-contain"
              fill
            />
          </div>
          <div className=" text-primary text-base font-bold  tracking-wider hover:text-muted-foreground min-w-max">
            Kathrin's Books
          </div>
        </Link>

        <Suspense fallback={<Loading />}>
          <Searchbar />
        </Suspense>

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

      <div className="flex items-center w-full justify-between lg:hidden py-4 px-12 bg-accent ">
        <Link href="/" className="flex items-center gap-4 ">
          <div className="w-6 h-6 relative ">
            <Image
              src="/logo.png"
              alt="Kathrin's Books"
              className="object-contain"
              fill
            />
          </div>
          <div className=" text-primary text-base font-bold  tracking-wider hover:text-muted-foreground ">
            Kathrin's Books
          </div>
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <RxHamburgerMenu className="h-5 w-5 " />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item, index) => (
                <div key={item.href}>
                  <NavLink href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </NavLink>
                  {index !== navItems.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
              <Separator className="my-2" />
              <Suspense fallback={<Loading />}>
                <Searchbar setIsOpen={setIsOpen} />
              </Suspense>
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
