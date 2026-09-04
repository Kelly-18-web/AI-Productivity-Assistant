import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, CalendarDays, RefreshCw, Users } from "lucide-react";

import { meetingsQuery, type Meeting } from "@/lib/align-data";
import {
  AIDisclaimer,
  CopyButton,
  ErrorState,
  MetaBadge,
  PageHeader,
  SectionCard,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — AlignBA" },
      {
        name: "description",
        content:
          "Turn a stakeholder workshop transcript into a structured summary of decisions, risks and actions, with every point traceable to who said it.",
      },
      { property: "og:title", content: "Meeting Summarizer — AlignBA" },
      {
        property: "og:description",
        content: "Structured meeting analysis: decisions, risks, actions and the source transcript.",
      },
    ],
  }),
  component: Meetings,
});

function Meetings() {
  const meetings = useQuery(meetingsQuery);
  const meeting: Meeting | undefined = meetings.data?.[0];
  const [progress, setProgress] = useState<number | null>(null);

  function rerun() {
    setProgress(8);
    const steps = [26, 48, 70, 88, 100];
    steps.forEach((v, i) =>
      setTimeout(() => setProgress(v === 100 ? null : v), (i + 1) * 420),
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Capture"
        title="Meeting Summarizer"
        description="Paste or upload a transcript; AlignBA extracts decisions, risks and actions without paraphrasing away the hedging stakeholders actually used."
        actions={
          <>
            <Button variant="outline" onClick={rerun} disabled={progress !== null}>
              <RefreshCw className={progress !== null ? "size-4 animate-spin" : "size-4"} />
              Re-run analysis
            </Button>
            <Button asChild>
              <Link to="/requirements">
                See extracted requirements <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      {progress !== null ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Replaying the stored analysis for this transcript…
          </p>
          <Progress value={progress} className="mt-2" />
        </div>
      ) : null}

      <AIDisclaimer text="Analysis is drawn only from the transcript below. Hedged statements (“probably”, “I think”) stay hedged and become requirements marked as requiring validation." />

      {meetings.isError ? (
        <ErrorState message={meetings.error.message} onRetry={() => meetings.refetch()} />
      ) : meetings.isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : !meeting ? (
        <p className="text-sm text-muted-foreground">No meetings captured yet.</p>
      ) : (
        <SectionCard
          title={meeting.title}
          description={`Analysis state: ${meeting.analysis_state}`}
          actions={<CopyButton value={meeting.summary} label="Copy summary" />}
        >
          <div className="flex flex-wrap gap-2">
            <MetaBadge>
              <CalendarDays className="mr-1 size-3" />
              {new Date(meeting.meeting_date).toLocaleDateString()}
            </MetaBadge>
            <MetaBadge>
              <Users className="mr-1 size-3" />
              {meeting.attendees.length} attendees
            </MetaBadge>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{meeting.attendees.join(" · ")}</p>

          <Tabs defaultValue="summary" className="mt-6">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="decisions">Decisions</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">{meeting.summary}</p>
            </TabsContent>

            {(
              [
                ["decisions", meeting.decisions],
                ["risks", meeting.risks],
                ["actions", meeting.actions],
              ] as const
            ).map(([key, items]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-lg border border-border bg-secondary/40 p-3 text-sm"
                    >
                      <span className="font-mono text-xs text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}

            <TabsContent value="transcript" className="mt-4">
              <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
                {meeting.transcript}
              </pre>
              <div className="mt-3">
                <CopyButton value={meeting.transcript} label="Copy transcript" />
              </div>
            </TabsContent>
          </Tabs>
        </SectionCard>
      )}
    </div>
  );
}
