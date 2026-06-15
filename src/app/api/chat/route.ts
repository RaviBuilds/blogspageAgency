import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Configure the OpenAI SDK client to redirect requests to NVIDIA's compatible API gateway
const nvidia = createOpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      // Using a premium open model available on NVIDIA NIM
      model: nvidia('meta/llama3-70b-instruct'),
      system: `You are the elite AI Sales Development Representative (SDR) for Blogspage, an expert Web Development, SaaS, & AI Automation Agency. 
      Your goals:
      1. Briefly and confidently answer technical doubts about our core stack (Next.js, Sanity CMS, Tailwinds CSS, and AI Automations).
      2. Qualify the client's business challenge (e.g., hospitality, gyms, or content-driven platforms).
      3. Secure their email address to hand off to our human engineering team for a strategy call.
      
      Tone guidelines: Executive, highly professional, direct, and conversational. Absolutely do not list out generic bullet-point features unless specifically asked. Keep responses to 2-3 impact-driven sentences.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat message' }), { status: 500 });
  }
}
