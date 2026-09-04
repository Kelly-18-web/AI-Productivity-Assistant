import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const ALIGN_MODEL = "google/gemini-3.6-flash";

export function requireApiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this workspace (missing key).");
  return key;
}

export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function alignModel() {
  return createLovableAiGatewayProvider(requireApiKey())(ALIGN_MODEL);
}
