import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="leading-loose flex flex-col gap-3">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <Separator className="my-4" />
      <p>Last updated: October 23, 2024</p>

      <h2 className="text-lg font-semibold">Acceptance of Terms</h2>
      <p>
        By accessing and using Kathrin's Books ("we", "us", or "our") website
        [www.kathrinsbooks.com] (the "Site"), you accept and agree to be bound
        by these Terms of Service. If you do not agree to these terms, you
        should not use the Site.
      </p>

      <h2 className="text-lg font-semibold">Use of the Site</h2>
      <p>
        You agree to use the Site only for lawful purposes and in a way that
        does not infringe the rights of, restrict, or inhibit anyone else's use
        and enjoyment of the Site.
      </p>

      <h2 className="text-lg font-semibold">Accounts</h2>
      <p>
        When you create an account with us, you must provide information that is
        accurate, complete, and current at all times. Failure to do so
        constitutes a breach of the Terms.
      </p>

      <h2 className="text-lg font-semibold">Intellectual Property</h2>
      <p>
        The Site and its original content, features, and functionality are and
        will remain the exclusive property of Kathrin's Books and its licensors.
        All book covers and images displayed on the Site are the property of
        their respective publishers and are used solely for the purpose of
        identifying the products.
      </p>

      <h2 className="text-lg font-semibold">Purchases and Payment Processing</h2>
      <p>
        All purchases through the Site are subject to our acceptance. We reserve
        the right to refuse or cancel any order at any time for reasons
        including but not limited to product availability, errors in the
        description or price of the product, or error in your order.
      </p>
      <p>
        Transactions are securely processed through Stripe, a third-party
        payment processor. By making a purchase, you agree to Stripe's{" "}
        <Link
          className="font-medium underline"
          href="https://stripe.com/en-ca/legal"
          target="_blank"
        >
          Services Agreement
        </Link>
        .
      </p>

      <h2 className="text-lg font-semibold">Refund Policy</h2>
      <p>
        All sales are final. We do not offer refunds or exchanges for any
        products purchased on the Site unless required by law.
      </p>

      <h2 className="text-lg font-semibold">Limitation of Liability</h2>
      <p>
        In no event shall Kathrin's Books, nor its directors, employees,
        partners, agents, suppliers, or affiliates, be liable for any indirect,
        incidental, special, consequential, or punitive damages arising out of
        your access to, or use of, or inability to access or use the Site or any
        content on the Site.
      </p>

      <h2 className="text-lg font-semibold">Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws
        of the Province of Alberta and the federal laws of Canada applicable
        therein.
      </p>

      <h2 className="text-lg font-semibold">Changes to Terms</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these
        Terms at any time. What constitutes a material change will be determined
        at our sole discretion.
      </p>

      <h2 className="text-lg font-semibold">Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at:</p>
      <Link
        className="font-medium underline"
        href="mailto:kathrinsbookssupport@gmail.com"
      >
        kathrinsbookssupport@gmail.com
      </Link>

      <p>
        <strong>Disclaimer:</strong> These Terms of Service are for
        informational purposes only and do not constitute legal advice. For
        legal advice, please consult a qualified attorney.
      </p>
    </div>
  );
}
