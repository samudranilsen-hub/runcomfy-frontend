export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  // ⬇️ PASTE YOUR WORKFLOW JSON HERE
  const workflow = {
    /* PASTE THE FULL workflow.json CONTENT HERE */
  };

  const response = await fetch("https://api.runcomfy.com/v1/run", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RUNCOMFY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      deployment_id: "c9067009-10ce-4f43-b977-79ff5dc30337",
      workflow,
      inputs: {
        "6": {
          inputs: {
            text: prompt
          }
        }
      }
    })
  });

  const data = await response.json();
  return res.status(200).json(data);
}
