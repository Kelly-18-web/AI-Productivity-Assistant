import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { AIDisclaimer, PageHeader, SectionCard } from "@/components/align/primitives";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AlignBA" },
      {
        name: "description",
        content:
          "Workspace defaults and responsible-AI controls: approval requirements, citation enforcement and validation labelling.",
      },
      { property: "og:title", content: "Settings — AlignBA" },
      {
        property: "og:description",
        content: "Responsible-AI controls and workspace defaults for the BA workspace.",
      },
    ],
  }),
  component: Settings,
});

const CONTROLS = [
  {
    key: "approval",
    label: "Require human approval before any output leaves AlignBA",
    detail: "Emails, change responses and exports stay in draft until you approve them.",
    locked: true,
  },
  {
    key: "citations",
    label: "Enforce citations in Knowledge Chat",
    detail: "Answers without a source reference are refused rather than shown.",
    locked: true,
  },
  {
    key: "validation",
    label: "Label every extracted item with a validation state",
    detail: "Explicitly stated, AI-inferred or requires validation.",
    locked: true,
  },
  {
    key: "research",
    label: "Separate general research from project evidence",
    detail: "Research Assistant output is never used to answer project questions.",
    locked: false,
  },
];

function Settings() {
  const [name, setName] = useState("Priya Raman");
  const [role, setRole] = useState("Senior Business Analyst");
  const [research, setResearch] = useState(true);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Your profile and the responsible-AI controls that govern every feature in this workspace."
      />

      <AIDisclaimer text="Controls marked as locked are core safeguards and cannot be disabled in this workspace." />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Profile" description="Used as the default owner and email signature">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Role</label>
              <Input className="mt-1" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Responsible AI controls" description="How AlignBA is allowed to behave">
          <ul className="space-y-4">
            {CONTROLS.map((c) => (
              <li key={c.key} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.detail}</p>
                  {c.locked ? (
                    <p className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
                      <ShieldCheck className="size-3" /> Locked safeguard
                    </p>
                  ) : null}
                </div>
                <Switch
                  checked={c.locked ? true : research}
                  disabled={c.locked}
                  onCheckedChange={(v) => {
                    if (!c.locked) setResearch(v);
                  }}
                />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
