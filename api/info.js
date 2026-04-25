addEventListener("fetch", event => {
  event.respondWith(handle(event.request));
});

async function handle(req) {
  const url = new URL(req.url);
  const name = url.searchParams.get("username");

  if (!name) {
    return json({ error: "missing_username" }, 400);
  }

  try {
    const r = await fetch(
      `https://www.instagram.com/${encodeURIComponent(name)}/?__a=1&__d=dis`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json",
          "Referer": "https://www.instagram.com/"
        }
      }
    );

    const text = await r.text();

    // ✅ SAFETY CHECK (Instagram often blocks and returns HTML)
    if (!text || !text.trim().startsWith("{")) {
      return json({
        error: "instagram_blocked",
        message: "Instagram did not return JSON response"
      }, 429);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return json({
        error: "invalid_json",
        message: "Failed to parse Instagram response"
      }, 500);
    }

    const user = data?.graphql?.user;

    if (!user) {
      return json({ error: "not_found" }, 404);
    }

    return json({
      success: true,
      username: user.username,
      name: user.full_name || user.username,
      bio: user.biography || "",
      pic: user.profile_pic_url_hd || user.profile_pic_url,
      followers: user.edge_followed_by?.count || 0,
      following: user.edge_follow?.count || 0,
      posts: user.edge_owner_to_timeline_media?.count || 0
    });

  } catch (err) {
    return json({
      error: "server_error",
      message: err.message
    }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
  }
