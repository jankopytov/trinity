// Kontakt form endpoint.
//
// DELIVERY TRANSPORT IS PENDING A DECISION (Formspree vs. own SMTP/endpoint).
// Resend was removed by the client, so this route does NOT send any email.
// It validates the payload (required fields + email + honeypot) and, on valid
// input, returns success so the form's inline success state works. The actual
// delivery is intentionally a no-op for now — we do not fake an external send,
// and we do not crash. Wire a transport here once the channel is chosen:
//   const ok = await deliver({ name, apotheke, email, telefon, betreff, nachricht });
//
// Until then submissions are accepted and acknowledged but not forwarded.

export const runtime = "nodejs";

const isEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const name = String(data.name ?? "").trim();
  const apotheke = String(data.apotheke ?? "").trim();
  const email = String(data.email ?? "").trim();
  const telefon = String(data.telefon ?? "").trim();
  const betreff = String(data.betreff ?? "").trim();
  const nachricht = String(data.nachricht ?? "").trim();
  const honeypot = String(data.company ?? "").trim(); // bots fill this

  // honeypot tripped → accept silently (don't tip off the bot), forward nothing
  if (honeypot) return Response.json({ ok: true });

  // server-side required + email validation (mirrors the client rules)
  if (!name || !apotheke || !betreff || !isEmail(email)) {
    return Response.json(
      { error: "Pflichtfelder fehlen oder E-Mail ungültig." },
      { status: 422 }
    );
  }

  // No transport configured yet → accept the submission without forwarding.
  // (Reference the parsed fields so the shape is explicit for whoever wires
  // the transport next; no logging of PII in production.)
  void { name, apotheke, email, telefon, betreff, nachricht };

  return Response.json({ ok: true });
}
