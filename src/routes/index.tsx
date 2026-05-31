import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/Nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerOS // Your Career, Synthesized" },
      { name: "description", content: "AI-powered career operating system: simulate hiring panels, predict hiring chances, close skill gaps, and ace interviews." },
      { property: "og:title", content: "CareerOS // Your Career, Synthesized" },
      { property: "og:description", content: "Multi-agent hiring panels, mock interviews, and a Career Twin that gets you job-ready faster." },
    ],
  }),
  component: Index,
});

const modules = [
  { num: "01", title: "Multi-Agent Hiring Panel", to: "/hiring-panel", desc: "Recruiter, Hiring Manager, Tech Lead and Bar Raiser agents tear into your resume vs the JD.", tag: "PANEL" },
  { num: "02", title: "Hiring Probability", to: "/probability", desc: "Estimate your real hiring chance, with concrete drivers, blockers, and rejection reasons.", tag: "FORECAST" },
  { num: "03", title: "Skill Gap & Roadmap", to: "/skill-gap", desc: "Week-by-week roadmap that closes the deltas between you and the target role.", tag: "ROADMAP" },
  { num: "04", title: "AI Mock Interviews", to: "/mock-interview", desc: "Stress-test your answers against a Tier-1 interviewer with score, model answer, and follow-ups.", tag: "INTERVIEW" },
  { num: "05", title: "Project Recommendation Engine", to: "/projects", desc: "The exact portfolio pieces hiring managers are trained to look for in 2026.", tag: "BUILD" },
  { num: "06", title: "Job Readiness Score", to: "/readiness", desc: "Six-axis readiness map with the top three moves to push every dimension forward.", tag: "SCORE" },
  { num: "07", title: "The Career Twin", to: "/twin", desc: "Your 24/7 conversational career strategist. Talks through every other module.", tag: "TWIN", featured: true },
] as const;

function Index() {
  return (
    <div>
      <Nav />
      <main className="mx-auto max-w-7xl px-6">
        {/* HERO */}
        <section className="relative grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <div className="mono mb-6 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
              SYSTEM VERSION 4.0.2 // STABLE
            </div>
            <h1 className="text-5xl font-light leading-[0.95] tracking-tight md:text-7xl">
              YOUR CAREER,
              <br />
              <span className="text-signal">SYNTHESIZED.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Deploy a digital twin that navigates the 2026 hiring landscape, simulates interview panels,
              and closes skill gaps before they become bottlenecks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/twin" className="mono rounded-sm bg-signal px-5 py-3 text-xs font-medium text-signal-foreground transition-transform hover:translate-y-[-1px] hover:glow-signal">
                TALK TO YOUR TWIN →
              </Link>
              <a href="#modules" className="mono rounded-sm border border-border px-5 py-3 text-xs text-foreground transition-colors hover:border-signal hover:text-signal">
                VIEW 7 MODULES
              </a>
            </div>
          </div>
          <div className="md:col-span-5">
            <TerminalCard />
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4">
          {[
            ["Simulations Run", "1.2M+"],
            ["Avg Salary Jump", "+42%"],
            ["Agents Deployed", "14.8k"],
            ["Target Companies", "900+"],
          ].map(([k, v]) => (
            <div key={k} className="bg-card p-6">
              <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
              <div className="mt-2 text-3xl font-light text-signal">{v}</div>
            </div>
          ))}
        </section>

        {/* MODULES */}
        <section id="modules" className="py-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mono text-[11px] text-muted-foreground">// SEVEN CORE MODULES</div>
              <h2 className="mt-2 max-w-2xl text-3xl font-light leading-tight md:text-5xl">
                Engineered to eliminate uncertainty from your career path.
              </h2>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            {modules.map((m) => (
              <Link
                key={m.num}
                to={m.to}
                className={`group relative flex flex-col bg-card p-7 transition-colors hover:bg-secondary ${
                  m.featured ? "md:col-span-2" : ""
                }`}
              >
                <div className="mono mb-6 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>// {m.num}</span>
                  <span className="rounded-sm border border-border px-1.5 py-0.5 group-hover:border-signal group-hover:text-signal">
                    {m.tag}
                  </span>
                </div>
                <h3 className="text-xl font-medium leading-snug">{m.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{m.desc}</p>
                <span className="mono mt-6 text-[11px] text-signal opacity-0 transition-opacity group-hover:opacity-100">
                  OPEN MODULE →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="my-24 panel rounded-md p-12 text-center">
          <div className="mono text-[11px] text-muted-foreground">// 08 SYNC</div>
          <h2 className="mt-3 text-3xl font-light md:text-5xl">READY TO SYNC YOUR TWIN?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Beta access restricted to 500 slots per month. Initialize your career sync to claim one.
          </p>
          <Link to="/twin" className="mono mt-8 inline-block rounded-sm bg-signal px-6 py-3 text-xs text-signal-foreground hover:glow-signal">
            INITIALIZE CAREER SYNC →
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function TerminalCard() {
  return (
    <div className="panel scanlines relative overflow-hidden rounded-md">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="mono text-[10px] text-muted-foreground">Twin_Session.log</div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted" />
          <span className="h-2 w-2 rounded-full bg-muted" />
          <span className="h-2 w-2 rounded-full bg-signal" />
        </div>
      </div>
      <div className="mono space-y-3 p-5 text-[12px] leading-relaxed">
        <p><span className="text-muted-foreground">[USER]:</span></p>
        <p>How do I qualify for Staff Engineer at Stripe by Q3?</p>
        <p className="pt-2"><span className="text-signal">[TWIN]:</span></p>
        <p className="text-muted-foreground">Analyzing Stripe hiring velocity_</p>
        <p>01 — Skill gap detected: <span className="text-signal">distributed systems (84% match)</span></p>
        <p>02 — Readiness score: <span className="text-signal">7.2 / 10</span></p>
        <p>03 — Recommending 3-round mock interview panel</p>
        <p className="border-t border-border pt-3 text-muted-foreground">TYPE TO INTERACT ⌘K</p>
      </div>
    </div>
  );
}
