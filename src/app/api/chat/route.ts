import { createOpenAI } from "@ai-sdk/openai";
import {
  streamText,
  convertToModelMessages,
  tool,
  jsonSchema,
  stepCountIs,
  type UIMessage,
} from "ai";
import { recordLead, isValidEmail } from "@/lib/lead-store";
import { AGENCY_OVERVIEW, renderServiceCatalog } from "@/lib/services-catalog";

export const dynamic = "force-dynamic";
console.log("API route");
const MODEL = "meta/llama-3.3-70b-instruct";

const SYSTEM_PROMPT = `You are "Sweety", the friendly AI assistant and lead specialist for Blogspage.

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

# Your mission (you are a lead-generation engine)
1. Greet visitors warmly and find out what they're working on.
2. Understand their business, their niche, and the specific problem or goal they have.
3. Connect their need to a relevant Blogspage capability above, in plain language and with concrete value (e.g. "own your customers instead of renting them from aggregators").
4. Naturally guide the conversation toward booking a free strategy call.
5. Collect their details so our team can follow up: name, email (required), and ideally phone, business name, and what they want to achieve.

# How to capture a lead
- Once you have at least a name and a valid email, call the \`save_lead\` tool to record the lead. Include every detail you've gathered (phone, business name, industry/niche, and their goal).
- Ask for details conversationally across the chat — never dump a form-like list of fields in one message.
- After the tool succeeds, warmly confirm that our team will reach out (within one business day) to set up the strategy call. Do not promise exact times or send real calendar invites yourself.
- Only call \`save_lead\` once per set of details unless the visitor gives you new or corrected information.

# Boundaries
- Stay focused on Blogspage's services and helping the visitor. Politely redirect off-topic questions.
- Never invent pricing, guarantees, or features that aren't described above. If unsure, say our team will cover specifics on the strategy call.
- Don't claim you've sent emails, booked calendar slots, or done anything beyond saving their details for follow-up.`;

export async function POST(request: Request) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.error("[Chat Error] Missing NVIDIA_API_KEY in environment.");
    return new Response(
      JSON.stringify({ error: "Server is not configured for chat." }),
      { status: 500 }
    );
  }

  const nvidia = createOpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey,
  });

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
      model: nvidia.chat(MODEL),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      // Allow Sweety to call save_lead and then continue the conversation.
      stopWhen: stepCountIs(4),
      tools: {
        save_lead: tool({
          description:
            "Save a qualified lead's contact details for the Blogspage team to follow up. Call this once you have at least a name and a valid email address.",
          inputSchema: jsonSchema<{
            name: string;
            email: string;
            phone?: string;
            businessName?: string;
            industry?: string;
            goal?: string;
          }>({
            type: "object",
            additionalProperties: false,
            required: ["name", "email"],
            properties: {
              name: { type: "string", description: "The visitor's full name." },
              email: {
                type: "string",
                description: "The visitor's email address.",
              },
              phone: {
                type: "string",
                description: "Phone or WhatsApp number, if shared.",
              },
              businessName: {
                type: "string",
                description: "Their business or company name, if shared.",
              },
              industry: {
                type: "string",
                description:
                  "Their industry or niche (e.g. gym, hotel, e-commerce).",
              },
              goal: {
                type: "string",
                description:
                  "What they want to achieve or the problem they want solved.",
              },
            },
          }),
          execute: async ({ name, email, phone, businessName, industry, goal }) => {
            if (!name?.trim()) {
              return { success: false, reason: "A name is required." };
            }
            if (!email?.trim() || !isValidEmail(email)) {
              return {
                success: false,
                reason: "A valid email address is required.",
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

            return {
              success: true,
              message:
                "Lead saved. The Blogspage team will reach out within one business day.",
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
