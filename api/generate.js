const BASE = "https://api.runcomfy.net";
const DEPLOYMENT_ID = "c9067009-10ce-4f43-b977-79ff5dc30337";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    const prompt = form.get("prompt");

    const uploadForm = new FormData();
    uploadForm.append("file", file, file.name);

    const uploadRes = await fetch(`${BASE}/prod/v1/assets`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RUNCOMFY_API_KEY}` },
      body: uploadForm
    });

    const uploadData = await uploadRes.json();
    const imagePath = uploadData.path;

    const inferRes = await fetch(
      `${BASE}/prod/v1/deployments/${DEPLOYMENT_ID}/inference`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RUNCOMFY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          overrides: {
            "6": { inputs: { text: prompt } },
            "194": { inputs: { image: imagePath } }
          }
        })
      }
    );

    const inferData = await inferRes.json();
    res.status(200).json(inferData);

  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
