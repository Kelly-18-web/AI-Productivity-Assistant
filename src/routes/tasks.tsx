import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { storiesQuery, tasksQuery, updateRow } from "@/lib/align-data";
import {
  AIDisclaimer,
  ErrorState,
  MetaBadge,
  PageHeader,
  SectionCard,
  StatusPill,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner — AlignBA" },
      {
        name: "description",
        content:
          "A prioritised BA task plan derived from approved stories, with effort, owner, due dates and the AI rationale behind each priority call.",
      },
      { property: "og:title", content: "Task Planner — AlignBA" },
      {
        property: "og:description",
        content: "Prioritised BA tasks with visible rationale and owner assignment.",
      },
    ],
  }),
  component: TasksPage,
});

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
] as const;

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

function TasksPage() {
  const qc = useQueryClient();
  const tasks = useQuery(tasksQuery);
  const stories = useQuery(storiesQuery);

  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: string }) =>
      updateRow("tasks", v.id, { status: v.status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const all = [...(tasks.data ?? [])].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Track"
        title="Task Planner"
        description="AlignBA proposes the sequence; you own the plan. Every priority call shows its reasoning so you can disagree with it."
        actions={
          <Button asChild>
            <Link to="/knowledge">
              Ask the knowledge base <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <AIDisclaimer text="Task priorities are suggestions based on dependencies and stated stakeholder urgency in the approved requirements. Adjust owners and dates before sharing with delivery." />

      {tasks.isError ? (
        <ErrorState message={tasks.error.message} onRetry={() => tasks.refetch()} />
      ) : tasks.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = all.filter((t) => t.status === col.key);
            return (
              <SectionCard
                key={col.key}
                title={col.label}
                description={`${items.length} task${items.length === 1 ? "" : "s"}`}
              >
                <ul className="space-y-3">
                  {items.map((t) => {
                    const story = stories.data?.find((s) => s.id === t.story_id);
                    return (
                      <li key={t.id} className="rounded-lg border border-border bg-background p-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <MetaBadge>{t.priority}</MetaBadge>
                          <MetaBadge>{t.effort}</MetaBadge>
                          {story ? <MetaBadge>{story.ref_code}</MetaBadge> : null}
                        </div>
                        <p className="mt-2 text-sm font-medium">{t.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{t.detail}</p>
                        <p className="mt-2 rounded-md bg-primary/5 p-2 text-[11px] leading-relaxed text-foreground/75">
                          <strong className="font-semibold">Why this priority: </strong>
                          {t.ai_rationale}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{t.owner}</span>
                          {t.due_date ? (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="size-3" />
                              {new Date(t.due_date).toLocaleDateString()}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3">
                          <Select
                            value={t.status}
                            onValueChange={(status) => setStatus.mutate({ id: t.id, status })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COLUMNS.map((c) => (
                                <SelectItem key={c.key} value={c.key}>
                                  {c.label}
                                </SelectItem>
                              ))}
                              <SelectItem value="blocked">Blocked</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </li>
                    );
                  })}
                  {items.length === 0 ? (
                    <li className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Nothing here
                    </li>
                  ) : null}
                </ul>
              </SectionCard>
            );
          })}
        </div>
      )}

      {all.some((t) => t.status === "blocked") ? (
        <SectionCard title="Blocked" description="Needs a decision before work can continue">
          <ul className="space-y-2">
            {all
              .filter((t) => t.status === "blocked")
              .map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                >
                  <span>{t.title}</span>
                  <StatusPill status="blocked" />
                </li>
              ))}
          </ul>
        </SectionCard>
      ) : null}
    </div>
  );
}
