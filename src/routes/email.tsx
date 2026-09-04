import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { DEMO_PROJECT_ID, emailsQuery, insertRow, updateRow } from "@/lib/align-data";
import { draftEmail } from "@/lib/ai.functions";
import {
  AIDisclaimer,
  CopyButton,
  ErrorState,
  PageHeader,
  SectionCard,
  StatusPill,
} from "@/components/align/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email — AlignBA" },
      {
        name: "description",
        content:
          "Draft stakeholder emails from approved project facts only, with placeholders instead of invented details and explicit approval before sending.",
      },
      { property: "og:title", content: "Smart Email — AlignBA" },
      {
        property: "og:description",
        content: "Fact-bounded stakeholder email drafting with an approval step.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const qc = useQueryClient();
  const emails = useQuery(emailsQuery);
  const [audience, setAudience] = useState("Executive sponsors");
  const [tone, setTone] = useState("Concise and formal");
  const [purpose, setPurpose] = useState(
    "Update the steering group on the outcome of the checkout discovery workshop and the agreed next steps.",
  );
  const [facts, setFacts] = useState(
    "- Guest checkout and Apple Pay were discussed; only guest checkout is in the agreed baseline.\n- 9 requirements extracted, 6 approved, 3 awaiting stakeholder validation.\n- Cart abandonment concern raised by Head of Digital (figure not yet confirmed).",
  );
  const [draft, setDraft] = useState<string | null>(null);

  const generate = useMutation({
    mutationFn: () => draftEmail({ data: { audience, tone, purpose, facts } }),
    onSuccess: (r) => setDraft(r.body),
    onError: (e: Error) => toast.error(e.message),
  });

  const save = useMutation({
    mutationFn: (body: string) => {
      const [first, ...rest] = body.split("\n");
      return insertRow("emails", {
        project_id: DEMO_PROJECT_ID,
        audience,
        tone,
        subject: (first ?? "").replace(/^Subject:\s*/i, "").slice(0, 200),
        body: rest.join("\n").trim(),
        status: "draft",
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["emails"] });
      toast.success("Draft saved for review");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const approve = useMutation({
    mutationFn: (v: { id: string; status: string }) =>
      updateRow("emails", v.id, { status: v.status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["emails"] });
      toast.success("Email status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Communicate"
        title="Smart Email"
        description="Turn approved facts into a stakeholder-ready message. Anything not supplied comes back as a bracketed placeholder, never as a guess."
        actions={
          <Button asChild variant="outline">
            <Link to="/tasks">
              Back to task plan <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <AIDisclaimer text="The model only sees the facts you paste below. It cannot add dates, metrics or commitments — missing details appear as [placeholders] for you to fill in." />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Brief" description="Facts in, draft out">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Audience</label>
                <Input
                  className="mt-1"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concise and formal">Concise and formal</SelectItem>
                    <SelectItem value="Warm and collaborative">Warm and collaborative</SelectItem>
                    <SelectItem value="Direct and factual">Direct and factual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Purpose</label>
              <Textarea
                className="mt-1"
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Approved facts</label>
              <Textarea
                className="mt-1 font-mono text-xs"
                rows={7}
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
              />
            </div>
            <Button onClick={() => generate.mutate()} disabled={generate.isPending}>
              <Sparkles className={generate.isPending ? "size-4 animate-pulse" : "size-4"} />
              {generate.isPending ? "Drafting…" : draft ? "Regenerate draft" : "Draft email"}
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Draft"
          description="Review, edit and approve before anything is sent"
          actions={draft ? <CopyButton value={draft} label="Copy email" /> : undefined}
        >
          {generate.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : generate.isError ? (
            <ErrorState message={generate.error.message} onRetry={() => generate.mutate()} />
          ) : draft ? (
            <div className="space-y-3">
              <Textarea
                rows={16}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={() => save.mutate(draft)} disabled={save.isPending}>
                <Check className="size-3.5" /> Save for approval
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No draft yet. Provide the brief and generate one.
            </p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Email history" description="Everything drafted for this project">
        {emails.isError ? (
          <ErrorState message={emails.error.message} onRetry={() => emails.refetch()} />
        ) : emails.isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <ul className="space-y-3">
            {(emails.data ?? []).map((m) => (
              <li key={m.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{m.subject}</p>
                  <StatusPill status={m.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.audience} · {m.tone}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                  {m.body}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton value={`Subject: ${m.subject}\n\n${m.body}`} />
                  {m.status === "approved" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => approve.mutate({ id: m.id, status: "draft" })}
                    >
                      Withdraw approval
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => approve.mutate({ id: m.id, status: "approved" })}
                    >
                      <Check className="size-3.5" /> Approve
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
