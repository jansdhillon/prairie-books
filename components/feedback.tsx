"use client";

import { useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";

const Feedback = () => {
  const searchParams = useSearchParams();

  if (searchParams.has("message")) {
    return <Alert variant={"default"}>{searchParams.get("message")}</Alert>;
  } else if (searchParams.has("error")) {
    return <Alert variant={"destructive"}>{searchParams.get("error")}</Alert>;
  } else if (searchParams.has("success")) {
    return <Alert variant={"success"}>{searchParams.get("success")}</Alert>;
  } else {
    return null;
  }
};

export default Feedback;
