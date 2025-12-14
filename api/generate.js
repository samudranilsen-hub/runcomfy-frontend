export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    console.log("Received request");

    // Make sure we are getting JSON
    if (!req.body) {
      return res.status(400).json({ error: "Backend did not receive body" });
    }

    const { prompt, imageBase64 } = req.body;

    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    if (!imageBase64) return res.status(400).json({ error: "Missing base64 image" });

    console.log("Calling Google Vertex AI…");

    const url =
      "https://us-central1-aiplatform.googleapis.com/v1/projects/gen-lang-client-0500086483/locations/us-central1/publishers/google/models/imagegeneration@001:predict?key=" +
      process.env.GOOGLE_API_KEY;

    const payload = {
      instances: [
        {
          prompt: prompt,
          image: {
            bytesBase64Encoded: imageBase64
          }
        }
      ]
    };

    console.log("Payload ready");

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("Google responded with status:", apiResponse.status);

    const text = await apiResponse.text(); // ALWAYS read text first

    // Return EVERYTHING Google returned, raw
    return res.status(200).json({
      ok: apiResponse.ok,
      status: apiResponse.status,
      googleResponse: text
    });

  } catch (err) {
    console.error("Server crashed:", err);
    return res.status(500).json({
      message: "Server crashed",
      error: err.toString()
    });
  }
}
