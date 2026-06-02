import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { skillGap } from "@/lib/ai.functions";
import { ModuleShell, Field, Panel, inputCls, btnCls, ScoreBar, ErrorBox, Loader, SrH2 } from "@/components/ModuleShell";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/skill-gap")({
  head: () =>
    routeHead({
      path: "/skill-gap",
      title: "Skill Gap & Learning Roadmap // CareerOS",
      description:
        "Personalized week-by-week learning roadmap that closes the gaps between your current skills and your target role.",
      serviceName: "Skill Gap Analysis & Learning Roadmap",
    }),
  component: Page,
});

function Page() {
  const run = useServerFn(skillGap);
  const [skills, setSkills] = useState("React (advanced), TypeScript, Node basics, SQL basics. Some AWS S3/Lambda exposure.");
  const [role, setRole] = useState("Senior Full-Stack Engineer at a Series B SaaS");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null); setResult(null);
    try { setResult(await run({ data: { currentSkills: skills, targetRole: role } })); }
    catch (e: any) { setErr(e?.message ?? "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <ModuleShell num="03" tag="ROADMAP" title="Skill Gap & Learning Roadmap" subtitle="An automated, week-by-week learning path calibrated to market demand and your target trajectory.">
      <SrH2>Inputs</SrH2>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Target Role"><input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
        <Field label="Current Skills"><textarea className={`${inputCls} min-h-[140px]`} value={skills} onChange={(e) => setSkills(e.target.value)} /></Field>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className={btnCls}>{loading ? "BUILDING ROADMAP…" : "GENERATE ROADMAP →"}</button>
          {loading && <Loader label="MAPPING DELTAS" />}
        </div>
      </form>

      {err && <div className="mt-6"><ErrorBox message={err} /></div>}

      <SrH2>Results</SrH2>
      {result && (
        <div className="mt-10 grid gap-6 md:grid-cols-5">
          <Panel className="md:col-span-2">
            <div className="mono mb-4 text-[11px] text-muted-foreground">// SKILL GAPS</div>
            <div className="space-y-4">
              {result.gaps?.map((g: any, i: number) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{g.skill}</span>
                    <span className="mono text-[10px] text-muted-foreground">{g.currentLevel}% → {g.requiredLevel}%</span>
                  </div>
                  <div className="mt-1.5"><ScoreBar value={g.currentLevel} max={100} /></div>
                  <span className={`mono mt-1 inline-block text-[10px] ${g.priority === "High" ? "text-destructive-foreground" : g.priority === "Medium" ? "text-warn" : "text-muted-foreground"}`}>PRIO: {g.priority}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="md:col-span-3">
            <div className="mono mb-4 text-[11px] text-muted-foreground">// WEEKLY ROADMAP</div>
            <ol className="space-y-4">
              {result.roadmap?.map((r: any) => (
                <li key={r.week} className="border-l-2 border-signal/40 pl-4">
                  <div className="mono text-[10px] text-signal">WEEK {String(r.week).padStart(2, "0")}</div>
                  <div className="mt-1 text-sm font-medium">{r.focus}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Milestone: {r.milestone}</div>
                  <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">{r.resources?.map((x: string, i: number) => <li key={i}>· {x}</li>)}</ul>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      )}
    </ModuleShell>
  );
}
