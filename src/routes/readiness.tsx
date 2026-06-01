import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { readinessScore } from "@/lib/ai.functions";
import { ModuleShell, Field, Panel, inputCls, btnCls, ScoreBar, ErrorBox, Loader, SrH2 } from "@/components/ModuleShell";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/readiness")({
  head: () =>
    routeHead({
      path: "/readiness",
      title: "Job Readiness Score // CareerOS",
      description:
        "Six-axis job readiness map with the top three moves that change your score fastest for your target role.",
      serviceName: "Job Readiness Score",
    }),
  component: Page,
});

function Page() {
  const run = useServerFn(readinessScore);
  const [resume, setResume] = useState("3rd year CS, 1 internship at fintech (Node/Postgres), 2 side projects, ok at DSA (LeetCode ~200), no system design practice.");
  const [role, setRole] = useState("New Grad SWE at a FAANG-tier company");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null); setResult(null);
    try { setResult(await run({ data: { resume, targetRole: role } })); }
    catch (e: any) { setErr(e?.message ?? "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <ModuleShell num="06" tag="SCORE" title="Job Readiness Score" subtitle="A six-axis readiness map. See where you're strong, where you're not, and the three moves that change the score fastest.">
      <SrH2>Inputs</SrH2>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Target Role"><input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
        <Field label="Resume / Background"><textarea className={`${inputCls} min-h-[160px]`} value={resume} onChange={(e) => setResume(e.target.value)} /></Field>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className={btnCls}>{loading ? "SCORING…" : "COMPUTE READINESS →"}</button>
          {loading && <Loader label="AGGREGATING SIGNALS" />}
        </div>
      </form>

      {err && <div className="mt-6"><ErrorBox message={err} /></div>}

      <SrH2>Results</SrH2>
      {result && (
        <div className="mt-10 grid gap-6 md:grid-cols-5">
          <Panel className="md:col-span-2 text-center">
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Overall Readiness</div>
            <div className="mt-3 text-7xl font-light text-signal">{result.overall}<span className="text-2xl text-muted-foreground">/10</span></div>
            <p className="mt-4 text-sm text-muted-foreground">{result.verdict}</p>
          </Panel>
          <Panel className="md:col-span-3">
            <div className="mono mb-4 text-[11px] text-muted-foreground">// AXES</div>
            <div className="space-y-3">
              {result.axes?.map((a: any) => (
                <div key={a.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{a.name}</span>
                    <span className="mono text-[10px] text-signal">{a.score}/10</span>
                  </div>
                  <div className="mt-1.5"><ScoreBar value={a.score} /></div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.note}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="md:col-span-5">
            <div className="mono mb-2 text-[10px] text-signal">// TOP MOVES</div>
            <ol className="space-y-2 text-sm">{result.topMoves?.map((m: string, i: number) => <li key={i}><span className="mono text-signal">{i + 1}.</span> {m}</li>)}</ol>
          </Panel>
        </div>
      )}
    </ModuleShell>
  );
}
