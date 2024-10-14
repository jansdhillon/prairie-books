"use server";

import { ContactEmailData } from "@/lib/types/types";
import { sendEmail } from "./send-email";

export const contactFormAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  const data: ContactEmailData = {
    name,
    email,
    message,
  };

  await sendEmail(data, "contact");
};
