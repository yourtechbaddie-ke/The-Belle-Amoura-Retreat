import { db } from "hatchable";

export const access = "admin";
export const methods = ["GET"];

export default async function (req, res) {
  const limit = Math.max(1, Math.min(100, Number.parseInt(req.query?.limit || "50", 10) || 50));
  const result = await db.query(
    "SELECT id, name, email, destination, travellers, interest, timing, message, status, created_at FROM travel_inquiries ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  return res.json({ inquiries: result.rows || [] });
}