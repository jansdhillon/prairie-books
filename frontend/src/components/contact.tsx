import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "./ui/separator";

interface ContactItem {
  logo: string;
  title: string;
  company: string;
  description: string;
  responsibilities: string[];
  skills: string[];
}

const ContactCard: React.FC<ContactItem> = ({
  logo,
  title,
  company,
  description,
  responsibilities,
  skills,
}) => {

  return (
    <div>
      <Card className="h-full flex flex-col">
        <CardContent className="flex-grow p-6">
        <h1>Contact me</h1>

        </CardContent>
      </Card>
    </div>
  );
};

export const Contact: React.FC = () => {
  const Contacts: ContactItem[] = [
    {
      logo: "/cse.jpg",
      title: "Software Engineer Co-op",
      company: "Communications Security Establishment",
      description: "January 2024 - April 2024",
      responsibilities: [
        "Developed a CI/CD pipeline for a microservice deployment onto Kubernetes, enhancing reliability and efficiency.",
        "Enhanced internal analytical software using Azure, Python, Linux, and SQL, leading to improved intelligence analysis.",
        "Engaged in continuous feedback loops to enhance team productivity and professional development.",
      ],
      skills: [
        "Azure",
        "Python",
        "Kubernetes",
        "Docker",
        "SQL",
        "Linux",
        "Helm",
        "Git",
      ],
    },
    {
      logo: "/at-yellow.png",
      title: "Software Engineer Co-op",
      company: "Armilla Technology",
      description: "May 2023 - September 2023",
      responsibilities: [
        "Contributed to the development of an innovative sports tech product, promoting accessibility in athletics.",
        "Overhauled the command center web app with .NET, jQuery, and CSS, improving interactivity and accessibility.",
        "Improved Android app features with Kotlin and Java, resulting in an enriched Contact for end users.",
      ],
      skills: [
        "JavaScript",
        ".NET",
        "Kotlin",
        "CSS",
        "jQuery",
        "Java",
        "Android",
        "Git",
      ],
    },
    {
      logo: "/ubc.png",
      title: "Student Support Analyst I",
      company: "The University of British Columbia",
      description: "September 2022 - April 2023",
      responsibilities: [
        "Streamlined student support by creating clear, accessible documentation, greatly reducing troubleshooting time.",
        "Provided technical troubleshooting with a high satisfaction rate, resolving 70% more issues than the previous year.",
        "Collaborated across teams to enhance on-campus support services, improving operational efficiency.",
      ],
      skills: [
        "ServiceNow",
        "Microsoft Office",
        "Confluence",
        "Windows",
        "MacOS",
        "Linux",
      ],
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="Contact">
      <div className="container mx-auto px-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-3 border-0  bg-secondary  dark:text-white rounded-full px-4 py-2 text-sm"
            >
              <div className=" ">💼</div> <p> Work Contact</p>
            </Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tighter mb-8 text-primary">
            Teams I&apos;ve Worked With
          </h2>
          <Separator/>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {Contacts.map((exp, index) => (
              <ContactCard key={index} {...exp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
