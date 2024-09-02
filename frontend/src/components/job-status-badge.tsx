import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Badge } from "./ui/badge";

export const JobStatusBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-3">
      <Badge className="bg-accent px-4 py-2 rounded-full space-x-3 hover:bg-accent ">
        <div className="h-2 w-2  bg-green-400 rounded-full text-primary animate-pulse ease-in-out repeat-[2]"></div>

        <div className="text-foreground font-semibold text-xs md:text-sm">
          Ready to Join Your Team
        </div>
      </Badge>
    </div>
  );
};
