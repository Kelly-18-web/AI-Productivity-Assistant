import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SectionCard } from "@/components/align/primitives";

export const Route = createFileRoute("/documentation")({
  head: () => ({
    meta: [
      { title: "Project Documentation — AlignBA" },
      {
        name: "description",
        content:
          "AlignBA project documentation: problem, users, solution, architecture, prompt strategy, responsible AI, challenges and productivity impact.",
      },
      { property: "og:title", content: "Project Documentation — AlignBA" },
      {
        property: "og:description",
        content: "A concise write-up of the AlignBA problem, solution, prompt strategy and impact.",
      },
    ],
  }),
  component: Documentation,
});

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">{title}</h3>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}

function Documentation() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Deliverable"
        title="Project Documentation"
        description="A two-page write-up of what AlignBA is, how it was built, and how its AI is kept honest."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Problem & users" description="Page 1">
          <div className="space-y-6">
            <Block title="Problem">
              <p>
                Business Analysts lose most of their week to translation work: turning workshop
                transcripts into requirements, requirements into stories, stories into tasks, and
                all of it into stakeholder communication. The work is repetitive but
                unforgiving — a dropped hedge word (“probably”, “maybe”) becomes a committed
                requirement, and undocumented scope creep surfaces weeks later as a delivery
                argument.
              </p>
            </Block>
            <Block title="Users">
              <p>
                Primary: Business Analysts and Product Owners running discovery on delivery
                projects. Secondary: delivery leads and executive sponsors who consume the outputs
                (summaries, change responses, status emails) and need to trust their provenance.
              </p>
            </Block>
            <Block title="Solution">
              <p>
                AlignBA covers one continuous workflow — Capture, Analyse, Structure, Communicate,
                Track, Query, Validate — with each stage producing a reviewable artefact that
                carries its source. Meeting Summarizer extracts decisions, risks and actions;
                Requirements and User Stories add validation states and approval; Task Planner
                sequences the work with visible rationale; Smart Email drafts from approved facts
                only; Knowledge Chat answers with citations; Scope Guard tests change requests
                against the agreed baseline and drafts a formal response.
              </p>
            </Block>
            <Block title="Tools & architecture">
              <p>
                React with TanStack Start and TanStack Router on Vite, Tailwind CSS v4 with a
                blue-and-white semantic token system, and shadcn/Radix UI primitives. Persistent
                data lives in Lovable Cloud (Postgres with row-level security), read through
                TanStack Query. AI runs server-side through typed server functions against the
                Lovable AI gateway, so no model key ever reaches the browser and every prompt is
                assembled from server-controlled templates.
              </p>
            </Block>
          </div>
        </SectionCard>

        <SectionCard title="Prompts, safeguards & impact" description="Page 2">
          <div className="space-y-6">
            <Block title="Prompt strategy">
              <p>
                Every feature runs a structured, versioned template with four fixed parts: role,
                supplied evidence, task, and output contract. A shared guardrail preamble forbids
                invented facts, requires inferences to be labelled, and states that all output is a
                draft for human review. Templates, their guardrails, test results and refinement
                history are visible in the Prompt Engineering area rather than buried in code.
              </p>
            </Block>
            <Block title="Example & refinement">
              <p>
                Knowledge Chat v1 answered plausibly but blended sources. v2 added “cite every claim
                inline using the bracketed source reference”. v3 added the exact refusal string
                “The project sources do not cover this.” plus a request to name the document that
                would answer it — which is why asking for a launch date returns a refusal instead of
                a confident guess. Scope Guard gained an explicit “Ambiguous” verdict after early
                tests showed the model resolving silence in the baseline into a yes/no.
              </p>
            </Block>
            <Block title="Responsible AI">
              <p>
                A persistent disclaimer sits in the navigation; every extracted item is tagged
                explicitly stated, AI-inferred or requires validation; nothing is sent without an
                explicit approve action; answers must cite; refusal is a designed outcome. General
                research is deliberately kept in a separate area so it can never masquerade as
                project evidence.
              </p>
            </Block>
            <Block title="Challenges & solutions">
              <p>
                Hallucinated specifics were the main risk — solved by passing an explicit source
                corpus and requiring citations plus a refusal path. Loss of nuance in summarisation
                was solved by carrying the verbatim source quote and speaker onto every requirement.
                Silent scope creep was solved by making the scope baseline a first-class stored
                field that Scope Guard measures against and quotes back.
              </p>
            </Block>
            <Block title="Impact & next steps">
              <p>
                On the demo project the workflow replaces roughly six hours of manual write-up per
                workshop with about an hour of review, while improving traceability. Next:
                per-user workspaces and authentication, live document ingestion with embeddings,
                Jira and Confluence sync, and automated regression tests over the prompt templates.
              </p>
            </Block>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
