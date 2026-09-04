import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { researchTopic } from "@/lib/ai.functions";
import {
  AIDisclaimer,
  CopyButton,
  ErrorState,
  PageHeader,
  SectionCard,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — AlignBA" },
      {
        name: "description",
        content:
          "General BA background on a topic: common approaches, typical risks and the questions to put to stakeholders — clearly separated from project evidence.",
      },
      { property: "og:title", content: "Research Assistant — AlignBA" },
      {
        property: "og:description",
        content: "General analysis background, explicitly marked as non-project knowledge.",
      },
    ],
  }),
  component: Research,
});

const TOPICS = [
  "PCI-DSS considerations for storing payment methods",
  "Guest checkout conversion best practice",
  "Accessibility requirements for checkout forms",
];

function Research() {
  const [topic, setTopic] = useState("");
  const [current, setCurrent] = useState("");

  const research = useMutation({
    mutationFn: (t: string) => researchTopic({ data: { topic: t } }),
    onError: (e: Error) => toast.error(e.message),
  });

  function go(t: string) {
    const v = t.trim();
    if (!v) return;
    setCurrent(v);
    research.mutate(v);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analyse"
        title="Research Assistant"
        description="Background knowledge to sharpen your questions — never treated as project evidence."
      />

      <AIDisclaimer text="This output is general industry knowledge, not sourced from your project documents. Verify anything you intend to put in front of a stakeholder." />

      <SectionCard title="Topic" description="What do you need background on?">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            go(topic);
          }}
        >
          <Input
            value={topic}
            placeholder="e.g. Strong Customer Authentication for card payments"
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button type="submit" disabled={research.isPending}>
            <Sparkles className={research.isPending ? "size-4 animate-pulse" : "size-4"} />
            {research.isPending ? "Researching…" : "Research"}
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Button
              key={t}
              size="sm"
              variant="outline"
              onClick={() => {
                setTopic(t);
                go(t);
              }}
            >
              {t}
            </Button>
          ))}
        </div>
      </SectionCard>

      {research.isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : research.isError ? (
        <ErrorState message={research.error.message} onRetry={() => go(current)} />
      ) : research.data ? (
        <SectionCard
          title={current}
          description="General background — validate before use"
          actions={
            <div className="flex gap-2">
              <CopyButton value={research.data.notes} label="Copy notes" />
              <Button size="sm" variant="outline" onClick={() => go(current)}>
                Regenerate
              </Button>
            </div>
          }
        >
          <p className="whitespace-pre-line text-sm leading-relaxed">{research.data.notes}</p>
        </SectionCard>
      ) : null}
    </div>
  );
}
