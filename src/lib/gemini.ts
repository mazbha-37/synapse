import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export function createSystemPrompt(widgetData?: Record<string, unknown>): string {
  const basePrompt = `You are Synapse AI, an intelligent assistant embedded in a data command center dashboard. You have access to the user's real-time dashboard data provided below as context. Use this data to provide specific, data-driven insights when answering questions. Be concise, analytical, and helpful. Format responses with markdown when useful. If the user asks about data not in the context, acknowledge what you don't have access to.`;

  if (widgetData && Object.keys(widgetData).length > 0) {
    return `${basePrompt}\n\nCURRENT DASHBOARD DATA:\n${JSON.stringify(widgetData, null, 2)}`;
  }

  return basePrompt;
}

export async function streamChatResponse(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  widgetData?: Record<string, unknown>
) {
  const model = getGeminiModel();

  const systemPrompt = createSystemPrompt(widgetData);

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I'm Synapse AI, ready to help analyze your dashboard data." }] },
      ...history,
    ],
  });

  return chat.sendMessageStream(message);
}

export function generateQuickInsightPrompt(widgetType: string, widgetData: unknown): string {
  return `Analyze this ${widgetType} data and provide a brief, insightful summary. Focus on key trends, notable values, or interesting patterns. Keep your response concise (2-3 sentences maximum).\n\nData: ${JSON.stringify(widgetData, null, 2)}`;
}
