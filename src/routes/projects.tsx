import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { projectRecs } from "@/lib/ai.functions";
import { ModuleShell, Field, Panel, inputCls, btnCls, ErrorBox, Loader, SrH2 } from "@/components/ModuleShell";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/projects")({
  head: () =>
    routeHead({
      path: "/projects",
      title: "Project Recommendation Engine // CareerOS",
      description:
        "Portfolio projects hiring managers are actually trained to look for in 2026 — calibrated to your target role and current skill level.",
      serviceName: "Portfolio Project Recommendations",
    }),
  component: Page,
});

function Page() {
  const run = useServerFn(projectRecs);
  const [role, setRole] = useState("AI Engineer at a startup");
  const [skills, setSkills] = useState("Python, basic LangChain, comfortable with REST APIs, some Postgres.");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null); setResult(null);
    try { setResult(await run({ data: { targetRole: role, skills } })); }
    catch (e: any) { setErr(e?.message ?? "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <ModuleShell num="05" tag="BUILD" title="Project Recommendation Engine" subtitle="Stop building generic todo apps. Build the exact portfolio pieces hiring agents at top firms are trained to look for in 2026.">
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Target Role"><input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
        <Field label="Current Skills"><textarea className={`${inputCls} min-h-[120px]`} value={skills} onChange={(e) => setSkills(e.target.value)} /></Field>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className={btnCls}>{loading ? "GENERATING…" : "RECOMMEND PROJECTS →"}</button>
          {loading && <Loader label="SCANNING SIGNAL PATTERNS" />}
        </div>
      </form>

      {err && <div className="mt-6"><ErrorBox message={err} /></div>}

      {result?.projects && (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {result.projects.map((p: any, i: number) => (
            <Panel key={i} className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="mono text-[10px] text-muted-foreground">// {String(i + 1).padStart(2, "0")}</div>
                <span className={`mono rounded-sm px-2 py-0.5 text-[10px] ${p.difficulty === "Advanced" ? "bg-destructive/20 text-destructive-foreground" : p.difficulty === "Intermediate" ? "bg-warn/20 text-warn" : "bg-signal/20 text-signal"}`}>{p.difficulty}</span>
              </div>
              <h3 className="mt-3 text-lg font-medium">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{p.stack?.map((s: string) => <span key={s} className="mono rounded-sm border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">{s}</span>)}</div>
              <div className="mono mt-4 text-[10px] text-signal">// WOW: <span className="text-foreground/90">{p.wowFactor}</span></div>
              <div className="mono mt-2 text-[10px] text-muted-foreground">~{p.timeWeeks} weeks · builds: {p.skillsBuilt?.join(", ")}</div>
            </Panel>
          ))}
        </div>
      )}
    </ModuleShell>
  );
}
