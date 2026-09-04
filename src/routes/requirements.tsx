import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Check, Pencil, Quote } from "lucide-react";
import { toast } from "sonner";

import { requirementsQuery, updateRow } from "@/lib/align-data";
import {
  AIDisclaimer,
  ErrorState,
  MetaBadge,
  PageHeader,
  StatusPill,
  ValidationBadge,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/requirements")({
  head: () => ({
    meta: [
      { title: "Requirements — AlignBA" },
      {
        name: "description",
        content:
          "Requirements extracted from project sources, each labelled explicitly stated, AI-inferred or requires validation, with the verbatim source quote attached.",
      },
      { property: "og:title", content: "Requirements — AlignBA" },
      {
        property: "og:description",
        content: "Traceable requirements with validation states and approval workflow.",
      },
    ],
  }),
  component: Requirements,
});

const FILTERS = ["All", "Requires attention", "Approved"] as const;

function Requirements() {
  const qc = useQueryClient();
  const reqs = useQuery(requirementsQuery);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", description: "" });

  const mutate = useMutation({
    mutationFn: (v: { id: string; patch: Record<string, unknown> }) =>
      updateRow("requirements", v.id, v.patch),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["requirements"] });
      toast.success("Requirement updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = (reqs.data ?? []).filter((r) =>
    filter === "All"
      ? true
      : filter === "Approved"
        ? r.status === "approved"
        : r.validation_state !== "explicit" || r.status !== "approved",
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analyse"
        title="Requirements"
        description="Extracted from the workshop transcript. Nothing is baselined until you approve it."
        actions={
          <Button asChild>
            <Link to="/stories">
              Generate user stories <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <AIDisclaimer text="Every requirement carries its source. “Explicitly stated” quotes the transcript verbatim; “AI-inferred” states the basis; “Requires validation” came from a hedged or unconfirmed statement." />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {reqs.isError ? (
        <ErrorState message={reqs.error.message} onRetry={() => reqs.refetch()} />
      ) : reqs.isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <MetaBadge>{r.ref_code}</MetaBadge>
                <MetaBadge>{r.category}</MetaBadge>
                <MetaBadge>{r.priority}</MetaBadge>
                <ValidationBadge state={r.validation_state} />
                <StatusPill status={r.status} />
              </div>

              {editing === r.id ? (
                <div className="mt-3 space-y-3">
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                  <Textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        mutate.mutate({ id: r.id, patch: draft });
                        setEditing(null);
                      }}
                    >
                      Save edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="mt-3 text-base font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                </>
              )}

              <blockquote className="mt-4 flex gap-2 rounded-lg border-l-2 border-primary/50 bg-muted/40 px-3 py-2">
                <Quote className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <div className="text-xs">
                  <p className="italic">“{r.source_quote}”</p>
                  <p className="mt-1 text-muted-foreground">— {r.source_speaker}</p>
                </div>
              </blockquote>

              <div className="mt-4 flex flex-wrap gap-2">
                {r.status === "approved" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => mutate.mutate({ id: r.id, patch: { status: "draft" } })}
                  >
                    Withdraw approval
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={mutate.isPending}
                    onClick={() => mutate.mutate({ id: r.id, patch: { status: "approved" } })}
                  >
                    <Check className="size-3.5" /> Approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(r.id);
                    setDraft({ title: r.title, description: r.description });
                  }}
                >
                  <Pencil className="size-3.5" /> Edit
                </Button>
                {r.validation_state !== "explicit" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      mutate.mutate({ id: r.id, patch: { validation_state: "explicit" } })
                    }
                  >
                    Mark validated with stakeholder
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
