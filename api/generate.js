export const config = {
  api: { bodyParser: false }
};

import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    const prompt = form.get("prompt");

    if (!file || !prompt) {
      return res.status(400).json({ error: "Missing prompt or image" });
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const response = await fetch(
      "https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0500086483/locations/us-central1/publishers/google/models/imagegeneration:predict?key=" +
      process.env.GOOGLE_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt,
              image: {
                bytesBase64Encoded: base64Image
              }
            }
          ]
        })
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
