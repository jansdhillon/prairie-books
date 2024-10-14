"use server";

import { Resend } from "resend";

import { ContactEmailTemplate } from "@/components/email-templates/contact";
import { NewsletterTemplate } from "@/components/email-templates/newsletter";
import { OrderConfirmationTemplate } from "@/components/email-templates/order";
import { ShippingConfirmationTemplate } from "@/components/email-templates/shipping";
import { DeliveryConfirmationTemplate } from "@/components/email-templates/delivery";
import {
  EmailType,
  ContactEmailData,
  NewsletterEmailData,
  OrderConfirmationEmailData,
  ShippingConfirmationEmailData,
  DeliveryConfirmationEmailData,
} from "@/lib/types/types";

type EmailData =
  | ContactEmailData
  | NewsletterEmailData
  | OrderConfirmationEmailData
  | ShippingConfirmationEmailData
  | DeliveryConfirmationEmailData;

export const sendEmail = async (data: EmailData, type: EmailType) => {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    let emailTemplate: JSX.Element;
    let subject: string;
    let toEmail: string;

    switch (type) {
      case "contact": {
        const { name, email, message } = data as ContactEmailData;

        if (!name || !email || !message) {
          console.error("Missing required fields for contact email");
          throw new Error("Missing required fields for contact email");
        }

        emailTemplate = (
          <ContactEmailTemplate name={name} email={email} message={message} />
        );
        subject = "New Contact Form Submission";
        toEmail = "kathrindhillon@gmail.com";
        break;
      }

      case "newsletter": {
        const { email, content } = data as NewsletterEmailData;

        if (!email || !content) {
          console.error("Missing required fields for newsletter email");
        }

        emailTemplate = <NewsletterTemplate  content={content} />;
        subject = "Latest News from Kathrin's Books";
        toEmail = email;
        break;
      }

      case "order-confirmation": {
        const { email, orderId, orderItems, totalAmount } =
          data as OrderConfirmationEmailData;

        if (!email || !orderId || !orderItems || !totalAmount) {
          console.error("Missing required fields for order confirmation email");
          throw new Error("Missing required fields for order confirmation email");
        }

        emailTemplate = (
          <OrderConfirmationTemplate
            orderId={orderId}
            orderItems={orderItems}
            totalAmount={totalAmount}
          />
        );
        subject = "Your Order Confirmation";
        toEmail = email;
        break;
      }

      case "shipping-confirmation": {
        const {email, orderId, trackingNumber, shippingProvider } =
          data as ShippingConfirmationEmailData;

        if (
          !email ||
          !orderId ||
          !trackingNumber ||
          !shippingProvider
        ) {
          console.error(
            "Missing required fields for shipping confirmation email"
          );
          throw new Error("Missing required fields for shipping confirmation email");
        }

        emailTemplate = (
          <ShippingConfirmationTemplate
            orderId={orderId}
            trackingNumber={trackingNumber}
            shippingProvider={shippingProvider}
          />
        );
        subject = "Your Order Has Shipped";
        toEmail = email;
        break;
      }

      case "delivery-confirmation": {
        const { email, orderId } = data as DeliveryConfirmationEmailData;

        if (!email || !orderId) {
          console.error(
            "Missing required fields for delivery confirmation email"
          );
          throw new Error("Missing required fields for delivery confirmation email");
        }

        emailTemplate = (
          <DeliveryConfirmationTemplate orderId={orderId} />
        );
        subject = "Your Order Has Been Delivered";
        toEmail = email;
        break;
      }

      default:
        console.error("Invalid email type");
        throw new Error("Invalid email type");
    }

    await resend.emails.send({
      from: "Kathrin's Books <noreply@updates.kathrinsbooks.com>",
      to: toEmail,
      subject: subject,
      react: emailTemplate,
    });

  } catch (error) {
    console.error("Error sending email:", error);
  }
};
