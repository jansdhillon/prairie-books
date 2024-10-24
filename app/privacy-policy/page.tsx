import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="leading-loose flex flex-col gap-3">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <Separator className="my-4" />
      <p>Last updated: October 23, 2024</p>

      <h2 className="text-lg font-semibold">Introduction</h2>
      <p>
        Welcome to Kathrin's Books ("we", "us", or "our"). We are committed to
        protecting your personal information and your right to privacy. This
        Privacy Policy explains how we collect, use, disclose, and safeguard your
        information when you visit our website [www.kathrinsbooks.com], including
        any other media form, media channel, mobile website, or mobile application
        related or connected thereto (collectively, the "Site").
      </p>

      <h2 className="text-lg font-semibold">Collection of Personal Information</h2>
      <p>
        We may collect personal information that you voluntarily provide to us
        when you register on the Site, express an interest in obtaining
        information about us or our products and services, when you participate in
        activities on the Site, or otherwise when you contact us.
      </p>

      <h2 className="text-lg font-semibold">Use of Personal Information</h2>
      <p>
        We may use your personal information for legitimate business purposes,
        including to provide and improve our services, communicate with you, and
        comply with our legal obligations.
      </p>

      <h2 className="text-lg font-semibold">Disclosure of Personal Information</h2>
      <p>
        We may share your information with third-party service providers that
        perform services on our behalf, such as payment processing, data analysis,
        email delivery, hosting services, customer service, and marketing
        assistance.
      </p>
      <p>
        Transactions are processed through Stripe. Your payment information is
        transmitted directly to Stripe and is subject to their{" "}
        <Link
          className="font-medium underline"
          href="https://stripe.com/en-ca/privacy"
          target="_blank"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <h2 className="text-lg font-semibold">Your Rights</h2>
      <p>
        In accordance with Canadian privacy laws, you have the right to access,
        correct, or delete your personal information. To exercise these rights,
        please contact us using the contact information provided below.
      </p>

      <h2 className="text-lg font-semibold">Cookies and Similar Technologies</h2>
      <p>
        We may use cookies and similar tracking technologies to access or store
        information. You can set your browser to refuse all or some browser
        cookies or to alert you when cookies are being sent.
      </p>

      <h2 className="text-lg font-semibold">Security of Your Information</h2>
      <p>
        We use administrative, technical, and physical security measures to
        protect your personal information. While we have taken reasonable steps to
        secure the personal information you provide to us, please be aware that no
        security measures are perfect or impenetrable.
      </p>

      <h2 className="text-lg font-semibold">Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of
        any changes by posting the new Privacy Policy on this page and updating
        the "Last updated" date.
      </p>

      <h2 className="text-lg font-semibold">Contact Us</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please
        contact us at:
      </p>
      <Link
        className="font-medium underline"
        href="mailto:kathrinsbookssupport@gmail.com"
      >
        kathrinsbookssupport@gmail.com
      </Link>

      <p>
        <strong>Disclaimer:</strong> This Privacy Policy is for informational
        purposes only and does not constitute legal advice. For legal advice,
        please consult a qualified attorney.
      </p>
    </div>
  );
}
