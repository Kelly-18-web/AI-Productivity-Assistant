import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const SourceSchema = z.object({ reference: z.string(), title: z.string(), content: z.string() });

const GUARDRAIL =
  "You are AlignBA, an assistant for Business Analysts. Never invent facts, numbers, names or commitments. " +
  "If the supplied material does not support an answer, say so plainly and state what evidence would be needed. " +
  "Mark anything you infer as an inference. All output is a draft for human review.";

async function run(system: string, prompt: string): Promise<string> {
  const { alignModel } = await import("./ai-gateway.server");
  const result = streamText({ model: alignModel(), system, prompt });
  return await result.text;
}

export const askKnowledge = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ question: z.string().min(3), sources: z.array(SourceSchema) }).parse(d),
  )
  .handler(async ({ data }) => {
    const corpus = data.sources
      .map((s) => `[${s.reference}] ${s.title}\n${s.content}`)
      .join("\n\n---\n\n");
    const answer = await run(
      `${GUARDRAIL} Answer ONLY from the supplied project sources. Cite every claim inline using the bracketed source reference, e.g. [KB-02]. ` +
        `If the sources do not contain the answer, reply exactly: "The project sources do not cover this." and then name the document that would.`,
      `Project sources:\n\n${corpus}\n\nQuestion: ${data.question}`,
    );
    return { answer };
  });

export const draftEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        audience: z.string(),
        tone: z.string(),
        purpose: z.string().min(3),
        facts: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const body = await run(
      `${GUARDRAIL} Write a concise business email. Use ONLY the supplied facts — no invented dates, metrics or commitments. ` +
        `Where a fact is missing, insert a bracketed placeholder such as [confirm date]. Return "Subject: ..." on the first line, then the body.`,
      `Audience: ${data.audience}\nTone: ${data.tone}\nPurpose: ${data.purpose}\n\nApproved facts:\n${data.facts}`,
    );
    return { body };
  });

export const assessScope = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ request: z.string().min(3), baseline: z.string(), context: z.string() }).parse(d),
  )
  .handler(async ({ data }) => {
    const assessment = await run(
      `${GUARDRAIL} Assess whether a change request falls inside the agreed scope baseline. ` +
        `Return: Verdict (In scope / Out of scope / Ambiguous), Confidence (High/Medium/Low), Evidence (quote the baseline or decision), Impact, and Recommended next step. ` +
        `Use "Ambiguous" whenever the baseline is silent — never guess.`,
      `Scope baseline:\n${data.baseline}\n\nProject context:\n${data.context}\n\nChange request:\n${data.request}`,
    );
    return { assessment };
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ topic: z.string().min(3) }).parse(d))
  .handler(async ({ data }) => {
    const notes = await run(
      `${GUARDRAIL} Provide general BA background on the topic: key considerations, common approaches, typical risks, and questions to ask stakeholders. ` +
        `This is general knowledge, not project evidence. Flag uncertainty explicitly and end with a one-line validation disclaimer.`,
      `Topic: ${data.topic}`,
    );
    return { notes };
  });
