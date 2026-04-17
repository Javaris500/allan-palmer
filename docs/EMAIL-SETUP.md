# Email Setup Guide — Allan Palmer

> Complete walkthrough to get sending (Resend) + receiving (Zoho) email working on `allanpalmerviolinist.com`. DNS hosted on Vercel.
>
> **Do not skip steps.** Order matters — SPF records in particular will break if done wrong.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  allanpalmerviolinist.com  (DNS on Vercel)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  OUTBOUND (app → customer)                                  │
│    Next.js app → Resend API → customer inbox                │
│    From: hello@allanpalmerviolinist.com                     │
│    Proven by: SPF + DKIM + DMARC DNS records                │
│                                                             │
│  INBOUND (customer → Allan)                                 │
│    Customer → Zoho MX → Zoho inbox (or forward to Gmail)    │
│    To: hello@allanpalmerviolinist.com                       │
│    Proven by: Zoho MX records                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Sending and receiving are **independent systems** that happen to share a domain. Set them up in this order: Resend first (sending), Zoho second (receiving), then test both.

---

## Phase 1 — Resend (outbound email)

### 1.1 Account
- [ ] Go to https://resend.com → **Sign Up**
- [ ] Use the permanent master email (recommended: `allan@allanpalmerviolinist.com` once Zoho is live — for now `palmerar@myumanitoba.ca` is a placeholder, plan to migrate later)
- [ ] Free tier: 3,000 emails/month, 100/day. Sufficient for v1.

### 1.2 API key
- [ ] Dashboard → **API Keys** → **Create API Key**
- [ ] Name: `Allan Palmer Production`
- [ ] Permission: **Full access** (or "Sending access" if we want to be stricter — Full is fine for now)
- [ ] Copy the key — it's shown **once only**.
- [ ] Paste into project `.env`:
  ```
  RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
  ```
- [ ] **Never commit `.env`.** Confirm it's in `.gitignore` (it is).

> ⚠️ If the key was ever pasted in chat, Slack, a doc, or a screenshot — **rotate it** (revoke the old one, create a new one). The current key `re_KXiXm9aa_...` was shared in chat and should be rotated before production.

### 1.3 Add domain
- [ ] Dashboard → **Domains** → **Add Domain**
- [ ] Enter: `allanpalmerviolinist.com`
- [ ] Region: **US East (N. Virginia)** — lowest latency for Canadian users routing through US.
- [ ] Resend generates **4 DNS records**. Keep this tab open.

### 1.4 Add Resend DNS records to Vercel
- [ ] Go to https://vercel.com/dashboard → select the Allan Palmer project
- [ ] **Settings → Domains → `allanpalmerviolinist.com` → DNS Records**
- [ ] Add records exactly as Resend provides (values will match Resend's dashboard — these are typical shapes):

| Type | Name | Value | Notes |
|---|---|---|---|
| `MX` | `send` | `feedback-smtp.us-east-1.amazonses.com` (priority **10**) | Bounce handling — subdomain, does NOT conflict with Zoho's `@` MX |
| `TXT` | `send` | `v=spf1 include:amazonses.com ~all` | SPF for the `send.` subdomain only |
| `TXT` | `resend._domainkey` | (long DKIM string Resend provides — one line, copy exactly) | Signs outbound mail |
| `TXT` | `_dmarc` | `v=DMARC1; p=none;` | Start permissive, tighten later |

- [ ] Click **Verify** in Resend. Usually green within 5–30 minutes. Max 48 hours if something's slow.
- [ ] Once verified, Resend domain status = ✅ Verified.

### 1.5 Wire into the app
- [ ] Update `.env` (and later Vercel → Settings → Environment Variables for Production):
  ```
  RESEND_API_KEY=re_xxxxxxxxxxxxxx
  EMAIL_FROM="Allan Palmer <hello@allanpalmerviolinist.com>"
  ADMIN_EMAIL=allan@allanpalmerviolinist.com
  NEXT_PUBLIC_SITE_URL=https://www.allanpalmerviolinist.com
  ```
- [ ] Fix stale `allanpalmer.com` fallbacks in `lib/resend.ts` (lines 5–6) to `allanpalmerviolinist.com`.
- [ ] Fix stale `allanpalmer.com` fallback in `app/api/email-preview/route.ts` (line 10) likewise.

### 1.6 Test outbound
- [ ] `npm run dev`
- [ ] Visit `http://localhost:3000/api/email-preview` — confirm 9 templates render
- [ ] Send a real test:
  ```
  curl -X POST https://api.resend.com/emails \
    -H "Authorization: Bearer $RESEND_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "from": "Allan Palmer <hello@allanpalmerviolinist.com>",
      "to": "palmerar@myumanitoba.ca",
      "subject": "Resend test",
      "html": "<p>If you can read this, sending works.</p>"
    }'
  ```
- [ ] Also send a test to a **Gmail**, **Outlook**, and **iCloud** address. Confirm:
  - Arrives in inbox (not spam)
  - Sender shows "Allan Palmer <hello@allanpalmerviolinist.com>"
  - No "via resend.com" disclaimer
  - No red "this sender could not be verified" banner

---

## Phase 2 — Zoho Mail (inbound email)

### 2.1 Account
- [ ] Go to https://www.zoho.com/mail/ → click **Forever Free** plan → **Sign Up**
- [ ] Choose **"Add your existing domain"** → enter `allanpalmerviolinist.com`
- [ ] Pick a super-admin username. Use Allan's real identity.
- [ ] Free tier: 1 user, 5GB storage, webmail + IMAP. Upgrade later if needed.

### 2.2 Verify domain ownership
- [ ] Zoho asks you to prove you own the domain. Choose **TXT method** (easiest on Vercel).
- [ ] Zoho provides a verification record like:
  ```
  Type: TXT
  Name: @ (or leave blank)
  Value: zoho-verification=zb12345678.zmverify.zoho.com
  ```
- [ ] Add this TXT record in **Vercel DNS**.
- [ ] Click **Verify** in Zoho — usually green in 2–10 minutes.

### 2.3 Create mailboxes
In Zoho's **Mail Admin → User Details**, create:

- [ ] `allan@allanpalmerviolinist.com` (primary, super-admin)
- [ ] Aliases (free, unlimited under the 1 user):
  - `hello@allanpalmerviolinist.com`
  - `lessons@allanpalmerviolinist.com`
  - `noreply@allanpalmerviolinist.com` (used by NextAuth magic-link as sender only — no replies expected)
  - `support@allanpalmerviolinist.com` (donations + general)

> Aliases route to the single mailbox. Only 1 real mailbox in the free tier — that's fine; aliases look distinct to customers but Allan only checks one inbox.

### 2.4 Add Zoho MX records to Vercel
- [ ] In Vercel DNS, add:

| Type | Name | Value | Priority |
|---|---|---|---|
| `MX` | `@` | `mx.zoho.com` | **10** |
| `MX` | `@` | `mx2.zoho.com` | **20** |
| `MX` | `@` | `mx3.zoho.com` | **50** |

- [ ] ⚠️ If Vercel auto-created an MX record pointing somewhere else (e.g. `mail.protonmail.ch` or a default), delete it first.
- [ ] Zoho → **Domain Setup → MX Records → Verify MX** — should go green.

### 2.5 Merge SPF records — CRITICAL
**You can have only ONE SPF TXT record at the root of the domain.** Resend's SPF is on the `send.` subdomain (safe). Zoho wants one at the **root**. Here's the rule:

- [ ] In Vercel DNS, check for an existing root SPF TXT record (Name: `@`, value starting with `v=spf1`).
- [ ] If **none exists**, add:
  ```
  Type: TXT
  Name: @
  Value: v=spf1 include:zoho.com ~all
  ```
- [ ] If **one already exists** (e.g. Vercel auto-added one, or a prior email service left one), **merge** by editing to:
  ```
  v=spf1 include:zoho.com [any other existing includes] ~all
  ```
  Do **not** create a second record — mail servers see duplicate SPF = invalid = spam flag.

Note: Resend's SPF is on `send.allanpalmerviolinist.com`, not the root, so it doesn't conflict with Zoho's root SPF. That separation is by design.

### 2.6 Zoho DKIM (recommended)
- [ ] Zoho → **Email Configuration → DKIM** → enable → pick selector like `zoho` → copy the TXT record
- [ ] Add to Vercel:
  ```
  Type: TXT
  Name: zoho._domainkey
  Value: (long DKIM string Zoho provides)
  ```
- [ ] Click **Verify** in Zoho. Activates signing.

### 2.7 Test inbound
- [ ] Send an email from any external account (Gmail, personal) to `hello@allanpalmerviolinist.com`.
- [ ] Log into Zoho webmail (`mail.zoho.com`) → should arrive within 1–2 minutes.
- [ ] Test all aliases: `allan@`, `hello@`, `lessons@`, `support@` — all should land in the same inbox.
- [ ] Reply from Zoho webmail. Confirm the reply shows the correct From address to the external recipient.

### 2.8 Optional — forward to Gmail
If Allan prefers checking mail in Gmail:
- [ ] Zoho → **Settings → Mail Forwarding → Add Email** → Allan's personal Gmail
- [ ] Verify via link Zoho sends to that Gmail
- [ ] Choose: **keep a copy in Zoho** (safer) vs **delete after forwarding** (Gmail-only)
- [ ] Now any email to `*@allanpalmerviolinist.com` lands in Allan's Gmail inbox within seconds.

---

## Phase 3 — Final DNS state

After both phases, Vercel DNS for `allanpalmerviolinist.com` should contain:

| Type | Name | Value | Purpose |
|---|---|---|---|
| A | @ | 216.150.1.1 | Website (new Vercel IP) |
| A | @ | 76.76.21.21 | Website (old Vercel IP, still works) |
| CNAME | www | cname.vercel-dns.com | Website www → apex |
| MX | @ | mx.zoho.com (prio 10) | Inbound mail → Zoho |
| MX | @ | mx2.zoho.com (prio 20) | Inbound backup |
| MX | @ | mx3.zoho.com (prio 50) | Inbound backup |
| MX | send | feedback-smtp.us-east-1.amazonses.com (prio 10) | Resend bounce handling |
| TXT | @ | `v=spf1 include:zoho.com ~all` | Root SPF (Zoho) |
| TXT | send | `v=spf1 include:amazonses.com ~all` | Subdomain SPF (Resend) |
| TXT | resend._domainkey | (Resend DKIM) | Resend signing |
| TXT | zoho._domainkey | (Zoho DKIM) | Zoho signing |
| TXT | _dmarc | `v=DMARC1; p=none;` | DMARC policy (lenient for now) |
| TXT | @ | `zoho-verification=zb…` | Zoho ownership proof (can remove after verified, but safe to keep) |

---

## Phase 4 — App configuration

### 4.1 Environment variables

Local `.env`:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxx
EMAIL_FROM="Allan Palmer <hello@allanpalmerviolinist.com>"
ADMIN_EMAIL=allan@allanpalmerviolinist.com
NEXT_PUBLIC_SITE_URL=https://www.allanpalmerviolinist.com
```

Vercel Production env (Settings → Environment Variables, scope = Production):
- Same 4 vars
- Also add to Preview + Development scopes if preview deployments should send real email (usually no — use `RESEND_API_KEY` scoped to Production only so preview branches can't send real mail accidentally).

### 4.2 Sender identity matrix

| From address | Used by | Reply expected? |
|---|---|---|
| `hello@allanpalmerviolinist.com` | Booking confirmations, donation receipts, general | Yes → Zoho inbox |
| `lessons@allanpalmerviolinist.com` | Lesson reminders, portal welcome, assignments | Yes → Zoho inbox |
| `noreply@allanpalmerviolinist.com` | NextAuth magic-link sign-in emails | No (but replies still forward to Zoho as safety net) |
| `support@allanpalmerviolinist.com` | Patron emails, donation-related | Yes → Zoho inbox |

All four are Zoho aliases pointing to the same inbox. All four are authorized to send via Resend because Resend verifies the whole domain, not individual addresses.

### 4.3 Preview email templates

Dev-only route, already built:
```
npm run dev
open http://localhost:3000/api/email-preview
```

Returns index of templates. Click any to render in browser. Returns 404 in production (safe).

---

## Phase 5 — CASL compliance (Canadian anti-spam law)

Required for every **marketing** email. Transactional emails (receipts, booking confirmations, lesson reminders) are exempt but including compliance anyway is best practice.

Add to `emailLayout()` footer in `lib/resend.ts`:

- [ ] **Physical mailing address** (Winnipeg PO Box recommended — don't publish a home address). Must be valid and current.
- [ ] **Clear sender identification**: "Sent by Allan Palmer, Professional Violinist, Winnipeg MB."
- [ ] **One-click unsubscribe link** for any marketing/non-transactional email. Store unsubscribes in DB, check before send.
- [ ] **Consent tracking**: save `consentedAt`, `consentSource` on any email subscription (newsletter signup, patron signup). Proves express consent if CRTC ever asks.

Transactional emails (booking confirmations, lesson reminders, receipts) do not need unsubscribe but DO benefit from:
- Reply-to: `hello@allanpalmerviolinist.com`
- Contact phone in footer

---

## Phase 6 — Security checklist

- [ ] Rotate the Resend API key that was shared in chat before production deploy
- [ ] `.env` in `.gitignore` (it is — verify)
- [ ] Vercel env vars set to **Production scope only** for keys; use a separate `re_test_...` key for Preview if needed
- [ ] Rate-limit email-sending endpoints (password reset, magic-link) — reuse `lib/rate-limit.ts`
- [ ] Don't log full email bodies. Log message IDs + recipient + template name only.
- [ ] Webhook signatures: when we set up Stripe, verify webhook signatures before processing (also in Resend if we use delivery webhooks)
- [ ] DMARC policy: start at `p=none`, upgrade to `p=quarantine` after 2 weeks of clean sending, then `p=reject` after a month.

---

## Phase 7 — Monitoring

- [ ] Resend dashboard → **Emails** tab → track delivery, bounces, complaints
- [ ] Zoho dashboard → **Reports** → inbound volume, spam catches
- [ ] Bounce rate target: **< 2%**. Complaint rate target: **< 0.1%**. Above either = clean your list.
- [ ] Set up Resend webhook to notify on hard bounces so we stop emailing dead addresses:
  - `POST /api/webhooks/resend` — mark user as email-invalid
  - Verify webhook signature

---

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Email lands in Gmail spam | DKIM not verified, or DMARC too strict too soon | Verify Resend DKIM record in Vercel DNS; start DMARC at `p=none` |
| "Sender could not be verified" red banner | SPF misaligned — sending from a domain that doesn't list your provider | Add `include:amazonses.com` to `send.` SPF; make sure From address subdomain matches |
| Inbound mail bounces | MX records not live yet, or wrong priority order | Use `dig MX allanpalmerviolinist.com` to check; wait for DNS propagation up to 48h |
| Two SPF records at root | Duplicate SPF = invalid = ALL outbound gets spam-flagged | Merge into one `v=spf1 include:zoho.com include:other ~all` |
| Resend says "verified" but email still fails | Wrong `EMAIL_FROM` — domain must match verified domain exactly | `hello@allanpalmerviolinist.com` ✅ / `hello@allanpalmer.com` ❌ |
| Can send from `hello@` but not `allan@` | You don't need per-address verification — this is a Zoho alias issue or a From header typo | Verify alias exists in Zoho; confirm From string has no typos |

---

## Order of operations — clean checklist

1. [ ] Rotate leaked Resend API key → new one into `.env`
2. [ ] Resend account → verify `allanpalmerviolinist.com` → 4 DNS records into Vercel
3. [ ] Zoho Mail free tier → verify domain → mailbox + aliases
4. [ ] Zoho MX + SPF + DKIM → Vercel DNS
5. [ ] SPF sanity check — one root SPF, no duplicates
6. [ ] Set 4 env vars (Local + Vercel Production)
7. [ ] Fix `allanpalmer.com` → `allanpalmerviolinist.com` in `lib/resend.ts` and email-preview route
8. [ ] Send test email: localhost → Gmail + Outlook + iCloud, confirm no spam
9. [ ] Send test email: external → `hello@allanpalmerviolinist.com`, confirm Zoho receives
10. [ ] Optional: forward Zoho → personal Gmail
11. [ ] CASL footer + unsubscribe in `emailLayout()`
12. [ ] Plan DMARC tightening timeline (`p=none` → `p=quarantine` at 2 weeks)

---

## Reference

- Resend docs: https://resend.com/docs
- Resend domain setup: https://resend.com/docs/send-with-nodejs#2-add-and-verify-your-domain
- Zoho Mail free setup: https://www.zoho.com/mail/help/adminconsole/add-domain.html
- Vercel DNS management: https://vercel.com/docs/projects/domains/working-with-dns
- CASL overview (CRTC): https://crtc.gc.ca/eng/com500/faq500.htm
- SPF/DKIM/DMARC explainer: https://dmarc.org/overview/
