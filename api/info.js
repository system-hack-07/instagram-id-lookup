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
      `https://www.instagram.com/${name}/?__a=1&__d=dis`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const text = await r.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return json({
        error: "instagram_blocked",
        message: "Response not JSON"
      });
    }

    const user = data?.graphql?.user;

    if (!user) {
      return json({ error: "not_found" }, 404);
    }

    return json({
      username: user.username,
      name: user.full_name,
      bio: user.biography,
      pic: user.profile_pic_url_hd,
      followers: user.edge_followed_by.count,
      following: user.edge_follow.count,
      posts: user.edge_owner_to_timeline_media.count
    });

  } catch (err) {
    return json({ error: "server_error", msg: err.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}