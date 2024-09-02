import { FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { RxGithubLogo } from "react-icons/rx";
import { SocialLinkProps } from "./types";

export const socialLinks: SocialLinkProps[] = [
  {
    icon: <RxGithubLogo className="h-4 w-4 md:h-6 md:w-6 font-semibold" />,
    username: "jansdhillon",
    link: "https://www.github.com/jansdhillon",
  },
  {
    icon: <FaXTwitter className="h-4 w-4 md:h-6 md:w-6 font-semibold" />,
    username: "jandhillon",
    link: "https://www.x.com/JanDhillon",
  },
  {
    icon: <FaInstagram className="h-4 w-4 md:h-6 md:w-6 font-semibold" />,
    username: "jandhillon",
    link: "https://www.instagram.com/jandhillon",
  },
  {
    icon: <FaLinkedinIn className="h-4 w-4 md:h-5 md:w-5 font-semibold" />,
    username: "Jan-Yaeger Dhillon",
    link: "https://www.linkedin.com/in/jan-yaeger-dhillon-572674239/",
  },
];
