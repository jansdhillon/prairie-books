import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Badge } from "./ui/badge";

export const LocationBadge: React.FC = () => {
  return (
    <div
      className="inline-flex items-center "
    >
      <Badge className="bg-accent px-4 py-2 rounded-full space-x-2 hover:bg-accent ">
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 1,
          }}
        >
          <p className="h-4 w-4 text-primary ">📍</p>
        </motion.div>
        <span className="text-foreground font-semibold text-xs md:text-sm">
          Calgary, Alberta, Canada
        </span>
      </Badge>
    </div>
  );
};
