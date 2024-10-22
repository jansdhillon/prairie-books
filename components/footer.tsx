import Link from "next/link";
import { Separator } from "./ui/separator";

export const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs py-4 gap-4 text-primary">
      <p>2024 Kathrin's Books</p>
      <Separator orientation="vertical" />
      <Link href="/">Privacy Policy</Link>
      <Separator orientation="vertical" />
      <Link href="/">Terms of Service</Link>
    </footer>
  );
};
