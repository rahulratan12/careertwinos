import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { mockInterview } from "@/lib/ai.functions";
import { ModuleShell, Field, Panel, inputCls, btnCls, ScoreBar, ErrorBox, Loader, SrH2 } from "@/components/ModuleShell";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/mock-interview")({
  head: () =>
    routeHead({
      path: "/mock-interview",
      title: "AI Mock Interviews // CareerOS",
      description:
        "Live mock interviews graded by a Tier-1 AI interviewer. Get scored answers, a model response, and follow-up questions for any target role.",
      serviceName: "AI Mock Interview",
    }),
  component: Page,
});

function Page() {
  const run = useServerFn(mockInterview);
  const [role, setRole] = useState("Backend Engineer (Go)");
  const [q, setQ] = useState<{ question: string; category: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [eval_, setEval] = useState<any | null>(null);
  const [loading, setLoading] = useState<"" | "q" | "a">("");
  const [err, setErr] = useState<string | null>(null);

  const startQ = async () => {
    setLoading("q"); setErr(null); setQ(null); setAnswer(""); setEval(null);
    try { setQ(await run({ data: { role, phase: "start" } })); }
    catch (e: any) { setErr(e?.message ?? "Failed"); }
    finally { setLoading(""); }
  };

  const submitA = async () => {
    if (!q || !answer.trim()) return;
    setLoading("a"); setErr(null); setEval(null);
    try { setEval(await run({ data: { role, phase: "answer", question: q.question, answer } })); }
    catch (e: any) { setErr(e?.message ?? "Failed"); }
    finally { setLoading(""); }
  };

  return (
    <ModuleShell num="04" tag="INTERVIEW" title="AI Mock Interviews" subtitle="Stress-test your responses with an AI that mimics lead engineers from Tier-1 firms. Get scored, get a model answer, get follow-ups.">
      <Panel className="space-y-4">
        <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
          <Field label="Target Role / Track"><input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
          <button onClick={startQ} disabled={loading === "q"} className={btnCls}>{loading === "q" ? "LOADING…" : q ? "NEW QUESTION →" : "START INTERVIEW →"}</button>
        </div>
        {loading === "q" && <Loader label="GENERATING QUESTION" />}
      </Panel>

      {err && <div className="mt-6"><ErrorBox message={err} /></div>}

      {q && (
        <Panel className="mt-6 space-y-4">
          <div className="mono text-[10px] text-signal">// {q.category.toUpperCase()}</div>
          <p className="text-lg leading-snug">{q.question}</p>
          <Field label="Your Answer"><textarea className={`${inputCls} min-h-[180px]`} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Think out loud. Be structured: context → approach → tradeoffs." /></Field>
          <div className="flex items-center gap-3">
            <button onClick={submitA} disabled={loading === "a" || !answer.trim()} className={btnCls}>{loading === "a" ? "GRADING…" : "SUBMIT ANSWER →"}</button>
            {loading === "a" && <Loader label="EVALUATING" />}
          </div>
        </Panel>
      )}

      <SrH2>Results</SrH2>
      {eval_ && (
        <div className="mt-6 grid gap-6 md:grid-cols-5">
          <Panel className="md:col-span-2 text-center">
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Score</div>
            <div className="mt-3 text-7xl font-light text-signal">{eval_.score}<span className="text-2xl text-muted-foreground">/10</span></div>
            <div className="mt-4"><ScoreBar value={eval_.score} /></div>
          </Panel>
          <Panel className="md:col-span-3 space-y-4">
            <div>
              <div className="mono text-[10px] text-signal">+ STRENGTHS</div>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">{eval_.strengths?.map((s: string, i: number) => <li key={i}>· {s}</li>)}</ul>
            </div>
            <div>
              <div className="mono text-[10px] text-warn">→ IMPROVE</div>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">{eval_.improvements?.map((s: string, i: number) => <li key={i}>· {s}</li>)}</ul>
            </div>
          </Panel>
          <Panel className="md:col-span-5">
            <div className="mono mb-2 text-[10px] text-muted-foreground">// MODEL ANSWER</div>
            <p className="whitespace-pre-wrap text-sm text-foreground/90">{eval_.modelAnswer}</p>
            <div className="mono mt-5 mb-1 text-[10px] text-signal">// FOLLOW-UP</div>
            <p className="text-sm">{eval_.followUp}</p>
          </Panel>
        </div>
      )}
    </ModuleShell>
  );
}
