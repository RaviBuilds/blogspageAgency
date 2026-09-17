/**
 * Package FAQs for the dental pricing route. A shared, dependency-free module
 * (no `"use client"`) so the client component renders the visible section and
 * the server page emits the same pairs through `faqNode()` — one source of
 * truth, so the JSON-LD cannot drift from the rendered FAQ.
 *
 * Every answer is grounded in the published package data in
 * `dental-packages-landing.tsx` (PLANS / ADD_ONS / PAYMENT_TERMS) — no
 * invented figures, no invented outcomes.
 */
export const PACKAGE_FAQS = [
  {
    question: "How much does a dental clinic website cost?",
    answer:
      "Fixed-scope packages run from ₹14,900 (Launch Story Website, a premium single-page site) to ₹49,900 (Practice Growth, an SEO-led multi-page build with dedicated treatment pages and a blog engine). Signature AI Practice, which adds the AI chatbot and AI receptionist, starts from ₹1,25,000 depending on workflow complexity and integrations. All standard package prices are one-time unless marked monthly or yearly.",
  },
  {
    question: "Which package is right for my clinic?",
    answer:
      "A new or solo practice usually starts with the Launch Story Website. Premium Practice suits clinics that want premium design, a dedicated doctor profile page, and 24/7 online appointment booking. Practice Growth fits clinics that want a dedicated page per treatment with advanced local SEO. Signature AI Practice is for premium, multi-location, or high-volume practices that want the front desk automated. If you are unsure, we recommend the smallest plan that fits your goals on a discovery call.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery windows depend on the plan: 3–5 working days for Launch Story Website, 7–10 for Premium Practice, 14–21 for Practice Growth, and 3–6 weeks for Signature AI Practice, which is scoped individually. The process is hands-off for you after a discovery call and one design approval.",
  },
  {
    question: "Can I start with a smaller plan and upgrade later?",
    answer:
      "Yes. The plans build on each other, and you can add pages (₹2,500 per additional premium page), a blog, booking, or AI systems at any time — before or after launch. Your build is structured with an upgrade path in mind, so moving to a larger package can extend the existing foundation rather than starting over. Start with Launch. Upgrade later without rebuilding the foundation.",
  },
  {
    question: "What is not included in the package prices?",
    answer:
      "The package prices cover the website build and the features listed per plan. Ongoing services are separate add-ons: monthly SEO — Local SEO, 1 location (₹7,000/month; GBP posts/updates, citation monitoring, minor page updates, review monitoring, monthly report) or 2 locations / Growth-tier sites (₹12,000/month; same scope, doubled for a second GBP profile and more content to maintain). Also website maintenance (₹1,500/month), hosting and domain management (₹3,000/year), professional content writing (₹6,000), blog setup (₹7,500), Google Business Profile optimization (₹5,000), WhatsApp automation (₹10,000), and the AI chatbot and AI receptionist on plans where they are not already included.",
  },
  {
    question: "Do I own the website?",
    answer:
      "Yes — code, design, and content. There are no monthly platform fees and no lock-in contracts. Payment is 50% to begin, 30% after design approval, and 20% before go-live.",
  },
  {
    question: "What is the difference between a package website and the full dental digital system?",
    answer:
      "A package gives you a premium clinic website with the features of your chosen plan. The broader dental digital system — covered on our dental hospital solution page — is about the whole patient journey: treatment page architecture across specialities, doctor credential presentation, locations, press and testimonial sections, and AI-assisted appointment handling through Signature AI Practice. Most clinics start with a package and grow into the system.",
  },
];
