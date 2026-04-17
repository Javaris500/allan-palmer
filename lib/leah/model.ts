import { createAnthropic } from "@ai-sdk/anthropic";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const HAIKU_MODEL_ID = "claude-haiku-4-5-20251001";

export const haiku = () => anthropic(HAIKU_MODEL_ID);
