/**
 * LIVE test of Leah — hits Haiku 4.5 with the real prompts.
 *
 * Runs 6 scenarios and prints streaming output for each.
 * Requires ANTHROPIC_API_KEY in .env.local (auto-loaded).
 *
 *   npx tsx scripts/test-leah-live.ts
 */

import { config } from "dotenv";
import { streamText } from "ai";
import { haiku } from "../lib/leah/model";
import { getPromptContext } from "../lib/leah/prompts/base";
import { buildCustomerSystemPrompt } from "../lib/leah/prompts/customer";
import { buildAdminSystemPrompt } from "../lib/leah/prompts/admin";

config({ path: ".env.local" });
config(); // fall back to .env

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY not found in .env.local or .env");
  process.exit(1);
}

const divider = "─".repeat(72);

interface Scenario {
  label: string;
  mode: "customer" | "admin";
  userName: string | null;
  user: string;
}

const scenarios: Scenario[] = [
  {
    label: "Customer — booking date question",
    mode: "customer",
    userName: "Sarah Mitchell",
    user: "Can you do my wedding August 23rd?",
  },
  {
    label: "Customer — pricing pushback",
    mode: "customer",
    userName: "Sarah Mitchell",
    user: "How much will this cost? I need a number.",
  },
  {
    label: "Customer — relative date resolution",
    mode: "customer",
    userName: null,
    user: "What about this Saturday?",
  },
  {
    label: "Admin — morning greeting",
    mode: "admin",
    userName: "Allan Palmer",
    user: "morning",
  },
  {
    label: "Admin — quiet-day check (should trigger dry honesty)",
    mode: "admin",
    userName: "Allan Palmer",
    user: "anything urgent?",
  },
  {
    label: "Admin — block time (should confirm before firing)",
    mode: "admin",
    userName: "Allan Palmer",
    user: "block next tuesday all day",
  },
];

async function runScenario(s: Scenario): Promise<void> {
  console.log(`\n${divider}`);
  console.log(`▸ ${s.label}`);
  console.log(`  user: "${s.user}"`);
  console.log(divider);

  const ctx = getPromptContext(s.userName, s.mode === "admin");
  const systemPrompt =
    s.mode === "admin"
      ? buildAdminSystemPrompt(ctx)
      : buildCustomerSystemPrompt(ctx);

  // Note: we intentionally pass NO tools here. This is a prompt-quality
  // smoke test — we want to see the words Leah chooses, not exercise the
  // tool pipeline. (Separate test would cover tools.)
  const start = Date.now();
  const result = streamText({
    model: haiku(),
    system: systemPrompt,
    messages: [{ role: "user", content: s.user }],
    temperature: 0.7,
    maxOutputTokens: 400,
  });

  process.stdout.write("  leah: ");
  let firstTokenAt: number | null = null;
  let chars = 0;
  for await (const chunk of result.textStream) {
    if (firstTokenAt === null) firstTokenAt = Date.now();
    process.stdout.write(chunk);
    chars += chunk.length;
  }
  const totalMs = Date.now() - start;
  const ttft = firstTokenAt ? firstTokenAt - start : null;
  console.log(
    `\n  ⏱  first-token: ${ttft ?? "?"}ms · total: ${totalMs}ms · ${chars} chars`,
  );
}

(async () => {
  console.log(`Live Leah test — Haiku 4.5`);
  console.log(
    `Today (per prompt context): ${getPromptContext(null, false).today}`,
  );

  for (const s of scenarios) {
    try {
      await runScenario(s);
    } catch (err) {
      console.error("  ❌", err instanceof Error ? err.message : err);
    }
  }

  console.log(`\n${divider}\ndone.`);
})();
