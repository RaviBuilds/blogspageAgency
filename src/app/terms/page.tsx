import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Blogspage — AI Automation & Product Engineering Agency.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
      <p className="text-sm font-medium text-primary">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm text-white/40">
        Last updated: June 17, 2025
      </p>

      <article className="prose-policy mt-12 space-y-8 text-sm leading-relaxed text-white/70">
        <section>
          <h2 className="text-lg font-semibold text-white/90">
            1. Agreement to Terms
          </h2>
          <p>
            These Terms of Service (&quot;Terms&quot;) constitute a legally
            binding agreement between you (&quot;Client,&quot;
            &quot;you&quot;) and Blogspage (&quot;Agency,&quot; &quot;we,&quot;
            &quot;us&quot;), a product engineering and AI automation agency
            located at Ayodhya Nagar Colony, Mehdipatnam, Hyderabad, Telangana
            500028, India.
          </p>
          <p>
            By engaging our services, submitting a project brief, or using our
            website (blogspage.com), you agree to be bound by these Terms. If
            you do not agree, do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            2. Services Provided
          </h2>
          <p>Blogspage provides the following services:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Custom SaaS application development (design, engineering,
              deployment).
            </li>
            <li>
              AI automation and conversational agent development (LLM-powered
              chatbots, workflow automation, API integrations).
            </li>
            <li>
              Programmatic SEO architecture and content engine development.
            </li>
            <li>
              Product engineering consulting and technical strategy advisory.
            </li>
            <li>Ongoing maintenance and support retainers.</li>
          </ul>
          <p>
            The specific scope, deliverables, timeline, and fees for each
            engagement will be outlined in a separate Statement of Work (SOW)
            or Project Proposal agreed upon by both parties before work
            commences.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            3. Project Engagement &amp; Acceptance
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              All projects begin upon mutual agreement on a Statement of Work
              and receipt of the initial payment milestone.
            </li>
            <li>
              We reserve the right to decline any project at our discretion.
            </li>
            <li>
              Changes to scope after project commencement will be handled
              through a formal Change Request process and may affect timelines
              and fees.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            4. Payment Terms
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Payment schedules are defined in the project SOW. Typical
              structures include milestone-based payments (e.g., 40% upfront,
              30% at mid-delivery, 30% at completion).
            </li>
            <li>
              All invoices are due within 7 days of issuance unless otherwise
              specified.
            </li>
            <li>
              Late payments may incur a 1.5% monthly interest charge on the
              outstanding balance.
            </li>
            <li>
              We reserve the right to pause or suspend work on any project
              with overdue invoices exceeding 14 days.
            </li>
            <li>
              All fees are quoted in INR or USD as specified in the SOW and
              are exclusive of applicable taxes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            5. Intellectual Property
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Upon full payment, the Client receives ownership of all custom
              code, designs, and deliverables produced specifically for their
              project.
            </li>
            <li>
              Blogspage retains ownership of proprietary tools, frameworks,
              libraries, and reusable components developed independently or
              prior to the engagement (&quot;Agency IP&quot;). The Client
              receives a perpetual, non-exclusive license to use Agency IP as
              integrated into their deliverables.
            </li>
            <li>
              Third-party software, APIs, and open-source components remain
              subject to their respective licenses.
            </li>
            <li>
              We reserve the right to showcase the project in our portfolio
              and marketing materials unless a Non-Disclosure Agreement
              specifies otherwise.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            6. AI Agent &amp; LLM Output Disclaimer
          </h2>
          <p>
            Certain services involve AI-generated outputs, including but not
            limited to: conversational chatbot responses, automated content,
            image processing results, and data analysis. Regarding these
            outputs:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              AI outputs are generated programmatically by third-party Large
              Language Models (such as OpenAI GPT, Replicate models) and
              automated systems. We do not guarantee 100% accuracy,
              completeness, or fitness for a specific purpose of any
              AI-generated response.
            </li>
            <li>
              The Client acknowledges that AI systems may produce unexpected,
              inaccurate, or contextually inappropriate outputs. The Client is
              responsible for reviewing and validating AI-generated content
              before acting upon it.
            </li>
            <li>
              Blogspage shall not be liable for any decisions made, actions
              taken, or losses incurred based solely on AI-generated outputs.
            </li>
            <li>
              We implement reasonable safeguards (prompt engineering, content
              filters, human oversight protocols) to minimize erroneous
              outputs but cannot eliminate all risk.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            7. Client Responsibilities
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Provide timely feedback, approvals, and content/assets as
              outlined in the project timeline.
            </li>
            <li>
              Ensure that all materials provided to us do not infringe on
              third-party intellectual property rights.
            </li>
            <li>
              Maintain confidentiality of login credentials, API keys, and
              access tokens shared during the engagement.
            </li>
            <li>
              Delays caused by the Client (delayed feedback, missing assets)
              may result in timeline extensions at no fault of the Agency.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            8. Warranties &amp; Limitation of Liability
          </h2>
          <p>
            Services are provided &quot;as is.&quot; To the maximum extent
            permitted by law:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              We warrant that deliverables will substantially conform to the
              agreed specifications for 30 days post-delivery (&quot;Warranty
              Period&quot;). Bugs or defects reported within this period will
              be resolved at no additional cost.
            </li>
            <li>
              Beyond the Warranty Period, maintenance and fixes are subject to
              our standard hourly rates or a maintenance retainer.
            </li>
            <li>
              In no event shall Blogspage&apos;s total liability exceed the
              fees paid by the Client for the specific project giving rise to
              the claim.
            </li>
            <li>
              We are not liable for indirect, incidental, consequential,
              special, or punitive damages, including lost profits, lost data,
              or business interruption.
            </li>
            <li>
              We do not guarantee specific business outcomes (revenue
              increases, lead volumes, search rankings) unless explicitly
              committed in writing.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            9. Confidentiality
          </h2>
          <p>
            Both parties agree to maintain the confidentiality of proprietary
            information shared during the engagement. This includes business
            strategies, technical architectures, user data, and financial
            details. Confidentiality obligations survive termination of the
            agreement for a period of 2 years.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            10. Termination
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Either party may terminate the engagement with 14 days&apos;
              written notice.
            </li>
            <li>
              Upon termination, the Client is responsible for payment of all
              work completed up to the termination date.
            </li>
            <li>
              Completed deliverables will be handed over upon settlement of
              outstanding invoices.
            </li>
            <li>
              We may terminate immediately if the Client breaches these Terms,
              including non-payment exceeding 30 days.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            11. Indemnification
          </h2>
          <p>
            The Client agrees to indemnify and hold harmless Blogspage, its
            officers, and contractors from any claims, damages, or expenses
            arising from: (a) the Client&apos;s use of deliverables in
            violation of applicable laws; (b) content or materials provided by
            the Client that infringe third-party rights; (c) the Client&apos;s
            end-users&apos; interactions with deployed AI systems beyond our
            documented safeguards.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            12. Force Majeure
          </h2>
          <p>
            Neither party shall be liable for delays or failure to perform
            obligations due to circumstances beyond reasonable control,
            including natural disasters, pandemics, government actions,
            internet outages, or third-party service failures (including
            AI/LLM provider outages).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            13. Governing Law &amp; Jurisdiction
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of India. Any disputes arising from these Terms shall be
            subject to the exclusive jurisdiction of the courts in Hyderabad,
            Telangana, India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            14. Modifications
          </h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes
            take effect upon posting to this page. For active engagements,
            material changes will be communicated via email with 30
            days&apos; notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white/90">
            15. Contact
          </h2>
          <p>
            For questions regarding these Terms of Service, contact us at:
          </p>
          <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-white/80">
            <p className="font-medium">Blogspage</p>
            <p>Ayodhya Nagar Colony, Mehdipatnam</p>
            <p>Hyderabad, Telangana 500028, India</p>
            <p className="mt-2">
              Email:{" "}
              <a
                href="mailto:ravi@blogspage.com"
                className="text-primary hover:underline"
              >
                ravi@blogspage.com
              </a>
            </p>
            <p>Phone: +91 80194 43314</p>
          </div>
        </section>
      </article>
    </div>
  );
}
