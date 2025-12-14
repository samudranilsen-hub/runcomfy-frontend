const BASE = "https://api.runcomfy.net";
const DEPLOYMENT_ID = "c9067009-10ce-4f43-b977-79ff5dc30337";

export default async function handler(req, res) {
  const { requestId } = req.query;

  const r = await fetch(
    `${BASE}/prod/v1/deployments/${DEPLOYMENT_ID}/requests/${requestId}/status`,
    { headers: { Authorization: `Bearer ${process.env.RUNCOMFY_API_KEY}` } }
  );

  const data = await r.json();
  res.status(200).json(data);
}
