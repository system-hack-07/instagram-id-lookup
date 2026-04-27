export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ success: false });

  try {
    const r = await fetch("https://veoaifree.com/wp-admin/admin-ajax.php", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        action: "veo_video_generator",
        promptText: prompt,
        totalImages: "1",
        ratio: "IMAGE_ASPECT_RATIO_PORTRAIT",
        actionType: "whisk_final_image"
      })
    });

    const data = await r.json();
    const img = data?.data_uri || "";

    if (!img) return res.json({ success: false });

    return res.json({ success: true, image: img });

  } catch {
    return res.json({ success: false });
  }
}
