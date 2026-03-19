import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

function getGroqClient() {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }
  return new Groq({ apiKey });
}

export function createSystemPrompt(widgetData?: Record<string, unknown>): string {
  const base = `You are Synapse AI, an intelligent assistant embedded in a data command center dashboard. You have access to the user's real-time dashboard data as context. Provide specific, data-driven insights. Be concise, analytical, and helpful. Format responses with markdown when useful. If asked about data not in context, acknowledge that.`;

  if (widgetData && Object.keys(widgetData).length > 0) {
    return `${base}\n\nCURRENT DASHBOARD DATA:\n${JSON.stringify(widgetData, null, 2)}`;
  }
  return base;
}

export async function streamChatResponse(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  widgetData?: Record<string, unknown>
) {
  const groq = getGroqClient();
  const systemPrompt = createSystemPrompt(widgetData);

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];

  return groq.chat.completions.create({
    // compound-beta uses built-in web search for up-to-date answers
    model: "compound-beta",
    messages,
    stream: true,
    max_tokens: 1024,
    temperature: 0.7,
  });
}
