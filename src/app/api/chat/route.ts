import { createOpenAI } from "@ai-sdk/openai";
import {
  streamText,
  convertToModelMessages,
  tool,
  stepCountIs,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { recordLead, isValidEmail } from "@/lib/lead-store";
import { AGENCY_OVERVIEW, renderServiceCatalog } from "@/lib/services-catalog";

export const dynamic = "force-dynamic";

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `You are "Sweety", the friendly AI sales development representative (SDR) and lead specialist for Blogspage.

# About Blogspage
${AGENCY_OVERVIEW}

# What we build (our specialties)
${renderServiceCatalog()}

# Your personality
- Warm, upbeat, and genuinely helpful — like a sharp friend who happens to be a product expert. You go by "Sweety".
- Conversational and human. Use natural, flowing sentences, not robotic lists or corporate jargon.
- Confident but never pushy. You listen first, then guide.
- Keep replies short and easy to read: usually 2-4 sentences. Ask one focused question at a time.
- Light, tasteful warmth is welcome (an occasional friendly touch), but stay professional. Never over-do emojis — at most one, and often none.

# Your conversational flow (follow these steps IN ORDER)
Step 1 — Greet & discover: Warmly greet the visitor and ask about their business or project goals. Do NOT ask for contact details yet.
Step 2 — Qualify & advise: Answer any technical questions briefly and connect their need to a relevant Blogspage capability above, in plain language with concrete value (e.g. "own your customers instead of renting them from aggregators"). Qualify the lead by understanding their niche and goal.
Step 3 — Collect details: Once the visitor is engaged, proactively ask for their Name, Email address, and Phone number so the team can schedule a free strategy call. Ask conversationally — never dump a form-like list of fields in one message.

# STRICT LEAD-CAPTURE RULES (read carefully)
- You MUST NOT call the \`save_lead\` tool until the visitor has EXPLICITLY typed at least their email address OR phone number into the chat.
- NEVER invent, guess, assume, or use placeholder/dummy contact details (no "example@email.com", no "N/A", no blanks). If you don't have a real value the visitor gave you, do not include it.
- If the visitor has not yet shared an email or phone number, your only job is to keep the conversation going and ask for them — do NOT call the tool.
- On a greeting like "Hi" or "Hello", respond per Step 1 ONLY. Calling the tool here is strictly forbidden.
- Call \`save_lead\` exactly once you have real contact details, passing every genuine detail you gathered (name, email, phone, business name, industry/niche, goal). Only call it again if the visitor corrects or adds information.
- After the tool returns success, warmly confirm our team will reach out within one business day to set up the strategy call. Do not promise exact times or send real calendar invites yourself.

# Boundaries
- Stay focused on Blogspage's services and helping the visitor. Politely redirect off-topic questions.
- Never invent pricing, guarantees, or features that aren't described above. If unsure, say our team will cover specifics on the strategy call.
- Don't claim you've sent emails, booked calendar slots, or done anything beyond saving their details for follow-up.`;

// Strict Zod schema — rejects empty/dummy payloads at the SDK boundary so the
// model cannot fire the tool with blank or invented contact details.
const saveLeadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .describe("The visitor's real full name, exactly as they typed it in the chat."),
    email: z
      .string()
      .trim()
      .email()
      .describe(
        "The visitor's real email address that they explicitly provided in the chat. Must be a valid email — never a placeholder or empty string."
      ),
    phone: z
      .string()
      .trim()
      .min(7)
      .describe("The visitor's real phone or WhatsApp number, if they shared one.")
      .optional(),
    businessName: z
      .string()
      .trim()
      .min(2)
      .describe("Their business or company name, if shared.")
      .optional(),
    industry: z
      .string()
      .trim()
      .min(2)
      .describe("Their industry or niche (e.g. gym, hotel, e-commerce), if shared.")
      .optional(),
    goal: z
      .string()
      .trim()
      .min(2)
      .describe("What they want to achieve or the problem they want solved, if shared.")
      .optional(),
  })
  .strict();

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[Chat Error] Missing OPENAI_API_KEY in environment.");
    return new Response(
      JSON.stringify({ error: "Server is not configured for chat." }),
      { status: 500 }
    );
  }

  const openai = createOpenAI({ apiKey });

  const body = await request.json().catch(() => ({}));
  const { messages }: { messages: UIMessage[] } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing messages array" }),
      { status: 400 }
    );
  }

  // Build a plain-text transcript so the saved lead carries useful context.
  const transcript = messages
    .map((m) => {
      const text = (m.parts ?? [])
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join(" ")
        .trim();
      if (!text) return null;
      const who = m.role === "user" ? "Visitor" : "Sweety";
      return `${who}: ${text}`;
    })
    .filter(Boolean)
    .join("\n");

  try {
    const result = streamText({
      model: openai.chat(MODEL),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      // Allow Sweety to call save_lead and then continue the conversation.
      stopWhen: stepCountIs(4),
      tools: {
        save_lead: tool({
          description:
            "Save a qualified lead's contact details for the Blogspage team to follow up. ONLY call this after the visitor has explicitly typed a real email address or phone number into the chat. Never call it with blank, placeholder, or invented details.",
          inputSchema: saveLeadSchema,
          execute: async ({
            name,
            email,
            phone,
            businessName,
            industry,
            goal,
          }) => {
            // Defense in depth: the Zod schema already enforces these, but we
            // re-validate so a malformed model call can never persist junk.
            if (!name?.trim() || name.trim().length < 2) {
              return { success: false, reason: "A real name is required." };
            }
            if (!email?.trim() || !isValidEmail(email)) {
              return {
                success: false,
                reason: "A valid email address provided by the visitor is required.",
              };
            }

            const res = await recordLead({
              name,
              email,
              phone,
              businessName,
              industry,
              message: goal,
              source: "sweety-chat",
              transcript,
            });

            if (!res.success) {
              return {
                success: false,
                reason: "We couldn't save the details. Please try again.",
              };
            }

            // Success is strictly tied to a persisted/recorded lead. The UI
            // should render the confirmation off this `success` flag, not the
            // model's free-text response.
            return {
              success: true,
              message: "Your details are in — our team will reach out soon.",
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("[Chat Stream Error]", error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (error) {
    console.error("[Chat Error]", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500 }
    );
  }
}
