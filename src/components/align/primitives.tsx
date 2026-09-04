import { useState, type ReactNode } from "react";
import { AlertTriangle, Check, Copy, Info, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

const VALIDATION_COPY: Record<string, { label: string; className: string; icon: ReactNode }> = {
  explicit: {
    label: "Explicitly stated",
    className: "bg-primary/10 text-primary border-primary/25",
    icon: <ShieldCheck className="size-3" />,
  },
  inferred: {
    label: "AI-inferred",
    className: "bg-info/10 text-info border-info/25",
    icon: <Sparkles className="size-3" />,
  },
  requires_validation: {
    label: "Requires validation",
    className: "bg-warning/12 text-warning border-warning/30",
    icon: <AlertTriangle className="size-3" />,
  },
};

export function ValidationBadge({ state }: { state: string }) {
  const cfg = VALIDATION_COPY[state] ?? VALIDATION_COPY["inferred"]!;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
        cfg.className,
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

const STATUS_CLASS: Record<string, string> = {
  approved: "bg-success/12 text-success border-success/30",
  sent: "bg-success/12 text-success border-success/30",
  done: "bg-success/12 text-success border-success/30",
  draft: "bg-muted text-muted-foreground border-border",
  proposed: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-primary/10 text-primary border-primary/25",
  blocked: "bg-destructive/10 text-destructive border-destructive/25",
  at_risk: "bg-warning/12 text-warning border-warning/30",
  out_of_scope: "bg-destructive/10 text-destructive border-destructive/25",
  in_scope: "bg-success/12 text-success border-success/30",
  ambiguous: "bg-warning/12 text-warning border-warning/30",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
        STATUS_CLASS[status] ?? "bg-secondary text-secondary-foreground border-border",
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function MetaBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-secondary-foreground">
      {children}
    </span>
  );
}

export function AIDisclaimer({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-info/25 bg-info/8 p-3 text-xs leading-relaxed text-foreground/80">
      <Info className="mt-0.5 size-4 shrink-0 text-info" />
      <p>
        <strong className="font-semibold text-foreground">AI-assisted output. </strong>
        {text}
      </p>
    </div>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        void navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card shadow-sm", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
      <p className="text-sm font-medium text-destructive">Something went wrong</p>
      <p className="mt-1 text-xs text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button size="sm" variant="outline" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
