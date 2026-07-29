/**
 * Site-wide SEO primitives: canonical constants, entity/org data, and
 * schema.org JSON-LD builders shared across every route (homepage, contact,
 * solutions, blog). Blog-specific builders (BlogPosting, blog Breadcrumb,
 * blog FAQ) live in `@/lib/blog` and re-export the constants below to avoid
 * duplication.
 */

export const SITE_URL = "https://blogspage.com";
export const SITE_NAME = "Blogspage";
export const SITE_LEGAL_NAME = "Blogspage";
export const ORGANIZATION_DESCRIPTION =
  "Blogspage is a senior product-engineering agency building production-grade SaaS platforms, AI automation, and custom digital systems for founders and local businesses across Hyderabad, Telangana, and India.";

export const CONTACT = {
  email: "ravi@blogspage.com",
  telephone: "+91-80194-43314",
  streetAddress: "Ayodhya Nagar Colony, Mehdipatnam",
  addressLocality: "Hyderabad",
  addressRegion: "Telangana",
  postalCode: "500028",
  addressCountry: "IN",
} as const;

/** Public, verifiable profile links — schema.org sameAs. */
export const SAME_AS = [
  "https://x.com/ravindra5k",
  "https://github.com/RaviBuilds",
  "https://www.linkedin.com/in/ravindra-kamble-97094220a/",
];

/** Areas the agency actively serves — strengthens local + national relevance signals. */
export const SERVICE_AREAS = ["Hyderabad", "Telangana", "India"];

export type BreadcrumbEntry = { name: string; item: string };

/** Generic schema.org BreadcrumbList builder, reusable across all route types. */
export function buildBreadcrumbJsonLd(
  items: BreadcrumbEntry[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

/**
 * The core Organization entity. Referenced (by @id) from WebSite,
 * ProfessionalService, and LocalBusiness so every page points at a single,
 * de-duplicated entity — the pattern search engines and LLM crawlers use to
 * resolve "who is behind this site."
 */
export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/blogspage-logo.png`,
      width: 2156,
      height: 647,
    },
    image: `${SITE_URL}/blogspage-logo.png`,
    description: ORGANIZATION_DESCRIPTION,
    email: CONTACT.email,
    telephone: CONTACT.telephone,
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: CONTACT.addressLocality,
        addressRegion: CONTACT.addressRegion,
        addressCountry: CONTACT.addressCountry,
      },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.streetAddress,
      addressLocality: CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.addressCountry,
    },
    sameAs: SAME_AS,
    founder: {
      "@type": "Person",
      name: "Ravi",
    },
  };
}

/** schema.org WebSite entity, including the SearchAction that unlocks the Google sitelinks search box. */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: ORGANIZATION_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blogs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * ProfessionalService + LocalBusiness signals combined. Blogspage is a
 * service-area business (remote-capable, based in Hyderabad) rather than a
 * storefront, so `areaServed` carries the local-SEO weight instead of a
 * public visiting address for walk-ins.
 */
export function buildProfessionalServiceJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/blogspage-logo.png`,
    description: ORGANIZATION_DESCRIPTION,
    email: CONTACT.email,
    telephone: CONTACT.telephone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.streetAddress,
      addressLocality: CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.addressCountry,
    },
    areaServed: SERVICE_AREAS.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "19:00",
    },
    sameAs: SAME_AS,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

/** schema.org ContactPage — for the /contact route. */
export function buildContactPageJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#contactpage`,
    url: `${SITE_URL}/contact`,
    name: "Contact Blogspage",
    description:
      "Get in touch with Blogspage for AI automation, SaaS development, and product engineering in Hyderabad, India.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: { "@id": `${SITE_URL}/#business` },
  };
}

/** schema.org Person — for author bylines and dedicated author pages. */
export function buildPersonJsonLd(person: {
  name: string;
  slug?: string;
  jobTitle?: string;
  imageUrl?: string;
  sameAs?: string[];
  description?: string;
}): Record<string, unknown> {
  const url = person.slug
    ? `${SITE_URL}/blogs/author/${person.slug}`
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(url && { "@id": `${url}#person`, url }),
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.imageUrl && { image: person.imageUrl }),
    ...(person.description && { description: person.description }),
    ...(person.sameAs?.length && { sameAs: person.sameAs }),
    worksFor: { "@id": `${SITE_URL}/#organization` },
  };
}

/** schema.org Service — for the /solutions/[slug] vertical landing pages. */
export function buildServiceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  areaServed: string;
  serviceType: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    serviceType: input.serviceType,
    areaServed: { "@type": "City", name: input.areaServed },
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

/** schema.org FAQPage — generic, reusable outside the blog context too. */
export function buildFaqPageJsonLd(
  faq: { question: string; answer: string }[],
): Record<string, unknown> | null {
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
