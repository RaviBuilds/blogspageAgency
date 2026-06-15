import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * A captured sales lead. Written from two surfaces:
 *  - the homepage project-brief form
 *  - the "Sweety" AI assistant (chat lead-capture tool)
 *
 * Kept intentionally simple and append-only so the studio reads like a CRM inbox.
 */
export const leadType = defineType({
  name: "lead",
  title: "Lead",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: "email" }),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "businessName",
      title: "Business / Company",
      type: "string",
    }),
    defineField({
      name: "industry",
      title: "Industry / Niche",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Project goal / challenge",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Where the lead came from (e.g. sweety-chat, homepage-form).",
      initialValue: "website",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Qualified", value: "qualified" },
          { title: "Won", value: "won" },
          { title: "Lost", value: "lost" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({
      name: "transcript",
      title: "Conversation transcript",
      type: "text",
      rows: 6,
      description: "Captured chat context, when the lead came from Sweety.",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
      business: "businessName",
    },
    prepare({ title, subtitle, status, business }) {
      return {
        title: business ? `${title} · ${business}` : title,
        subtitle: `${status ? `[${status}] ` : ""}${subtitle ?? ""}`,
      };
    },
  },
});
