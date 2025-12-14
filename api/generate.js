export default async function handler(req, res) {
  try {
    const { prompt, image } = req.body;

    if (!prompt || !image) {
      return res.status(400).json({ error: "Missing prompt or image" });
    }

    const workflow = {
      overrides: {
        "6": { inputs: { text: prompt } },

        // Your LoadImage node (194)
        "194": {
          inputs: {
            image: `data:image/png;base64,${image}`
          }
        }
      }
    };

    const resp = await fetch(
      "https://api.runcomfy.net/prod/v1/deployments/c9067009-10ce-4f43-b977-79ff5dc30337/inference",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RUNCOMFY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(workflow)
      }
    );

    const data = await resp.json();
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
