"use client";

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {motion} from "framer-motion";
import {RxHamburgerMenu} from "react-icons/rx";
import {ThemeSwitcher} from "@/components/theme-switcher";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetTrigger,} from "@/components/ui/sheet";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";

const NavLink = ({
                     href, children, onClick = () => {
    }
                 }: any) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`text-sm font-semibold hover:text-indigo-400  transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={onClick}
        >
            {children}
        </Link>
    );
};

export const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        {href: "#books", label: "Books"},
    ];

    return (
        <motion.header
            className="bg-background/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b "
            initial={{y: -100}}
            animate={{y: 0}}
            transition={{type: "spring", stiffness: 300, damping: 30}}
        >
            <div className="container mx-auto px-12">
                <div className="flex items-center justify-between py-5">
                    <Link href="/" className="text-primary text-lg font-bold hover:text-indigo-400 flex gap-2">
                        <div>Prairie Books</div>
                        <Image src={"/books.png"} alt={"books"} width={30} height={30}/>
                    </Link>

                    <nav className="hidden md:flex space-x-6 items-center">
                        {navItems.map((item) => (
                            <NavLink key={item.href} href={item.href}>
                                {item.label}
                            </NavLink>
                        ))}
                        <ThemeSwitcher/>
                    </nav>

                    <div className="flex items-center md:hidden">
                        <ThemeSwitcher/>
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="ml-2">
                                    <RxHamburgerMenu className="h-5 w-5"/>
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <nav className="flex flex-col space-y-4 mt-8 ">
                                    {navItems.map((item) => (
                                        <div key={item.href}>
                                            <NavLink href={item.href} onClick={() => setIsOpen(false)}>
                                                {item.label}
                                            </NavLink>
                                            <Separator className="my-2"/>
                                        </div>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};
