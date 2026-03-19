import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import AiChat from "@/models/AiChat";
import { streamChatResponse } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, chatId, widgetData } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await dbConnect();

    // Load chat history from DB if chatId provided
    let history: { role: "user" | "assistant"; content: string }[] = [];
    let currentChat = null;

    if (chatId) {
      currentChat = await AiChat.findOne({ _id: chatId, userId: session.user.id });
      if (currentChat) {
        history = currentChat.messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
      }
    }

    // Get Groq stream
    const groqStream = await streamChatResponse(message, history, widgetData);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";

        try {
          for await (const chunk of groqStream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              fullResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

          // Save to DB after streaming completes
          const newMessages = [
            { role: "user" as const, content: message, timestamp: new Date() },
            { role: "assistant" as const, content: fullResponse, timestamp: new Date() },
          ];

          if (currentChat) {
            currentChat.messages.push(...newMessages);
            currentChat.updatedAt = new Date();
            await currentChat.save();
          } else {
            const title = message.slice(0, 50) + (message.length > 50 ? "..." : "");
            await AiChat.create({
              userId: session.user.id,
              messages: newMessages,
              widgetContext: widgetData ? JSON.stringify(widgetData) : undefined,
              title,
            });
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    const message =
      error instanceof Error && error.message.includes("GROQ_API_KEY")
        ? "GROQ_API_KEY is not configured"
        : "Failed to process chat message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
