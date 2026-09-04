import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { requirementsQuery, storiesQuery, updateRow } from "@/lib/align-data";
import {
  AIDisclaimer,
  CopyButton,
  ErrorState,
  MetaBadge,
  PageHeader,
  StatusPill,
  ValidationBadge,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "User Stories — AlignBA" },
      {
        name: "description",
        content:
          "User stories with Given/When/Then acceptance criteria generated from approved requirements, each linked back to its source requirement.",
      },
      { property: "og:title", content: "User Stories — AlignBA" },
      {
        property: "og:description",
        content: "Stories and acceptance criteria traceable to approved requirements.",
      },
    ],
  }),
  component: Stories,
});

function Stories() {
  const qc = useQueryClient();
  const stories = useQuery(storiesQuery);
  const reqs = useQuery(requirementsQuery);

  const approve = useMutation({
    mutationFn: (v: { id: string; status: string }) =>
      updateRow("user_stories", v.id, { status: v.status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["user_stories"] });
      toast.success("Story status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Structure"
        title="User Stories"
        description="Generated from approved requirements, with acceptance criteria a developer can build against."
        actions={
          <Button asChild>
            <Link to="/email">
              Draft stakeholder update <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <AIDisclaimer text="Acceptance criteria are drafted from the linked requirement and its source quote. Review each one — AlignBA will not invent behaviour the source does not support." />

      {stories.isError ? (
        <ErrorState message={stories.error.message} onRetry={() => stories.refetch()} />
      ) : stories.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <ul className="space-y-6">
          {(stories.data ?? []).map((s) => {
            const req = reqs.data?.find((r) => r.id === s.requirement_id);
            const storyText = `${s.ref_code} — ${s.title}\nAs a ${s.as_a}, I want ${s.i_want}, so that ${s.so_that}.\n\nAcceptance criteria:\n${s.acceptance_criteria
              .map((c, i) => `${i + 1}. ${c}`)
              .join("\n")}`;
            return (
              <li key={s.id} className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-4">
                  <MetaBadge>{s.ref_code}</MetaBadge>
                  {req ? <MetaBadge>from {req.ref_code}</MetaBadge> : null}
                  <MetaBadge>{s.story_points} pts</MetaBadge>
                  <ValidationBadge state={s.validation_state} />
                  <StatusPill status={s.status} />
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="mt-2 rounded-lg bg-secondary/60 p-3 text-sm leading-relaxed">
                      <strong>As a</strong> {s.as_a}, <strong>I want</strong> {s.i_want},{" "}
                      <strong>so that</strong> {s.so_that}.
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Acceptance criteria
                    </p>
                    <ul className="mt-2 space-y-2">
                      {s.acceptance_criteria.map((c, i) => (
                        <li key={c} className="flex gap-2 text-sm">
                          <span className="font-mono text-xs text-primary">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.status === "approved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approve.mutate({ id: s.id, status: "draft" })}
                      >
                        Return to draft
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => approve.mutate({ id: s.id, status: "approved" })}
                      >
                        <Check className="size-3.5" /> Approve story
                      </Button>
                    )}
                    <CopyButton value={storyText} label="Copy for Jira" />
                    <Button asChild size="sm" variant="outline">
                      <Link to="/tasks">Plan the work</Link>
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
