export default async function handler(req, res) {
  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ error: "Missing jobId" });
  }

  const response = await fetch(
    `https://api.runcomfy.com/v1/jobs/${jobId}`,
    {
      headers: {
        "Authorization": `Bearer ${process.env.RUNCOMFY_API_KEY}`
      }
    }
  );

  const data = await response.json();
  return res.status(200).json(data);
}
