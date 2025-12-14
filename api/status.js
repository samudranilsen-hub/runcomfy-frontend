export default async function handler(req, res) {
  const { requestId } = req.query;

  const r = await fetch(
    `https://api.runcomfy.net/prod/v1/deployments/c9067009-10ce-4f43-b977-79ff5dc30337/requests/${requestId}/status`,
    {
      headers: { "Authorization": `Bearer ${process.env.RUNCOMFY_API_KEY}` }
    }
  );

  res.status(200).json(await r.json());
}
