/**
 * Smoke test for Leah prompt builders.
 * Runs the three contexts we care about and prints key snippets.
 *
 *   npx tsx scripts/test-leah-prompts.ts
 */

import { getPromptContext } from "../lib/leah/prompts/base";
import { buildCustomerSystemPrompt } from "../lib/leah/prompts/customer";
import { buildAdminSystemPrompt } from "../lib/leah/prompts/admin";

const divider = "─".repeat(72);

function section(title: string) {
  console.log(`\n${divider}\n${title}\n${divider}`);
}

function snippet(label: string, text: string, maxLines = 5) {
  console.log(`\n[${label}]`);
  const lines = text.split("\n").slice(0, maxLines);
  lines.forEach((l) => console.log("  " + l));
  console.log(
    `  … (${text.length} chars total, ${text.split("\n").length} lines)`,
  );
}

// ──────────────────────────────────────────────
// 1. Anonymous visitor — no name on file
// ──────────────────────────────────────────────
section("CUSTOMER — anonymous (signed in, no name)");
const ctx1 = getPromptContext(null, false);
const p1 = buildCustomerSystemPrompt(ctx1);
console.log("today token         :", ctx1.today);
console.log("userName            :", ctx1.userName);
console.log("isAdmin             :", ctx1.isAdmin);
// Extract the "Today's context" block
const todayBlock = p1.match(/# Today's context[\s\S]*?(?=\n# )/)?.[0] ?? "";
snippet("Today's context block", todayBlock);
// Extract the greeting
const greet1 = p1.match(/First message to a new guest: "(.*?)"/)?.[1];
console.log("\n[greeting]", greet1);

// ──────────────────────────────────────────────
// 2. Named customer — "Sarah Mitchell"
// ──────────────────────────────────────────────
section("CUSTOMER — named (Sarah Mitchell)");
const ctx2 = getPromptContext("Sarah Mitchell", false);
const p2 = buildCustomerSystemPrompt(ctx2);
const greet2 = p2.match(/First message to a new guest: "(.*?)"/)?.[1];
console.log("[greeting]", greet2);
// Verify the base persona says "Sarah Mitchell (a signed-in guest)"
const speaker2 = p2.match(/speaking with: (.+?)\n/)?.[1];
console.log("[speaker]", speaker2);

// ──────────────────────────────────────────────
// 3. Admin — Allan
// ──────────────────────────────────────────────
section("ADMIN — Allan Palmer");
const ctx3 = getPromptContext("Allan Palmer", true);
const p3 = buildAdminSystemPrompt(ctx3);
// Extract the greeting
const greet3 = p3.match(/Time-of-day appropriate, uses his name: "(.*?)"/)?.[1];
console.log("[greeting]", greet3);
const speaker3 = p3.match(/speaking with: (.+?)\n/)?.[1];
console.log("[speaker]", speaker3);
// Pull one of the example exchanges
const morningExample = p3.match(/morning"[\s\S]*?Bad \(robotic\):.+$/m)?.[0];
snippet("'morning' example exchange", morningExample ?? "NOT FOUND", 6);
// Triage priority block
const triageBlock =
  p3.match(/# Triage priority rules[\s\S]*?(?=\n# )/)?.[0] ?? "";
snippet("Triage rules", triageBlock, 10);

// ──────────────────────────────────────────────
// 4. Length check — cost sanity
// ──────────────────────────────────────────────
section("SIZE");
console.log(`customer (anon):   ${p1.length.toLocaleString()} chars`);
console.log(`customer (named):  ${p2.length.toLocaleString()} chars`);
console.log(`admin:             ${p3.length.toLocaleString()} chars`);
console.log(
  `\nrough token estimate (~4 chars/token):`,
  `customer ≈ ${Math.round(p1.length / 4)} tokens, admin ≈ ${Math.round(p3.length / 4)} tokens`,
);

// ──────────────────────────────────────────────
// 5. Assertions — these should all be true
// ──────────────────────────────────────────────
section("ASSERTIONS");
const checks = [
  { name: "Today is injected", ok: p1.includes(ctx1.today) },
  {
    name: "Positioning block present",
    ok: p1.includes("University of Manitoba"),
  },
  { name: "No upsell rule present", ok: p1.includes("No upsell") },
  { name: "Length calibration present", ok: p1.includes("1–3 sentences") },
  { name: "Tool failure line present", ok: p1.includes("I'm having trouble") },
  {
    name: "Customer greeting (named) contains 'Sarah'",
    ok: (greet2 ?? "").includes("Sarah"),
  },
  {
    name: "Customer greeting (anon) does NOT contain a placeholder",
    ok: !(greet1 ?? "").includes("${"),
  },
  {
    name: "Admin greeting contains 'Allan'",
    ok: (greet3 ?? "").includes("Allan"),
  },
  { name: "Admin has dry-honesty rule", ok: p3.includes("Nothing on fire") },
  {
    name: "Admin has triage rules",
    ok:
      (p3.includes("Urgent") && p3.includes("< 14")) ||
      p3.includes("less than 14"),
  },
  {
    name: "Admin speaker block IDs Allan",
    ok: (speaker3 ?? "").includes("Allan"),
  },
  {
    name: "Customer speaker block does NOT ID as Allan",
    ok: !(speaker1OrSafe(p1) ?? "").includes("Allan Palmer"),
  },
  {
    name: "Admin does NOT have redundant tool list",
    ok: !p3.includes("listBookings — pull his bookings"),
  },
];

let failed = 0;
for (const c of checks) {
  console.log(`${c.ok ? "✓" : "✗"} ${c.name}`);
  if (!c.ok) failed++;
}

console.log(
  `\n${failed === 0 ? "✅ All checks passed" : `❌ ${failed} check(s) failed`}`,
);
process.exit(failed === 0 ? 0 : 1);

function speaker1OrSafe(s: string): string | undefined {
  return s.match(/speaking with: (.+?)\n/)?.[1];
}
