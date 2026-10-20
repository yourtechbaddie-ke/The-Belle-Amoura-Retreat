import { db, admin } from "hatchable";

export const access = "public";
export const methods = ["GET"];

export default async function (req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });
  const owner = await admin.require(req, res);
  if (!owner) return;
  try {
    const result = await db.query("SELECT id, name, email, phone, role, organization, location, interest, investment_range, message, status, created_at FROM investor_leads ORDER BY created_at DESC LIMIT 500");
    return res.json({ leads: result.rows || [] });
  } catch (error) {
    console.error("Investor leads list failed", error?.message || error);
    return res.status(500).json({ error: "Could not load investor enquiries." });
  }
}