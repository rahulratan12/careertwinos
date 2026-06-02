import { type ReactNode } from "react";
import { Nav, Footer } from "@/components/Nav";

export function ModuleShell({
  num,
  tag,
  title,
  subtitle,
  children,
}: {
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mono mb-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>// {num}</span>
          <span className="rounded-sm border border-signal px-1.5 py-0.5 text-signal">{tag}</span>
        </div>
        <h1 className="text-3xl font-light leading-tight md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
        <div className="mt-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mono mb-2 block text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-sm border border-border bg-input/40 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-signal";

export const btnCls =
  "mono rounded-sm bg-signal px-5 py-3 text-xs font-medium text-signal-foreground transition-transform hover:translate-y-[-1px] hover:glow-signal disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

export const btnGhostCls =
  "mono rounded-sm border border-border px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-signal hover:text-signal disabled:opacity-50";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel rounded-md p-6 ${className}`}>{children}</div>;
}

export function ScoreBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div className="h-full bg-signal transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mono rounded-sm border border-destructive/50 bg-destructive/10 px-4 py-3 text-xs text-destructive-foreground">
      [ERR] {message}
    </div>
  );
}

export function Loader({ label = "PROCESSING" }: { label?: string }) {
  return (
    <div className="mono flex items-center gap-3 text-[11px] text-muted-foreground">
      <span className="inline-block h-2 w-2 animate-ping rounded-full bg-signal" />
      {label}_
    </div>
  );
}

export function SrH2({ children }: { children: ReactNode }) {
  return <h2 className="sr-only">{children}</h2>;
}

