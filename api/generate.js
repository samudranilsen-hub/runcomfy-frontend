export const config = {
  api: { bodyParser: false }
};

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

    // DEBUG: Log what we are sending
    console.log("Sending request to Google Vertex AI…");

    const response = await fetch(
      "https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0500086483/locations/us-central1/publishers/google/models/imagegeneration@001:predict?key=" +
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

    // DEBUG: Try to read HTTP-level errors
    if (!response.ok) {
      const txt = await response.text();
      return res.status(500).json({
        message: "Google API request failed",
        status: response.status,
        error: txt
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      message: "Server crashed",
      error: err.toString()
    });
  }
}
