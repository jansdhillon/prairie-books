"use server";

import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

export const sendEmail = async (formData: FormData) => {
  console.log("formData", formData);
    console.log("Resend", process.env.RESEND_API_KEY)
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      const name = formData.get('name')?.toString();
      const email = formData.get('email')?.toString();
      const message = formData.get('message')?.toString();

      console.log(name, email, message);

      if (!name || !email || !message) {
        return console.error('Missing required fields');
      }
      const { data, error } = await resend.emails.send({
        from: "Kathrin's Books <contact@orders.kathrinsbooks.com>",
        to: 'imightbejan@gmail.com',
        subject: 'New Contact Form Submission',
        react: EmailTemplate({name, email, message}),
      });
        console.log(data);
        console.log(error);
    } catch (error) {
        console.log(error);
    }

};
