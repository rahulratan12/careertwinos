import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { hiringPanelReview } from "@/lib/ai.functions";
import { ModuleShell, Field, Panel, inputCls, btnCls, ScoreBar, ErrorBox, Loader, SrH2 } from "@/components/ModuleShell";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/hiring-panel")({
  head: () =>
    routeHead({
      path: "/hiring-panel",
      title: "Multi-Agent Hiring Panel // CareerOS",
      description:
        "Simulate a 4-person AI hiring panel — Recruiter, Hiring Manager, Tech Lead, Bar Raiser — to grade any resume against any job description.",
      serviceName: "AI Hiring Panel Simulation",
    }),
  component: Page,
});

const SAMPLE_RESUME = `Aanya Sharma — Final-year CS, IIT Madras\nExperience: SWE intern at Razorpay (payments infra, Node/Go). Built distributed rate-limiter handling 12k rps.\nProjects: Open-source vector DB benchmark, RAG chatbot over college handbook.\nSkills: Go, TypeScript, Postgres, Kafka, Kubernetes basics, system design.`;
const SAMPLE_JD = `Stripe — New Grad Software Engineer, Payments Reliability.\nMust have: distributed systems fundamentals, strong CS, production code in Go/Java/Rust, on-call mindset.\nNice to have: payments domain, latency-sensitive systems.`;

function Page() {
  const run = useServerFn(hiringPanelReview);
  const [resume, setResume] = useState(SAMPLE_RESUME);
  const [jd, setJd] = useState(SAMPLE_JD);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null); setResult(null);
    try { setResult(await run({ data: { resume, jobDescription: jd } })); }
    catch (e: any) { setErr(e?.message ?? "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <ModuleShell num="01" tag="PANEL" title="Multi-Agent Hiring Panel" subtitle="Four specialist agents — Recruiter, Hiring Manager, Tech Lead, Bar Raiser — independently grade your candidacy and converge on a verdict.">
      <section>
        <SrH2>Candidate inputs</SrH2>
        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
          <Field label="Resume / Profile"><textarea className={`${inputCls} min-h-[220px] mono text-[12px]`} value={resume} onChange={(e) => setResume(e.target.value)} /></Field>
          <Field label="Job Description"><textarea className={`${inputCls} min-h-[220px] mono text-[12px]`} value={jd} onChange={(e) => setJd(e.target.value)} /></Field>
          <div className="md:col-span-2 flex items-center gap-3">
            <button type="submit" disabled={loading} className={btnCls}>{loading ? "CONVENING PANEL…" : "RUN PANEL →"}</button>
            {loading && <Loader label="AGENTS DELIBERATING" />}
          </div>
        </form>
      </section>

      {err && <div className="mt-6"><ErrorBox message={err} /></div>}

      {result?.verdicts && (
        <section className="mt-10 space-y-6">
          <SrH2>Panel verdicts</SrH2>
          <Panel className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Panel Decision</div>
              <div className="mt-2 text-3xl font-light text-signal">{result.panelDecision}</div>
            </div>
            <p className="mono max-w-xl text-xs text-muted-foreground">{result.rationale}</p>
          </Panel>
          <div className="grid gap-4 md:grid-cols-2">
            {result.verdicts.map((v: any) => (
              <Panel key={v.role}>
                <div className="flex items-center justify-between">
                  <div className="mono text-[11px] text-muted-foreground">// {v.role.toUpperCase()}</div>
                  <span className={`mono rounded-sm px-2 py-0.5 text-[10px] ${v.verdict === "ADVANCE" ? "bg-signal/20 text-signal" : v.verdict === "REJECT" ? "bg-destructive/20 text-destructive-foreground" : "bg-warn/20 text-warn"}`}>{v.verdict}</span>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-light text-signal">{v.score}</span>
                  <span className="mono text-[10px] text-muted-foreground">/ 10</span>
                </div>
                <div className="mt-2"><ScoreBar value={v.score} /></div>
                <p className="mt-3 text-sm text-foreground/90">{v.summary}</p>
                <div className="mt-4 grid gap-3 text-xs md:grid-cols-2">
                  <div>
                    <div className="mono mb-1 text-[10px] text-signal">+ STRENGTHS</div>
                    <ul className="space-y-1 text-muted-foreground">{v.strengths?.map((s: string, i: number) => <li key={i}>· {s}</li>)}</ul>
                  </div>
                  <div>
                    <div className="mono mb-1 text-[10px] text-warn">− CONCERNS</div>
                    <ul className="space-y-1 text-muted-foreground">{v.concerns?.map((s: string, i: number) => <li key={i}>· {s}</li>)}</ul>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      )}
    </ModuleShell>
  );
}
