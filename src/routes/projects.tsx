import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { projectsQuery, requirementsQuery, tasksQuery, DEMO_PROJECT_ID } from "@/lib/align-data";
import {
  ErrorState,
  MetaBadge,
  PageHeader,
  SectionCard,
  StatusPill,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — AlignBA" },
      {
        name: "description",
        content:
          "Project workspaces with their agreed scope baseline, requirement counts and open delivery tasks.",
      },
      { property: "og:title", content: "Projects — AlignBA" },
      {
        property: "og:description",
        content: "Scope baselines and delivery status per project workspace.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const projects = useQuery(projectsQuery);
  const reqs = useQuery(requirementsQuery);
  const tasks = useQuery(tasksQuery);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Projects"
        description="Each workspace keeps its own sources, scope baseline and evidence chain. The scope baseline is what Scope Guard measures change requests against."
      />

      {projects.isError ? (
        <ErrorState message={projects.error.message} onRetry={() => projects.refetch()} />
      ) : projects.isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {(projects.data ?? []).map((p) => {
            const pr = (reqs.data ?? []).filter((r) => r.project_id === p.id);
            const pt = (tasks.data ?? []).filter((t) => t.project_id === p.id && t.status !== "done");
            const isDemo = p.id === DEMO_PROJECT_ID;
            return (
              <SectionCard
                key={p.id}
                title={p.name}
                description={p.client}
                actions={<StatusPill status={p.status} />}
              >
                <p className="text-sm text-muted-foreground">{p.description}</p>

                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                    Scope baseline
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                    {p.scope_summary || "No baseline agreed yet."}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <MetaBadge>{pr.length} requirements</MetaBadge>
                  <MetaBadge>{pt.length} open tasks</MetaBadge>
                </div>

                {isDemo ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link to="/meetings">Open meeting analysis</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/requirements">Requirements</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">
                    No sources uploaded yet — AlignBA will not answer questions about this project
                    until documents or transcripts are added.
                  </p>
                )}
              </SectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
