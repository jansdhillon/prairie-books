"use server";

import { EmailTemplate } from "@/components/email-template";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { Resend } from "resend";

type emailType = "contact" | "newsletter" | "order-confirmation" | "shipping-confirmation" | "delivery-confirmation";

export const sendEmail = async (formData: FormData, type: emailType) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      const name = formData.get('name')?.toString();
      const email = formData.get('email')?.toString();
      const message = formData.get('message')?.toString();


      if (!name || !email || !message) {
        return console.error('Missing required fields');
      }
      const { data, error } = await resend.emails.send({
        from: "Kathrin's Books <noreply@updates.kathrinsbooks.com>",
        to: 'kathrindhillon@gmail.com',
        subject: 'New Contact Form Submission',
        react: EmailTemplate({name, email, message}),
      });
    } catch (error) {
        return redirect(getErrorRedirect("/contact", "Error", "Failed to send message"));
    }

    return redirect(getStatusRedirect("/contact", "Success", "Message sent!"));

};
