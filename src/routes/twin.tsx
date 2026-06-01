import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { twinChat } from "@/lib/ai.functions";
import { ModuleShell, inputCls, btnCls, ErrorBox, SrH2 } from "@/components/ModuleShell";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/twin")({
  head: () =>
    routeHead({
      path: "/twin",
      title: "Career Twin // CareerOS",
      description:
        "Your 24/7 conversational AI career strategist — reasons across hiring panels, mock interviews, skill gaps, and readiness scores to plan your next move.",
      serviceName: "Career Twin Conversational AI",
    }),
  component: Page,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How do I qualify for Staff Engineer at Stripe by Q3?",
  "Give me a 4-week plan to crack a frontend role at Vercel.",
  "What's the strongest portfolio for an AI Engineer in 2026?",
  "Why might I get rejected at FAANG and how do I fix it?",
];

function Page() {
  const run = useServerFn(twinChat);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Twin online. I have context on hiring trends, role expectations, and your CareerOS modules. What are we solving?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setErr(null);
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await run({ data: { history: messages, message: text } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setErr(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleShell num="07" tag="TWIN" title="The Career Twin" subtitle="Your 24/7 conversational career strategist. It can reason about any of the six modules above.">
      <div className="panel scanlines rounded-md">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="mono text-[10px] text-muted-foreground">Twin_Session.live</div>
          <div className="mono flex items-center gap-2 text-[10px] text-signal"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />ONLINE</div>
        </div>
        <div className="max-h-[55vh] min-h-[40vh] overflow-y-auto p-5">
          <div className="space-y-5">
            {messages.map((m, i) => (
              <div key={i} className="mono text-[13px] leading-relaxed">
                <div className={m.role === "user" ? "text-muted-foreground" : "text-signal"}>
                  [{m.role === "user" ? "USER" : "TWIN"}]:
                </div>
                <div className="whitespace-pre-wrap text-foreground/95">{m.content}</div>
              </div>
            ))}
            {loading && <div className="mono text-[12px] text-muted-foreground">[TWIN]: thinking_</div>}
            <div ref={endRef} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} disabled={loading} className="mono rounded-sm border border-border px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:border-signal hover:text-signal disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-border p-3">
          <input className={inputCls} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your Twin anything…" disabled={loading} />
          <button type="submit" disabled={loading || !input.trim()} className={btnCls}>SEND →</button>
        </form>
      </div>
      {err && <div className="mt-4"><ErrorBox message={err} /></div>}
    </ModuleShell>
  );
}
