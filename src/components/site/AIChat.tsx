import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your **HealthyGrinz AI Dental Assistant** 🦷. Ask me anything about tooth pain, whitening, braces, implants, pricing, or booking an appointment.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (res.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
        setLoading(false);
        return;
      }
      if (res.status === 402) {
        toast.error("AI usage limit reached. Please try again later.");
        setLoading(false);
        return;
      }
      if (!res.ok || !res.body) throw new Error("Chat failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages([...next, { role: "assistant", content: assistant }]);
            }
          } catch {
            /* ignore parse errors */
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Chat error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-2 left-2 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-elegant transition-all hover:shadow-glow ${open ? "opacity-0 pointer-events-none" : ""}`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-5 w-5" />
        <span className="font-medium">Chat with AI</span>
      </button>

      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-4 right-6 z-40 grid h-16 w-16 place-items-center bg-primary text-primary-foreground shadow-elegant transition-all hover:shadow-glow ${open ? "opacity-0 pointer-events-none" : ""}`}
        aria-label="Open AI Assistant chat"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {open && (
        <div className="fixed bottom-6 left-6 z-50 w-[calc(100vw-3rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col rounded-3xl glass shadow-elegant animate-fade-up overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-primary-gradient text-primary-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div>
                <div className="font-semibold text-sm">HealthyGrinz AI Assistant</div>
                <div className="text-xs opacity-80">Online · Powered by AI</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary-gradient text-primary-foreground rounded-br-sm" : "bg-white text-foreground shadow-card rounded-bl-sm"}`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-primary">
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-card">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:120ms]" />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 border-t border-border/50 bg-white/60 flex gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a tooth issue, pricing, booking…"
              className="flex-1 rounded-full px-4 py-2.5 bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid place-items-center h-10 w-10 rounded-full bg-primary-gradient text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
