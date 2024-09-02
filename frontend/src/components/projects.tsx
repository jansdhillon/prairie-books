import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Separator } from "./ui/separator";
const ProjectCard = ({
  logo,
  title,
  subtitle,
  description,
  technologies,
  githubLink,
  demoLink,
}: any) => (
  <div
  >
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow p-6">
        <div className="flex flex-col gap-6 ">
          <div className="flex items-center justify-center space-x-3">
            {typeof logo === "string" ? (
              <Image
                src={logo}
                alt={title}
                width={30}
                height={30}
                className="rounded-md"
              />
            ) : (
              logo
            )}
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <CardDescription className=" text-sm text-muted-foreground text-center line-clamp-1 font-semibold">
            {subtitle}
          </CardDescription>
          <p className="text-sm text-center">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-6 p-6">
        <div className="flex flex-wrap justify-center gap-2">
          {technologies.map((tech: any, index: any) => (
            <Badge key={index} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          {githubLink && (
            <Link href={githubLink}>
              <FaGithub size={20} />
            </Link>
          )}
          {demoLink && (
            <Link href={demoLink}>
              <Button variant="default" size="sm">
                Demo
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  </div>
);

export const Projects = () => {
  const projects = [
    {
      logo: "/obscurus.svg",
      title: "obscurus",
      subtitle: "Capstone Software Engineering Degree Project",
      description:
        "A serverless web app powered by AWS that facilitates private online communication by allowing users to request and submit videos with face-blurring applied",
      technologies: [
        "AWS",
        "TypeScript",
        "Next.js",
        "Python",
        "OpenCV",
        "Tailwind CSS",
        "PostgreSQL",
      ],
      githubLink:
        "https://github.com/COSC-499-W2023/year-long-project-team-9/tree/master",
      demoLink: "https://youtu.be/4Sjj6J6F270",
    },
    {
      logo: "/recycling.png",
      title: "UBC Recycling",
      subtitle: "Directed Studies in Software Development",
      description:
        "A cross-platform app uses a custom object detection machine learning model and geolocation to classify scanned items as recyclable, returnable, compostable, or trash, and then direct the user to where they can properly dispose of it.",
      technologies: [
        "React Native",
        "Python",
        "TypeScript",
        "Flask",
        "YOLO",
        "Tailwind CSS",
        "PyTorch",
      ],
      demoLink: "https://www.youtube.com/watch?v=crK235Yaxlc",
    },
    {
      logo: <ShieldCheck className="text-blue-500 w-8 h-8" />,
      title: "Defend Your Data",
      subtitle: "Digital Citizenship Project",
      description:
        "An open-source web app that raises awareness about fundamental cybersecurity topics. Through various tips, interactive quizzes to test understanding, and links to additional resources, users can learn how to protect themselves in today's complex digital landscape.",
      technologies: ["Next.js", "React", "TailwindCSS", "TypeScript"],
      githubLink: "https://github.com/jansdhillon/Defend-Your-Data",
      demoLink: "https://youtu.be/v8NQ6yFvvkY?si=Bb-xsWkDyu9KaP-i",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="projects">
      <div className="container mx-auto px-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-3 border-0  bg-secondary dark:text-white rounded-full px-4 py-2 text-sm"
            >
              <div className="">🚀</div> <p>Projects</p>
            </Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tighter   mb-8 text-primary">
            Projects I&apos;ve Contributed To
          </h2>
          <Separator/>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
