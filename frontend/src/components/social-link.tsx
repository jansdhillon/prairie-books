import { SocialLinkProps } from "@/lib/types";
import Link from "next/link";

export const SocialLink = ({ icon, username, link }: SocialLinkProps) => (
    <Link href={link} className="flex flex-row gap-2 place-items-center">
      {icon}
      <p>{username}</p>
    </Link>
  );
