import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";
import { CardDescription } from "./ui/card";
import { Separator } from "./ui/separator";

export const Education = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 " id="education">
      <div className="container mx-auto px-10">
        <div className="flex flex-col items-center  justify-center space-y-8 text-center">
          <div>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-3 border-0  bg-secondary dark:text-white rounded-full px-4 py-2 text-sm "
            >
              <div>🎓</div> <p>Education</p>
            </Badge>
          </div>
          <div className="">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tighter  text-primary">
              My Academic Journey
            </h2>
          </div>
          <Separator />
          <div className="max-w-3xl">
            <div className="flex items-center md:items-start justify-center space-x-3 md:space-x-5 mb-3">
              <Image
                src="/ubc.svg"
                alt="UBC"
                width={25}
                height={25}
                quality={100}
              />
              <h3 className="text-lg md:text-xl font-bold">
                The University of British Columbia
              </h3>
            </div>
            <div className=" md:text-base space-y-3 mb-8">
              <p className="text-muted-foreground font-semibold text-sm">
                September 2020 - April 2024
              </p>
              <p>Bachelor of Science, Major in Computer Science</p>
              <p className="font-medium">
                <span className="">Cumulative GPA: </span>
                87% (High Distinction, Dean&apos;s List 2023-2024)
              </p>
            </div>
            <div className="text-sm md:text-base space-y-6 text-left">
              <p>
                I graduated from UBC with distinction this spring and received
                my Bachelor of Science degree with a major in Computer Science.
                I learned a lot through my studies and I am excited to apply
                this foundation to my career!
              </p>
              <div>
                <h4 className="font-bold text-lg mb-2">Key Courses:</h4>
                <ul className="grid grid-cols-2 gap-2 list-disc pl-5">
                  <li className="pl-1">Software Engineering</li>
                  <li className="pl-1">Algorithm Analysis</li>
                  <li className="pl-1">Data Structures</li>
                  <li className="pl-1">Human Computer Interaction</li>
                  <li className="pl-1">Data Analysis</li>
                  <li className="pl-1">Databases</li>
                  <li className="pl-1">
                    Directed Studies in Software Development
                  </li>
                  <li className="pl-1">
                    Capstone Software Engineering Degree Course
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Acknowledgements:</h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li className="pl-1">
                    Recognized by the UBC Cloud Innovation Centre, a
                    collaboration between AWS and UBC, as having the best
                    project in our hackathon-style Capstone Software Engineering
                    degree course.
                  </li>
                  <li className="pl-1">
                    Recipient of the Southern Interior Trust Development
                    Scholarship and the Alexander Rutherford Scholarship.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
