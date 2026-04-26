/**
 * Fixes the Mux webhook for the allan-palmer project.
 *
 * The webhook in the dashboard currently points to
 * `https://allan-palmer.vercel.app/` (the homepage), so Mux events POST
 * there and 404 against our actual handler. This script:
 *
 *   1. Lists all webhooks via Mux's System API
 *   2. Finds the one whose URL is allan-palmer.vercel.app but missing
 *      `/api/webhooks/mux`
 *   3. PATCHes the URL to the correct path
 *   4. Prints the signing secret so it can be synced to env
 *
 * Mux's `/system/v1/webhooks` endpoint requires a token with system
 * scope. If the current MUX_TOKEN_ID doesn't have it, we'll get 403 and
 * exit cleanly — at which point the dashboard fix is the only path.
 *
 * Run: npx tsx scripts/fix-mux-webhook.ts
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const TOKEN_ID = process.env.MUX_TOKEN_ID;
const TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;
const TARGET_HOST = "allan-palmer.vercel.app";
const TARGET_PATH = "/api/webhooks/mux";

if (!TOKEN_ID || !TOKEN_SECRET) {
  throw new Error("MUX_TOKEN_ID + MUX_TOKEN_SECRET must be set in env.");
}

const auth = Buffer.from(`${TOKEN_ID}:${TOKEN_SECRET}`).toString("base64");

async function muxApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`https://api.mux.com${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mux API ${path} → ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
}

type Webhook = {
  id: string;
  url: string;
  status: "active" | "disabled";
  signing_secret?: string;
  created_at?: string;
};

async function main() {
  console.log("Listing webhooks…");
  const list = await muxApi<{ data: Webhook[] }>("/system/v1/webhooks");
  console.log(`Found ${list.data.length} webhook(s):`);
  for (const w of list.data) {
    console.log(`  ${w.id}  ${w.url}`);
  }

  const target = list.data.find(
    (w) =>
      w.url.includes(TARGET_HOST) &&
      !w.url.includes(TARGET_PATH),
  );

  if (!target) {
    console.log("");
    console.log(
      `No allan-palmer webhook needs fixing. Either it already points at ${TARGET_PATH}, or there is no allan-palmer webhook in this Mux environment.`,
    );
    return;
  }

  const newUrl = `https://${TARGET_HOST}${TARGET_PATH}`;
  console.log("");
  console.log(`Updating ${target.id}:`);
  console.log(`  before: ${target.url}`);
  console.log(`  after:  ${newUrl}`);

  const updated = await muxApi<{ data: Webhook }>(
    `/system/v1/webhooks/${target.id}`,
    {
      method: "PUT",
      body: JSON.stringify({ url: newUrl }),
    },
  );

  console.log("");
  console.log(`Updated ✓  ${updated.data.id}  ${updated.data.url}`);

  console.log("");
  console.log("Fetching signing secret…");
  const detail = await muxApi<{ data: Webhook }>(
    `/system/v1/webhooks/${target.id}`,
  );

  if (detail.data.signing_secret) {
    console.log("");
    console.log(
      "─────────────────────────────────────────────────────────────",
    );
    console.log("MUX_WEBHOOK_SECRET:");
    console.log(detail.data.signing_secret);
    console.log(
      "─────────────────────────────────────────────────────────────",
    );
    console.log(
      "Replace the existing MUX_WEBHOOK_SECRET in .env.local with this value, then sync to Vercel.",
    );
  } else {
    console.log(
      "Mux did not return a signing secret. View it in the dashboard (eye icon next to the SECRET column).",
    );
  }
}

main().catch((err) => {
  console.error(err);
  if (err instanceof Error && err.message.includes("403")) {
    console.error("");
    console.error(
      "Your Mux access token does not have system scope. Either:",
    );
    console.error(
      "  (a) Generate a new token with system permissions in the Mux dashboard, or",
    );
    console.error(
      "  (b) Fix the webhook URL manually in the dashboard.",
    );
  }
  process.exit(1);
});
