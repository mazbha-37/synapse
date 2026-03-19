"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { Send, Sparkles, Trash2, Bot } from "lucide-react";

interface AiChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetData: Record<string, unknown>;
  initialMessage?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const SUGGESTED_PROMPTS = [
  "What's the current market trend?",
  "Summarize my dashboard data",
  "Any interesting patterns you notice?",
  "Give me a quick briefing",
];

export function AiChatSheet({ open, onOpenChange, widgetData, initialMessage }: AiChatSheetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSentInitial = useRef(false);

  // Auto-send initialMessage when the sheet opens (e.g. from Quick Insight)
  useEffect(() => {
    if (open && initialMessage && !hasSentInitial.current && !isLoading) {
      hasSentInitial.current = true;
      handleSend(initialMessage);
    }
    if (!open) {
      hasSentInitial.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 128) + "px";
  }, [input]);

  const handleSend = async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || isLoading) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, widgetData }),
      });

      if (!response.ok) {
        let errorDetail = "AI service error";
        try {
          const errBody = await response.json();
          errorDetail = errBody.error || errorDetail;
        } catch { /* ignore */ }
        throw new Error(errorDetail);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      let assistantMessage = "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", timestamp: new Date() },
      ]);

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantMessage += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                  timestamp: updated[updated.length - 1].timestamp,
                };
                return updated;
              });
            }
          } catch { /* partial chunk — skip */ }
        }
      }

      if (!assistantMessage) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "I received an empty response. Please try again.",
            timestamp: updated[updated.length - 1].timestamp,
          };
          return updated;
        });
      }
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message.includes("GROQ_API_KEY")
            ? "GROQ_API_KEY is not set. Add it to your .env.local file."
            : error.message
          : "Something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: msg, timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between px-4 py-3 border-b bg-card space-y-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span>Synapse AI</span>
            <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              compound-beta · web search
            </span>
          </SheetTitle>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleClear}
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="flex flex-col gap-1 px-3 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Bot className="h-8 w-8 text-primary/70" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Ask Synapse AI</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Powered by Llama 3.3 via Groq. Ask anything about your
                      dashboard data or get real-time insights.
                    </p>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-2">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="text-xs text-left px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))
              )}

              {isLoading && (
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input */}
        <div className="border-t bg-card px-3 py-3">
          <div className="flex items-end gap-2 rounded-xl border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-ring transition-shadow">
            <Textarea
              ref={textareaRef}
              placeholder="Message Synapse AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              className="resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[24px] max-h-32 shadow-none"
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-8 w-8 flex-shrink-0 rounded-lg"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Enter to send · Shift+Enter for newline
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
