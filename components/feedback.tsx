// components/Feedback.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";

const Feedback = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  if (!message) return null;

  return <Alert >{message}</Alert>;
};

export default Feedback;
