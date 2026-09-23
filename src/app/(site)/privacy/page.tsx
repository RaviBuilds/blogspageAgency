import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { NAP } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  path: "/privacy",
  title: "Read the blogspage privacy policy",
  description:
    "Read how Blogspage collects, uses, and protects your personal data, including AI chat interactions, cookies, and information shared through our contact forms.",
  keywordPhrase: "blogspage privacy policy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
      <Breadcrumb trail={[{ name: "Privacy Policy", path: "/privacy" }]} />
      <p className="mt-6 text-sm font-medium text-primary">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-text-subtle">
        Last updated: June 17, 2025
      </p>

      <article className="prose-policy mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Introduction
          </h2>
          <p>
            Blogspage (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
            operates the website blogspage.com and provides AI automation,
            custom SaaS development, and product engineering services. This
            Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website or use our
            services.
          </p>
          <p>
            By accessing or using our services, you agree to the terms of this
            Privacy Policy. If you do not agree, please discontinue use
            immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Information We Collect
          </h2>
          <h3 className="mt-4 font-medium text-foreground">
            2.1 Information You Provide
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Name, email address, phone number, and business details submitted
              through our contact forms or AI chat widget.
            </li>
            <li>
              Project requirements, messages, and attachments shared during
              consultations.
            </li>
            <li>
              Payment and billing information processed through our secure
              third-party payment providers.
            </li>
          </ul>

          <h3 className="mt-4 font-medium text-foreground">
            2.2 Information Collected Automatically
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Device information (browser type, operating system, screen
              resolution).
            </li>
            <li>
              Usage data (pages visited, time spent, click patterns) via Vercel
              Analytics.
            </li>
            <li>
              IP address (anonymized where possible) and approximate geographic
              location.
            </li>
            <li>Cookies and similar tracking technologies (see Section 7).</li>
          </ul>

          <h3 className="mt-4 font-medium text-foreground">
            2.3 Information from AI Interactions
          </h3>
          <p>
            When you interact with our AI chat assistant (&quot;Sweety&quot;),
            your messages are transmitted to our backend and processed by
            third-party Large Language Model (LLM) providers, including
            OpenAI, to generate responses. We may store conversation logs to
            improve service quality, train internal models, and fulfill lead
            qualification purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>To provide, operate, and maintain our services.</li>
            <li>To respond to inquiries and qualify potential projects.</li>
            <li>
              To process AI-powered lead qualification and automated
              follow-ups.
            </li>
            <li>
              To improve and personalize the user experience on our website.
            </li>
            <li>
              To send project updates, invoices, and operational
              communications.
            </li>
            <li>
              To comply with legal obligations and enforce our agreements.
            </li>
            <li>
              To detect, prevent, and address technical issues and security
              threats.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. AI Processing &amp; Third-Party LLM Integrations
          </h2>
          <p>
            Our services leverage third-party AI and machine learning
            providers to deliver intelligent automation. Specifically:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>OpenAI:</strong> Powers our conversational AI agent. User
              messages are transmitted via API to OpenAI&apos;s servers for
              processing. OpenAI&apos;s data usage policies apply to data
              processed through their API. We use the API tier which does not
              use customer data for model training.
            </li>
            <li>
              <strong>Replicate:</strong> Used in select products for image
              processing and AI inference. Uploaded assets may be temporarily
              stored on Replicate&apos;s infrastructure during processing.
            </li>
            <li>
              <strong>Vercel:</strong> Hosts our web applications. Analytics
              data is collected per Vercel&apos;s privacy policy.
            </li>
            <li>
              <strong>Sanity:</strong> Content management system storing
              published content and lead records.
            </li>
          </ul>
          <p>
            We select providers that maintain SOC 2 compliance or equivalent
            security certifications. However, we cannot guarantee the security
            practices of third-party providers and encourage you to review
            their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Data Sharing &amp; Disclosure
          </h2>
          <p>
            We do not sell your personal information. We may share data in the
            following circumstances:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              With service providers and sub-processors necessary to deliver
              our services (hosting, AI inference, payment processing).
            </li>
            <li>
              When required by law, regulation, legal process, or governmental
              request.
            </li>
            <li>
              To protect the rights, privacy, safety, or property of
              Blogspage, our users, or the public.
            </li>
            <li>
              In connection with a merger, acquisition, or sale of assets
              (with prior notice).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Data Retention
          </h2>
          <p>
            We retain personal information for as long as necessary to fulfill
            the purposes outlined in this policy, or as required by law.
            Specifically:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Lead and contact data: retained for up to 3 years after last
              interaction.
            </li>
            <li>
              AI conversation logs: retained for up to 12 months for quality
              improvement, then anonymized or deleted.
            </li>
            <li>
              Project records and contracts: retained for 7 years per
              financial regulations.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Cookies &amp; Tracking Technologies
          </h2>
          <p>We use the following cookies and tracking technologies:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Essential cookies:</strong> Required for site
              functionality (session management, security).
            </li>
            <li>
              <strong>Analytics cookies:</strong> Vercel Analytics for
              anonymized usage statistics.
            </li>
            <li>
              <strong>Preference cookies:</strong> To remember your settings
              and chat state.
            </li>
          </ul>
          <p>
            You can control cookie preferences through your browser settings.
            Disabling essential cookies may impair site functionality.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            8. Your Rights (GDPR &amp; CCPA)
          </h2>
          <p>
            Depending on your jurisdiction, you may have the following rights:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Right of Access:</strong> Request a copy of the personal
              data we hold about you.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of
              inaccurate or incomplete data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> Request deletion of your
              personal data (&quot;right to be forgotten&quot;).
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> Request
              limitation of how we process your data.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> Receive your data in
              a structured, machine-readable format.
            </li>
            <li>
              <strong>Right to Object:</strong> Object to processing based on
              legitimate interests or direct marketing.
            </li>
            <li>
              <strong>Right to Opt-Out of Sale (CCPA):</strong> We do not sell
              personal information, but you may exercise this right
              nonetheless.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:ravi@blogspage.com"
              className="text-primary hover:underline"
            >
              ravi@blogspage.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. Data Security
          </h2>
          <p>
            We implement industry-standard security measures including HTTPS
            encryption, secure API authentication, access controls, and
            regular security audits. However, no method of electronic
            transmission or storage is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            10. International Data Transfers
          </h2>
          <p>
            Your data may be transferred to and processed in countries other
            than your country of residence (including the United States for
            AI/LLM processing). We ensure appropriate safeguards are in place,
            including Standard Contractual Clauses where applicable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            11. Children&apos;s Privacy
          </h2>
          <p>
            Our services are not directed to individuals under 18 years of
            age. We do not knowingly collect personal information from
            children. If we learn we have collected data from a minor, we will
            delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            12. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will
            be posted on this page with an updated &quot;Last updated&quot;
            date. Continued use of our services after changes constitutes
            acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            13. Contact Us Regarding Privacy
          </h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our
            data practices, contact us at:
          </p>
          <div className="mt-3 rounded-xl border border-border bg-card p-4 text-foreground">
            <p className="font-medium">{NAP.legalName}</p>
            <p>{NAP.streetAddress}</p>
            <p>
              {NAP.locality}, {NAP.region} {NAP.postalCode}
            </p>
            <p>{NAP.country}</p>
            <p className="mt-2">
              Email:{" "}
              <a
                href={NAP.emailHref}
                className="text-primary hover:underline"
              >
                {NAP.email}
              </a>
            </p>
            <p>Phone: {NAP.telephone}</p>
          </div>
        </section>
      </article>
    </div>
  );
}
