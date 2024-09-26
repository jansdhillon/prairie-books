"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { ToastAction } from "./ui/toast";
import { useToast } from "@/hooks/use-toast";
import { ReactNode, useEffect } from "react";

const Feedback = ({children}: {children: ReactNode | ReactNode[]}) => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  const { toast } = useToast();


  const router = useRouter();

  const queryString = searchParams.toString();

  useEffect(() => {
    if (message) {
      toast({
        variant: "default",
        title: "Message",
        description: message,
      });
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
    if (success) {
      toast({
        variant: "success",
        title: "Success",
        description: success,
      });
    }

    return () => {
      router.refresh();
    }
  }, [message, error, success, toast, router, queryString]);

  return <div>{children}</div>;
};

export default Feedback;
