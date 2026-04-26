import Mux from "@mux/mux-node";

declare global {
  // eslint-disable-next-line no-var
  var __mux: Mux | undefined;
}

function makeMux() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error(
      "Mux credentials missing. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET in env.",
    );
  }
  return new Mux({ tokenId, tokenSecret });
}

export const mux = globalThis.__mux ?? makeMux();
if (process.env.NODE_ENV !== "production") globalThis.__mux = mux;

export const MUX_WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET;
