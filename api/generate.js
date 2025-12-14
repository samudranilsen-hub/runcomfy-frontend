export const config = {
  runtime: "edge"
};

const BASE = "https://api.runcomfy.net";
const DEPLOYMENT_ID = "c9067009-10ce-4f43-b977-79ff5dc30337";

export default async function handler(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const prompt = formData.get("prompt");

    if (!file || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing image or prompt" }),
        { status: 400 }
      );
    }

    // 1️⃣ Upload image to RunComfy
    const uploadForm = new FormData();
    uploadForm.append("file", file, file.name);

    const uploadRes = await fetch(`${BASE}/prod/v1/assets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RUNCOMFY_API_KEY}`
      },
      body: uploadForm
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      return new Response(JSON.stringify(uploadData), { status: 500 });
    }

    const imagePath = uploadData.path;

    // 2️⃣ Start inference
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
    return new Response(JSON.stringify(inferData), { status: 200 });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500 }
    );
  }
}
