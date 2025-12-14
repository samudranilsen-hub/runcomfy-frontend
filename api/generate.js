const DEPLOYMENT_ID = "c9067009-10ce-4f43-b977-79ff5dc30337";
const BASE_URL = "https://api.runcomfy.net";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const url = `${BASE_URL}/prod/v1/deployments/${DEPLOYMENT_ID}/inference`;

    // Use cloud-saved workflow; override node 6 text (your Positive Prompt node)
    const body = {
      overrides: {
        "6": {
          inputs: { text: prompt }
        }
      }
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RUNCOMFY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();

    // Forward errors clearly
    if (!resp.ok) {
      return res.status(resp.status).json({ error: "RunComfy error", details: data });
    }

    // data contains request_id + status_url/result_url per docs
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
