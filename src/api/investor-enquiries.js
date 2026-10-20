import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

function clean(value, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export default async function (req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const body = req.body || {};
  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 40);
  const role = clean(body.role, 160);
  const organization = clean(body.organization, 180);
  const location = clean(body.location, 180);
  const interest = clean(body.interest, 120);
  const investmentRange = clean(body.investment_range, 80);
  const message = clean(body.message, 3000);
  const consent = body.consent === true || body.consent === "true";

  if (name.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (phone.length < 6) return res.status(400).json({ error: "Please enter a valid phone number." });
  if (role.length < 2 || location.length < 2 || !interest || message.length < 10) return res.status(400).json({ error: "Please complete all required fields and include a short introduction." });
  if (!consent) return res.status(400).json({ error: "Please confirm that we may use these details to respond to your enquiry." });

  try {
    const result = await db.query(
      "INSERT INTO investor_leads (name, email, phone, role, organization, location, interest, investment_range, message, consent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, created_at",
      [name, email, phone, role, organization, location, interest, investmentRange, message, consent]
    );
    return res.status(201).json({ ok: true, leadId: result.rows?.[0]?.id, receivedAt: result.rows?.[0]?.created_at, message: "Thank you. Your enquiry has been received. Our team will review it and contact you if there is a fit." });
  } catch (error) {
    console.error("Investor enquiry save failed", error?.message || error);
    return res.status(500).json({ error: "We could not submit your enquiry right now. Please try again shortly." });
  }
}