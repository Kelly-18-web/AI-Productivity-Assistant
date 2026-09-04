import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldAlert, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { projectsQuery, scopeChangesQuery } from "@/lib/align-data";
import { assessScope } from "@/lib/ai.functions";
import {
  AIDisclaimer,
  CopyButton,
  ErrorState,
  MetaBadge,
  PageHeader,
  SectionCard,
  StatusPill,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/scope-guard")({
  head: () => ({
    meta: [
      { title: "Scope Guard — AlignBA" },
      {
        name: "description",
        content:
          "Test a change request against the agreed scope baseline and get an evidence-backed verdict plus a formal response letter you can approve and send.",
      },
      { property: "og:title", content: "Scope Guard — AlignBA" },
      {
        property: "og:description",
        content: "Evidence-backed scope verdicts and a formal change response draft.",
      },
    ],
  }),
  component: ScopeGuard,
});

function ScopeGuard() {
  const changes = useQuery(scopeChangesQuery);
  const projects = useQuery(projectsQuery);
  const [request, setRequest] = useState(
    "Can we add Apple Pay to the checkout as part of this phase? Marketing has already mentioned it externally.",
  );

  const baseline = projects.data?.[0]?.scope_summary ?? "";

  const assess = useMutation({
    mutationFn: () =>
      assessScope({
        data: {
          request,
          baseline,
          context:
            "Approved requirements cover guest checkout, address validation, saved cards for logged-in users and error messaging. Payment wallet integrations were deferred in the workshop.",
        },
      }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Validate"
        title="Scope Guard"
        description="Compare an incoming request against the agreed baseline before it quietly becomes work."
      />

      <AIDisclaimer text="Verdicts quote the baseline they rely on. When the baseline is silent, Scope Guard returns “Ambiguous” rather than deciding on your behalf." />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Test a change request" description="Measured against the baseline below">
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                Scope baseline
              </p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                {baseline || "Loading baseline…"}
              </p>
            </div>
            <Textarea rows={5} value={request} onChange={(e) => setRequest(e.target.value)} />
            <Button onClick={() => assess.mutate()} disabled={assess.isPending || !baseline}>
              <Sparkles className={assess.isPending ? "size-4 animate-pulse" : "size-4"} />
              {assess.isPending ? "Assessing…" : "Assess against baseline"}
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Assessment"
          description="Draft position — yours to accept or override"
          actions={
            assess.data ? <CopyButton value={assess.data.assessment} label="Copy" /> : undefined
          }
        >
          {assess.isPending ? (
            <Skeleton className="h-48 w-full" />
          ) : assess.isError ? (
            <ErrorState message={assess.error.message} onRetry={() => assess.mutate()} />
          ) : assess.data ? (
            <p className="whitespace-pre-line text-sm leading-relaxed">{assess.data.assessment}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Run an assessment to see the verdict, evidence and impact.
            </p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Logged change requests" description="With their formal responses">
        {changes.isError ? (
          <ErrorState message={changes.error.message} onRetry={() => changes.refetch()} />
        ) : changes.isLoading ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <ul className="space-y-4">
            {(changes.data ?? []).map((c) => (
              <li key={c.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <ShieldAlert className="size-4 text-warning" />
                  <p className="text-sm font-semibold">{c.title}</p>
                  <StatusPill status={c.verdict} />
                  <MetaBadge>{c.confidence} confidence</MetaBadge>
                  <MetaBadge>{c.status}</MetaBadge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Requested by {c.requested_by}: “{c.request_text}”
                </p>
                <p className="mt-3 text-sm leading-relaxed">{c.rationale}</p>

                <div className="mt-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Evidence
                  </p>
                  <ul className="mt-1 space-y-1">
                    {c.evidence.map((e) => (
                      <li
                        key={e}
                        className="rounded-md border-l-2 border-primary/50 bg-muted/40 px-3 py-1.5 text-xs italic"
                      >
                        “{e}”
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-3 rounded-md bg-warning/10 p-2 text-xs text-foreground/80">
                  <strong className="font-semibold">Impact: </strong>
                  {c.impact}
                </p>

                <details className="mt-3 rounded-lg border border-border bg-secondary/40 p-3">
                  <summary className="cursor-pointer text-xs font-medium">
                    Formal change response
                  </summary>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                    {c.response_letter}
                  </p>
                  <div className="mt-3">
                    <CopyButton value={c.response_letter} label="Copy response" />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
