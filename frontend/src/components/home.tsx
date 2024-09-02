"use client";
import { Badge } from "@/components/ui/badge";
import Writer from "./writer";
import { Socials } from "./socials";
import { Footer } from "./footer";
import { Projects } from "./projects";
import { Skills } from "./skills";
import { Education } from "./education";
import { Experience } from "./experience";
import { LocationBadge } from "./location-badge";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { JobStatusBadge } from "./job-status-badge";
import { Contact } from "./contact";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] pt-24">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 ">
          <div className="container px-6 ">
            <div className="flex flex-col items-center space-y-6 md:space-y-10 text-center">
              Buy books in Calgary, Alberta
            </div>
          </div>
        </section>

        <Experience />
        <Projects />
        <Education />
        <Skills />
        {/* <Contact/> */}
      </main>
      <Footer />
    </div>
  );
}
