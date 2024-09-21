"use server";

import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

export const sendEmail = async () => {
    console.log("Resend", process.env.RESEND_API_KEY)
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      const { data, error } = await resend.emails.send({
        from: "Kathrin's Books <contact@orders.kathrinsbooks.com>",
        to: ['kathrindhillon@gmail.com'],
        subject: 'I love you',
        react: EmailTemplate({ firstName: 'Muma' }),
      });
        console.log(data);
        console.log(error);
    } catch (error) {
        console.log(error);
    }

};
