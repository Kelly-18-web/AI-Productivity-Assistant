import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";

import { kbSourcesQuery } from "@/lib/align-data";
import { askKnowledge } from "@/lib/ai.functions";
import {
  AIDisclaimer,
  CopyButton,
  ErrorState,
  MetaBadge,
  PageHeader,
  SectionCard,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Chat — AlignBA" },
      {
        name: "description",
        content:
          "Ask questions about the project and get answers grounded only in indexed project documents, with an inline citation for every claim.",
      },
      { property: "og:title", content: "Knowledge Chat — AlignBA" },
      {
        property: "og:description",
        content: "Grounded project Q&A with inline citations and refusal when sources are silent.",
      },
    ],
  }),
  component: Knowledge,
});

const SUGGESTIONS = [
  "What did we agree about guest checkout?",
  "Is Apple Pay in scope?",
  "What is the launch date for the new checkout?",
];

type Turn = { question: string; answer: string };

function Knowledge() {
  const sources = useQuery(kbSourcesQuery);
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);

  const ask = useMutation({
    mutationFn: (q: string) =>
      askKnowledge({
        data: {
          question: q,
          sources: (sources.data ?? []).map((s) => ({
            reference: s.reference,
            title: s.title,
            content: s.content,
          })),
        },
      }),
    onSuccess: (r, q) => setTurns((t) => [...t, { question: q, answer: r.answer }]),
    onError: (e: Error) => toast.error(e.message),
  });

  function submit(q: string) {
    const value = q.trim();
    if (!value) return;
    setQuestion("");
    ask.mutate(value);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Query"
        title="Knowledge Chat"
        description="Answers come only from this project's indexed documents. If the sources are silent, AlignBA says so instead of guessing."
        actions={
          <Button asChild>
            <Link to="/scope-guard">
              Check a change request <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <AIDisclaimer text="Every claim carries a bracketed source reference such as [KB-02]. An unanswerable question returns “The project sources do not cover this.” — that is the correct behaviour, not a failure." />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard title="Ask about this project" description="Grounded, cited answers">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Button key={s} size="sm" variant="outline" onClick={() => submit(s)}>
                  {s}
                </Button>
              ))}
            </div>

            <ul className="space-y-4">
              {turns.map((t, i) => (
                <li key={`${t.question}-${i}`} className="space-y-2">
                  <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
                    {t.question}
                  </p>
                  <div className="max-w-[95%] rounded-2xl rounded-bl-sm border border-border bg-card p-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed">{t.answer}</p>
                    <div className="mt-3">
                      <CopyButton value={t.answer} label="Copy answer" />
                    </div>
                  </div>
                </li>
              ))}
              {ask.isPending ? (
                <li className="space-y-2">
                  <Skeleton className="h-16 w-3/4" />
                </li>
              ) : null}
            </ul>

            {ask.isError ? <ErrorState message={ask.error.message} /> : null}

            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                submit(question);
              }}
            >
              <Input
                value={question}
                placeholder="Ask about decisions, scope, or requirements…"
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button type="submit" disabled={ask.isPending}>
                <Send className="size-4" />
                Ask
              </Button>
            </form>
          </div>
        </SectionCard>

        <SectionCard title="Indexed sources" description="The only material the answer can use">
          {sources.isLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ul className="space-y-3">
              {(sources.data ?? []).map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <MetaBadge>{s.reference}</MetaBadge>
                    <MetaBadge>{s.doc_type}</MetaBadge>
                  </div>
                  <p className="mt-2 text-sm font-medium">{s.title}</p>
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{s.content}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
