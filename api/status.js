const DEPLOYMENT_ID = "c9067009-10ce-4f43-b977-79ff5dc30337";
const BASE_URL = "https://api.runcomfy.net";

export default async function handler(req, res) {
  try {
    const { requestId } = req.query || {};
    if (!requestId) return res.status(400).json({ error: "Missing requestId" });

    const url = `${BASE_URL}/prod/v1/deployments/${DEPLOYMENT_ID}/requests/${requestId}/status`;

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.RUNCOMFY_API_KEY}` }
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: "RunComfy error", details: data });

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
