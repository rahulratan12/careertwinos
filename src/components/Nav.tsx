import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "00 // Home" },
  { to: "/hiring-panel", label: "01 // Panel" },
  { to: "/probability", label: "02 // Probability" },
  { to: "/skill-gap", label: "03 // Roadmap" },
  { to: "/mock-interview", label: "04 // Interview" },
  { to: "/projects", label: "05 // Projects" },
  { to: "/readiness", label: "06 // Readiness" },
  { to: "/twin", label: "07 // Twin" },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-signal glow-signal" />
          <span className="mono text-sm tracking-widest">CAREER_OS</span>
          <span className="mono text-[10px] text-muted-foreground">v4.0.2</span>
        </Link>
        <nav className="hidden flex-wrap items-center gap-1 md:flex">
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="mono px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-signal data-[status=active]:text-signal"
              activeProps={{ className: "text-signal" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/twin"
          className="mono rounded-sm border border-signal bg-signal/10 px-3 py-1.5 text-[11px] text-signal transition-colors hover:bg-signal hover:text-signal-foreground"
        >
          INIT_SYNC →
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="mono">© 2026 CAREER_OS // SYNTHESIZED CAREER INFRASTRUCTURE</p>
        <p className="mono">[ STATUS: <span className="text-signal">ONLINE</span> ]</p>
      </div>
    </footer>
  );
}
