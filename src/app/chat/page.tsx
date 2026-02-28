"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STARTER_QUESTIONS = [
  "What are my strongest career paths?",
  "How do I break into fintech in HK?",
  "What skills should I develop for consulting?",
  "Why wasn't I matched with government roles?",
];

function ChatUI({ userId }: { userId: string }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { userId } }),
  });
  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 px-8 py-4">
        <h1 className="text-xl font-semibold">AI Career Advisor</h1>
        <p className="text-slate-400 text-sm">
          Ask me anything about your career path in Hong Kong
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-6">
              Start by asking a question or choose one below:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts.find((p) => p.type === "text")?.text ?? "";
          return (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-900 border border-slate-800 text-slate-200"
                }`}
              >
                {text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-slate-500 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 px-8 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your career path..."
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const uid = sessionStorage.getItem("pfhk_session_id");
    if (!uid) {
      router.replace("/onboard");
      return;
    }
    setUserId(uid);
  }, [router]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <ChatUI userId={userId} />;
}
