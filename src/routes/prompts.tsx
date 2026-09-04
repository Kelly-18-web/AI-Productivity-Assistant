import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

import { promptsQuery } from "@/lib/align-data";
import {
  CopyButton,
  ErrorState,
  MetaBadge,
  PageHeader,
  SectionCard,
  StatusPill,
} from "@/components/align/primitives";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "Prompt Engineering — AlignBA" },
      {
        name: "description",
        content:
          "Versioned, structured prompt templates behind every AlignBA feature, with guardrails, test results and a refinement changelog.",
      },
      { property: "og:title", content: "Prompt Engineering — AlignBA" },
      {
        property: "og:description",
        content: "Versioned prompt templates with guardrails, tests and refinement history.",
      },
    ],
  }),
  component: Prompts,
});

function Prompts() {
  const prompts = useQuery(promptsQuery);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Under the hood"
        title="Prompt Engineering"
        description="Every AI feature runs a reviewed, versioned template. Prompts are treated as product artefacts: structured, tested and changelogged."
      />

      {prompts.isError ? (
        <ErrorState message={prompts.error.message} onRetry={() => prompts.refetch()} />
      ) : prompts.isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {(prompts.data ?? []).map((p) => (
            <SectionCard
              key={p.id}
              title={p.name}
              description={`Feature: ${p.feature}`}
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <MetaBadge>v{p.version}</MetaBadge>
                  <StatusPill status={p.status} />
                  <CopyButton value={p.template} label="Copy prompt" />
                </div>
              }
            >
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
                {p.template}
              </pre>

              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Guardrails
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {p.guardrails.map((g) => (
                      <li key={g} className="flex gap-2 text-xs">
                        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Test results
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {p.test_results.map((t) => (
                      <li key={t.name} className="flex gap-2 text-xs">
                        {t.outcome === "pass" ? (
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                        ) : (
                          <XCircle className="mt-0.5 size-3.5 shrink-0 text-warning" />
                        )}
                        <span>
                          <strong className="font-medium">{t.name}</strong> — {t.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Refinement history
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {p.changelog.map((c) => (
                      <li key={c.version} className="text-xs">
                        <span className="font-mono text-primary">v{c.version}</span> — {c.note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
