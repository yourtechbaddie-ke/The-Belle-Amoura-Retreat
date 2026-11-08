import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

function clean(value, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export default async function (req, res) {
  const body = req.body || {};
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const destination = clean(body.destination, 240);
  const travellers = clean(body.travellers, 80);
  const interest = clean(body.interest, 120);
  const timing = clean(body.timing, 100);
  const message = clean(body.message, 3000);
  const consent = body.consent === true || body.consent === "true";

  if (name.length < 2) return res.status(400).json({ error: "Please enter your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (!consent) return res.status(400).json({ error: "Please confirm that we may use these details to respond to your enquiry." });

  try {
    const result = await db.query(
      "INSERT INTO travel_inquiries (name, email, destination, travellers, interest, timing, message, consent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at",
      [name, email, destination, travellers, interest, timing, message, consent]
    );
    return res.status(201).json({ ok: true, inquiryId: result.rows?.[0]?.id, receivedAt: result.rows?.[0]?.created_at });
  } catch (error) {
    console.error("Travel enquiry save failed", error?.message || error);
    return res.status(500).json({ error: "We could not save your enquiry right now. Please try again shortly." });
  }
}