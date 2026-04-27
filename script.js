const gallery = document.getElementById("gallery");
const bot = document.getElementById("bot");

document.getElementById("generateBtn").addEventListener("click", generate);

function botLog(text) {
  const line = document.createElement("div");
  line.innerText = "AI > " + text;
  bot.appendChild(line);
  bot.scrollTop = bot.scrollHeight;
}

function bootAnimation() {
  return new Promise(resolve => {
    const screen = document.getElementById("bootScreen");
    const text = document.getElementById("bootText");

    screen.style.display = "block";
    text.innerText = "";

    const lines = [
      "[BOOT] AI CORE INITIALIZED",
      "[SYS] NEURAL NETWORK LOADED",
      "[NET] CONNECTING...",
      "[AUTH] ACCESS GRANTED ✔",
      "[START] LAUNCHING ENGINE..."
    ];

    let i = 0;

    function typeLine() {
      if (i >= lines.length) {
        setTimeout(() => {
          screen.style.display = "none";
          resolve();
        }, 500);
        return;
      }

      text.innerText += lines[i] + "\n";
      i++;
      setTimeout(typeLine, 500);
    }

    typeLine();
  });
}

async function generate() {
  const prompt = document.getElementById("prompt").value;
  if (!prompt) return;

  await bootAnimation();

  gallery.innerHTML = "";
  bot.innerHTML = "";

  botLog("System ready...");
  botLog("Processing prompt...");

  const requests = [];

  for (let i = 1; i <= 4; i++) {
    botLog("Generating image " + i + "/4");

    requests.push(
      fetch("/api/generate", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt})
      }).then(r=>r.json())
    );
  }

  const results = await Promise.all(requests);

  botLog("Rendering results...");

  results.forEach((d, i) => {
    if (!d.success) {
      botLog("Image " + (i+1) + " failed ❌");
      return;
    }

    const img = document.createElement("img");
    img.src = d.image;
    img.onclick = () => openModal(d.image);
    gallery.appendChild(img);

    botLog("Image " + (i+1) + " ready ✅");
  });

  botLog("All tasks completed ⚡");
}

function openModal(src) {
  document.getElementById("modal").style.display="flex";
  document.getElementById("modalImg").src=src;
}

function closeModal() {
  document.getElementById("modal").style.display="none";
}
