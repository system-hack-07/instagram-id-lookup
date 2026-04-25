export default async function handler(req, res) {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: "missing_username"
    });
  }

  try {
    const r = await fetch(
      `https://www.instagram.com/${username}/?__a=1&__d=dis`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://www.instagram.com/",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1"
        }
      }
    );

    const text = await r.text();

    // ⚠️ If Instagram blocks → DO NOT CRASH
    if (!text || !text.includes("{")) {
      return res.status(200).json({
        success: false,
        error: "instagram_blocked"
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(200).json({
        success: false,
        error: "invalid_json"
      });
    }

    const user = data?.graphql?.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "not_found"
      });
    }

    return res.status(200).json({
      success: true,
      username: user.username,
      name: user.full_name || user.username,
      bio: user.biography || "",
      pic: user.profile_pic_url_hd,
      followers: user.edge_followed_by?.count || 0,
      following: user.edge_follow?.count || 0,
      posts: user.edge_owner_to_timeline_media?.count || 0
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "server_error",
      message: err.message
    });
  }
}
