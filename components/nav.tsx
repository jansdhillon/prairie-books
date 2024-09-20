import Link from "next/link";
import HeaderAuth from "./header-auth";
import { ThemeSwitcher } from "./theme-switcher";
import { NavLink } from "./nav-link";



export const Nav = () => {

    const navItems = [
        { href: "#featured", label: "Featured" },
        { href: "#new", label: "New" },
        { href: "#all", label: "All" },
      ];

  return (
    <nav className="container mx-auto w-full flex justify-center m border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-4  text-sm">
      <Link href="/" className="text-primary text-lg font-bold tracking-wide hover:text-muted-foreground">
            Kathrin's Books
          </Link>

          <nav className="hidden md:flex space-x-6 items-center ">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

        <div className="flex items-center gap-4">
          <HeaderAuth />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};
