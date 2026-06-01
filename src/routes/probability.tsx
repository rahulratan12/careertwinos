import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { hiringProbability } from "@/lib/ai.functions";
import { ModuleShell, Field, Panel, inputCls, btnCls, ErrorBox, Loader, SrH2 } from "@/components/ModuleShell";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/probability")({
  head: () =>
    routeHead({
      path: "/probability",
      title: "Hiring Probability Simulator // CareerOS",
      description:
        "Monte-Carlo style hiring probability for any role at any company, with concrete drivers, blockers, and likely rejection reasons.",
      serviceName: "Hiring Probability Simulator",
    }),
  component: Page,
});

function Page() {
  const run = useServerFn(hiringProbability);
  const [resume, setResume] = useState("Recent CS grad. Internships at 2 startups (React, Node). 1 hackathon win. CGPA 8.4.");
  const [role, setRole] = useState("Frontend Engineer");
  const [company, setCompany] = useState("Vercel");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null); setResult(null);
    try { setResult(await run({ data: { resume, targetRole: role, company } })); }
    catch (e: any) { setErr(e?.message ?? "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <ModuleShell num="02" tag="FORECAST" title="Hiring Probability Simulator" subtitle="Predict your real hiring chance for a specific role at a specific company — and see exactly what's pulling the number up or down.">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Target Role"><input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
          <Field label="Target Company"><input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} /></Field>
        </div>
        <Field label="Resume / Background"><textarea className={`${inputCls} min-h-[180px] mono text-[12px]`} value={resume} onChange={(e) => setResume(e.target.value)} /></Field>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className={btnCls}>{loading ? "SIMULATING…" : "RUN SIMULATION →"}</button>
          {loading && <Loader label="MONTE CARLO @ 400 PATHS" />}
        </div>
      </form>

      {err && <div className="mt-6"><ErrorBox message={err} /></div>}

      {result && (
        <div className="mt-10 grid gap-6 md:grid-cols-5">
          <Panel className="md:col-span-2 text-center">
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Hiring Probability</div>
            <div className="mt-4 text-7xl font-light text-signal">{result.probability}<span className="text-2xl text-muted-foreground">%</span></div>
            <div className="mono mt-3 inline-block rounded-sm border border-signal px-3 py-1 text-[11px] text-signal">{result.tier}</div>
          </Panel>
          <Panel className="md:col-span-3 space-y-4">
            <Section title="DRIVERS" tone="signal" items={result.drivers} />
            <Section title="BLOCKERS" tone="warn" items={result.blockers} />
          </Panel>
          <Panel className="md:col-span-3">
            <Section title="LIKELY REJECTION REASONS" tone="destructive" items={result.rejectionReasons} />
          </Panel>
          <Panel className="md:col-span-2">
            <Section title="NEXT ACTIONS" tone="signal" items={result.nextActions} />
          </Panel>
        </div>
      )}
    </ModuleShell>
  );
}

function Section({ title, tone, items }: { title: string; tone: "signal" | "warn" | "destructive"; items?: string[] }) {
  const color = tone === "signal" ? "text-signal" : tone === "warn" ? "text-warn" : "text-destructive-foreground";
  return (
    <div>
      <div className={`mono mb-2 text-[10px] ${color}`}>// {title}</div>
      <ul className="space-y-1.5 text-sm text-foreground/90">{items?.map((x, i) => <li key={i}>· {x}</li>)}</ul>
    </div>
  );
}
