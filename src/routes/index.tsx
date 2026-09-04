import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ClipboardList,
  Clock,
  Mail,
  MessagesSquare,
  ShieldAlert,
} from "lucide-react";

import {
  emailsQuery,
  meetingsQuery,
  projectsQuery,
  requirementsQuery,
  scopeChangesQuery,
  storiesQuery,
  tasksQuery,
} from "@/lib/align-data";
import {
  AIDisclaimer,
  MetaBadge,
  PageHeader,
  SectionCard,
  StatusPill,
  ValidationBadge,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AlignBA" },
      {
        name: "description",
        content:
          "AlignBA dashboard: workflow progress from capture to validation, requirements awaiting stakeholder confirmation, and estimated analyst time saved.",
      },
      { property: "og:title", content: "Dashboard — AlignBA" },
      {
        property: "og:description",
        content: "Workflow status, validation queue and productivity impact for your BA work.",
      },
    ],
  }),
  component: Dashboard,
});

const WORKFLOW = [
  { step: "Capture", to: "/meetings", label: "Meeting Summarizer", icon: MessagesSquare },
  { step: "Analyse", to: "/requirements", label: "Requirements", icon: ClipboardList },
  { step: "Structure", to: "/stories", label: "User Stories", icon: ClipboardList },
  { step: "Communicate", to: "/email", label: "Smart Email", icon: Mail },
  { step: "Track", to: "/tasks", label: "Task Planner", icon: Clock },
  { step: "Query", to: "/knowledge", label: "Knowledge Chat", icon: MessagesSquare },
  { step: "Validate", to: "/scope-guard", label: "Scope Guard", icon: ShieldAlert },
] as const;

function Dashboard() {
  const projects = useQuery(projectsQuery);
  const meetings = useQuery(meetingsQuery);
  const reqs = useQuery(requirementsQuery);
  const stories = useQuery(storiesQuery);
  const tasks = useQuery(tasksQuery);
  const emails = useQuery(emailsQuery);
  const scope = useQuery(scopeChangesQuery);

  const loading = reqs.isLoading || tasks.isLoading;
  const needsValidation = (reqs.data ?? []).filter((r) => r.validation_state !== "explicit");
  const openTasks = (tasks.data ?? []).filter((t) => t.status !== "done");
  const minutesSaved =
    (meetings.data?.length ?? 0) * 45 +
    (reqs.data?.length ?? 0) * 12 +
    (stories.data?.length ?? 0) * 20 +
    (emails.data?.length ?? 0) * 15;

  const stats = [
    { label: "Active projects", value: projects.data?.length ?? 0 },
    { label: "Requirements captured", value: reqs.data?.length ?? 0 },
    { label: "Awaiting validation", value: needsValidation.length },
    { label: "Open tasks", value: openTasks.length },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Good to see you, Analyst"
        description="AlignBA carries one thread from stakeholder conversation to approved delivery artefact — and shows you where the evidence came from."
        actions={
          <Button asChild>
            <Link to="/meetings">
              Start the demo flow <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <AIDisclaimer text="AlignBA drafts; it never decides. Requirements, stories, emails and scope verdicts all stay in draft until you approve them, and each carries its source." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {s.label}
            </p>
            {loading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-1 font-display text-3xl font-semibold text-primary">{s.value}</p>
            )}
          </div>
        ))}
      </div>

      <SectionCard
        title="The AlignBA workflow"
        description="Seven steps, one evidence chain. Jump in anywhere."
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW.map((w, i) => {
            const Icon = w.icon;
            return (
              <li key={w.step}>
                <Link
                  to={w.to}
                  className="flex h-full flex-col gap-2 rounded-lg border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    <span className="text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {w.step}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4 text-primary" />
                    {w.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Needs your validation"
          description="AI-inferred or hedged statements that must be confirmed with a stakeholder before baselining."
          actions={
            <Button asChild size="sm" variant="outline">
              <Link to="/requirements">Open requirements</Link>
            </Button>
          }
        >
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : needsValidation.length === 0 ? (
            <p className="text-sm text-muted-foreground">Everything captured is explicitly sourced.</p>
          ) : (
            <ul className="space-y-3">
              {needsValidation.slice(0, 4).map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-border p-3 transition-colors hover:bg-accent/40"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <MetaBadge>{r.ref_code}</MetaBadge>
                    <ValidationBadge state={r.validation_state} />
                    <StatusPill status={r.status} />
                  </div>
                  <p className="mt-2 text-sm font-medium">{r.title}</p>
                  <p className="mt-1 text-xs italic text-muted-foreground">
                    “{r.source_quote}” — {r.source_speaker}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Productivity impact" description="Estimated analyst time saved.">
            <p className="font-display text-4xl font-semibold text-primary">
              {Math.round(minutesSaved / 60)}h
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Based on {meetings.data?.length ?? 0} meetings analysed, {reqs.data?.length ?? 0}{" "}
              requirements extracted, {stories.data?.length ?? 0} stories drafted and{" "}
              {emails.data?.length ?? 0} communications prepared. Estimate only — measure against
              your own baseline.
            </p>
          </SectionCard>

          <SectionCard title="Next best actions">
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-primary hover:underline" to="/requirements">
                  Validate {needsValidation.length} open requirement(s)
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/scope-guard">
                  Review {(scope.data ?? []).filter((s) => s.status !== "sent").length} scope
                  request(s)
                </Link>
              </li>
              <li>
                <Link className="text-primary hover:underline" to="/tasks">
                  Progress {openTasks.length} open task(s)
                </Link>
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
