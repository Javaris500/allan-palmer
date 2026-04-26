import "dotenv/config";
// Override FROM to Resend's sandbox sender so the test doesn't require the
// production domain (allanpalmer.com) to be verified yet. Must be set before
// ../lib/resend is imported so the module picks up the override at load time.
process.env.EMAIL_FROM =
  process.env.EMAIL_FROM_OVERRIDE || "Allan Palmer <onboarding@resend.dev>";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { sendNewBookingAlert, sendBookingReceived } =
  require("../lib/resend") as typeof import("../lib/resend");

// Resend's sandbox mode only permits sending to the account owner's own
// address until a domain is verified. Override with TEST_TO=... if you want
// to target a different verified address.
const ADMIN_EMAIL =
  process.env.TEST_TO ||
  process.env.RESEND_ACCOUNT_EMAIL ||
  "javaris500@gmail.com";

const samples = [
  {
    reference: "BK-TEST-0001",
    contactName: "Jane Smith",
    contactEmail: ADMIN_EMAIL,
    contactPhone: "204-555-0100",
    eventType: "Wedding - Ceremony + Cocktail Hour",
    eventDate: "2026-07-12",
    timePreference: "5pm",
    venue: "Fort Whyte",
    guestCount: "120",
    duration: "2 hours",
    musicStyles: ["Classical", "Pop"],
    songRequests: "Canon in D · Perfect (Ed Sheeran)",
    specialRequirements: "Outdoor setup — amplification needed.",
  },
  {
    reference: "BK-TEST-0002",
    contactName: "John Doe",
    contactEmail: ADMIN_EMAIL,
    contactPhone: "204-555-0199",
    eventType: "Corporate Gala",
    eventDate: "2026-09-20",
    timePreference: "7pm",
    venue: "Fort Garry Hotel",
    guestCount: "250",
    duration: "1 hour cocktail reception",
    musicStyles: ["Jazz", "Contemporary"],
    songRequests: "Open repertoire — jazz standards preferred.",
    specialRequirements: null,
  },
];

async function main() {
  console.log(`Sending ${samples.length * 2} test emails → ${ADMIN_EMAIL}`);

  for (const s of samples) {
    console.log(`\n— ${s.reference} · ${s.contactName} —`);

    const alertRes = await sendNewBookingAlert(s);
    console.log(
      "  alert:",
      alertRes.error ? `FAILED: ${alertRes.error.message}` : "sent",
      alertRes.data?.id ? `(${alertRes.data.id})` : "",
    );

    const receiptRes = await sendBookingReceived({
      to: s.contactEmail,
      name: s.contactName,
      reference: s.reference,
      eventType: s.eventType,
      eventDate: s.eventDate,
      timePreference: s.timePreference,
      duration: s.duration,
    });
    console.log(
      "  receipt:",
      receiptRes.error ? `FAILED: ${receiptRes.error.message}` : "sent",
      receiptRes.data?.id ? `(${receiptRes.data.id})` : "",
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
