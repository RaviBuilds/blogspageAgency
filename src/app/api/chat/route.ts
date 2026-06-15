import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";

const nvidia = createOpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const result = await streamText({
      model: nvidia("meta/llama3-70b-instruct"),
      system: `You are the elite AI Sales Development Representative (SDR) for Blogspage, an expert Web Development, SaaS, & AI Automation Agency. 
      Your goals:
      1. Briefly and confidently answer technical doubts about our core stack (Next.js, Sanity CMS, Tailwind CSS, and AI Automations).
      2. Qualify the client's business challenge (e.g., hospitality, gyms, or content-driven platforms).
      3. Secure their email address to hand off to our human engineering team for a strategy call.
      
      Tone: Executive, professional, and direct. Keep responses to 2-3 impact-driven sentences. Do not use generic lists.`,
      messages: await convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[Chat Error]", error);
    return new Response(JSON.stringify({ error: "Failed to process chat message" }), { status: 500 });
  }
}
