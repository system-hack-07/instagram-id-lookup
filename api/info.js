export default async function handler(req, res) {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "missing_username" });
    }

    const response = await fetch(
      `https://www.instagram.com/${username}/?__a=1&__d=dis`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const text = await response.text();

    // SAFETY CHECK (prevents crash)
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
      return res.status(404).json({ error: "not_found" });
    }

    return res.status(200).json({
      success: true,
      username: user.username,
      name: user.full_name || "",
      bio: user.biography || "",
      pic: user.profile_pic_url_hd,
      followers: user.edge_followed_by?.count || 0,
      following: user.edge_follow?.count || 0,
      posts: user.edge_owner_to_timeline_media?.count || 0
    });

  } catch (err) {
    return res.status(500).json({
      error: "server_error",
      msg: err.message
    });
  }
}
