import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const DEMO_PROJECT_ID = "11111111-1111-1111-1111-111111111111";

type Tables = Database["public"]["Tables"];
type RowOf<T extends keyof Tables> = Tables[T]["Row"];

export type Project = RowOf<"projects">;
export type Meeting = Omit<RowOf<"meetings">, "attendees" | "decisions" | "risks" | "actions"> & {
  attendees: string[];
  decisions: string[];
  risks: string[];
  actions: string[];
};
export type Requirement = RowOf<"requirements">;
export type UserStory = Omit<RowOf<"user_stories">, "acceptance_criteria"> & {
  acceptance_criteria: string[];
};
export type Task = RowOf<"tasks">;
export type EmailDraft = RowOf<"emails">;
export type KbSource = RowOf<"kb_sources">;
export type ScopeChange = Omit<RowOf<"scope_changes">, "evidence"> & { evidence: string[] };
export type PromptTemplate = Omit<
  RowOf<"prompt_templates">,
  "guardrails" | "test_results" | "changelog"
> & {
  guardrails: string[];
  test_results: { name: string; outcome: string; note: string }[];
  changelog: { version: string; note: string }[];
};

export type ValidationState = "explicit" | "inferred" | "requires_validation";

async function selectAll<T>(table: keyof Tables, order: string, asc = true): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(order, { ascending: asc });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as T[];
}

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => selectAll<Project>("projects", "created_at"),
});

export const meetingsQuery = queryOptions({
  queryKey: ["meetings"],
  queryFn: () => selectAll<Meeting>("meetings", "meeting_date", false),
});

export const requirementsQuery = queryOptions({
  queryKey: ["requirements"],
  queryFn: () => selectAll<Requirement>("requirements", "ref_code"),
});

export const storiesQuery = queryOptions({
  queryKey: ["user_stories"],
  queryFn: () => selectAll<UserStory>("user_stories", "ref_code"),
});

export const tasksQuery = queryOptions({
  queryKey: ["tasks"],
  queryFn: () => selectAll<Task>("tasks", "created_at"),
});

export const emailsQuery = queryOptions({
  queryKey: ["emails"],
  queryFn: () => selectAll<EmailDraft>("emails", "created_at", false),
});

export const kbSourcesQuery = queryOptions({
  queryKey: ["kb_sources"],
  queryFn: () => selectAll<KbSource>("kb_sources", "reference"),
});

export const scopeChangesQuery = queryOptions({
  queryKey: ["scope_changes"],
  queryFn: () => selectAll<ScopeChange>("scope_changes", "created_at", false),
});

export const promptsQuery = queryOptions({
  queryKey: ["prompt_templates"],
  queryFn: () => selectAll<PromptTemplate>("prompt_templates", "feature"),
});

export async function updateRow(
  table: keyof Tables,
  id: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .update(patch as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function insertRow(
  table: keyof Tables,
  values: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from(table).insert(values as never);
  if (error) throw new Error(error.message);
}
