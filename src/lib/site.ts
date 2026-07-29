/**
 * Blogspage identity: the single source of truth for site URL, brand name,
 * locale, NAP, opening hours, and social profiles.
 *
 * Requirement 5.2 (Organization `sameAs` identical to the footer hrefs) and
 * Requirement 8.5 (NAP character-identical across `/contact`, `/privacy`,
 * `/terms`, and the `LocalBusiness` node) are identity claims. They hold by
 * construction only if every surface reads these constants instead of keeping
 * its own copy, so nothing here should be duplicated at a call site.
 *
 * Pure module: no I/O, no React, no framework imports.
 */

export const SITE_URL = "https://blogspage.com";
export const SITE_NAME = "Blogspage";

/**
 * Locale, in the two spellings the platform needs: the Open Graph
 * underscore form and the BCP 47 form for the document `lang` attribute
 * (Requirement 4.6).
 */
export const LOCALE = { openGraph: "en_IN", html: "en-IN" } as const;

/**
 * TODO(business-owner): CONFIRM BEFORE `/about` SHIPS.
 *
 * The founding year appears nowhere in the repository, so this value is a
 * placeholder, not a researched fact. Requirement 8.4 has `/about` state the
 * founding year as visible text; publishing a guessed year is a false
 * statement about the business. The owner must confirm the real year and
 * replace this constant before task 10.3 renders it.
 */
export const FOUNDING_YEAR = 2024;

/**
 * Name, address, and phone as published on `/contact`.
 *
 * `/contact` is authoritative: it renders the address as three lines
 * ("Ayodhya Nagar Colony, Mehdipatnam" / "Hyderabad, Telangana 500028" /
 * "India"), whereas `/privacy` and `/terms` fold the country onto the
 * locality line as "Hyderabad, Telangana 500028, India". Those two pages are
 * migrated to this shape in task 7.2.
 *
 * `legalName` is "Blogspage", the name `/privacy` and `/terms` both render
 * above their address blocks. The footer's copyright line reads "Blogspage
 * Agency"; that is a copyright notice, not a NAP name, and is left alone.
 */
export const NAP = {
  legalName: "Blogspage",
  streetAddress: "Ayodhya Nagar Colony, Mehdipatnam",
  locality: "Hyderabad",
  region: "Telangana",
  postalCode: "500028",
  country: "India",
  countryCode: "IN",
  telephone: "+91 80194 43314",
  telephoneHref: "tel:+918019443314",
  email: "ravi@blogspage.com",
  emailHref: "mailto:ravi@blogspage.com",
} as const;

/**
 * Opening hours in Schema.org `openingHours` syntax, covering all seven days
 * (Requirement 5.4).
 *
 * `/contact` currently renders "Mon–Sat, 10:00 AM – 7:00 PM IST", which
 * contradicts a seven-day `openingHours` value. Task 7.2 changes that copy to
 * render from this constant, so the page and the markup agree. If seven-day
 * availability is wrong as a business fact, change this constant and both
 * surfaces follow.
 */
export const OPENING_HOURS = "Mo-Su 10:00-19:00";

/** Human-readable rendering of {@link OPENING_HOURS} for page copy. */
export const OPENING_HOURS_DISPLAY = "Mon–Sun, 10:00 AM – 7:00 PM IST";

/**
 * The three profile URLs the footer renders, character-identical to the
 * hrefs in `src/components/layout/footer.tsx` as of this commit. These are
 * the `Organization` `sameAs` array (Requirement 5.2); the footer is migrated
 * to read them from here in task 7.3 so the two cannot drift.
 */
export const SOCIAL_PROFILES = [
  { label: "X (Twitter)", href: "https://x.com/ravindra5k" },
  { label: "GitHub", href: "https://github.com/RaviBuilds" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ravindra-kamble-97094220a/",
  },
] as const;

export type SocialProfile = (typeof SOCIAL_PROFILES)[number];
export type Nap = typeof NAP;
export type Locale = typeof LOCALE;
