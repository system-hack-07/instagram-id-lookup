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
https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(name)},
{
headers: {
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
"Accept": "application/json",
"Accept-Language": "en-US,en;q=0.9",
"Referer": "https://www.instagram.com/",
"X-Requested-With": "XMLHttpRequest",
"X-IG-App-ID": "936619743392459"
}
}
);

const text = await r.text();  

// ✅ CHECK IF RESPONSE IS HTML (BLOCKED)  
if (!text.startsWith("{")) {  
  return json({  
    error: "instagram_blocked",  
    message: "Instagram blocked the request. Try again later.",  
    status: r.status  
  }, 429);  
}  

let data;  
try {  
  data = JSON.parse(text);  
} catch (e) {  
  return json({  
    error: "invalid_json",  
    message: "Failed to parse response"  
  }, 500);  
}  

const user = data?.data?.user;  

if (!user) {  
  return json({ error: "not_found" }, 404);  
}  

return json({  
  success: true,  
  username: user.username,  
  name: user.full_name || user.username,  
  bio: user.biography || "",  
  pic: user.profile_pic_url_hd || user.profile_pic_url || "https://via.placeholder.com/150",  
  followers: user.edge_followed_by?.count || 0,  
  following: user.edge_follow?.count || 0,  
  posts: user.edge_owner_to_timeline_media?.count || 0,  
  id: user.id || "unknown"  
});

} catch (err) {
return json({
error: "server_error",
msg: err.message
}, 500);
}
}

function json(obj, status = 200) {
return new Response(JSON.stringify(obj), {
status,
headers: {
"Content-Type": "application/json",
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Methods": "GET, POST, OPTIONS"
}
});
}
