const bootText=document.getElementById("bootText");
const app=document.getElementById("app");
const logs=["Booting system...","Loading modules...","Connecting API...","System ready."];
let i=0;
function boot(){
 if(i<logs.length){
 bootText.innerHTML+=logs[i]+"<br>";
 i++;
 setTimeout(boot,600);
 }else{
 document.getElementById("boot").style.display="none";
 app.classList.remove("hidden");
 }
}
boot();
const c=document.getElementById("matrix");
const ctx=c.getContext("2d");
c.width=window.innerWidth;
c.height=window.innerHeight;
let letters="01@#$%^&*".split("");
let font=12;
let cols=c.width/font;
let drops=[];
for(let x=0;x<cols;x++)drops[x]=1;
function draw(){
 ctx.fillStyle="rgba(0,0,0,0.05)";
 ctx.fillRect(0,0,c.width,c.height);
 ctx.fillStyle="#00ffd5";
 ctx.font=font+"px monospace";
 for(let i=0;i<drops.length;i++){
 let text=letters[Math.floor(Math.random()*letters.length)];
 ctx.fillText(text,i*font,drops[i]*font);
 if(drops[i]*font>c.height)drops[i]=0;
 drops[i]++;
 }
}
setInterval(draw,35);
document.getElementById("scanBtn").onclick=async function(){
 const user=document.getElementById("user").value;
 const status=document.getElementById("status");
 const bar=document.getElementById("bar");
 const result=document.getElementById("result");
 if(!user){
 status.innerText="❌ Enter username";
 return;
 }
 new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg").play();
 status.innerText="🔍 Looking up...";
 bar.style.width="0%";
 let p=0;
 let prog=setInterval(()=>{
 p+=5;
 bar.style.width=p+"%";
 if(p>=100)clearInterval(prog);
 },80);
 setTimeout(async ()=>{
 try{
 const r=await fetch(`/api/info?username=${user}`);
 const d=await r.json();
 if(d.error){
 status.innerText="❌ User not found";
 result.innerHTML=`<div class="error">Error: ${d.error}</div>`;
 return;
 }
 if(d.success){
 status.innerText="✅ Profile loaded";
 const userData=d.user;
 result.innerHTML=`
 <div class="card">
 <div class="profile">
 <img src="${userData.profile_pic_url}" alt="${userData.username}" onerror="this.src='https://via.placeholder.com/150'">
 <div>
 <h3>${userData.full_name || userData.username}</h3>
 <p>@${userData.username}</p>
 ${userData.is_verified ? '<span class="verified">✓ Verified</span>' : ''}
 </div>
 </div>
 <div class="stats">
 <div class="stat">
 <span class="label">Followers</span>
 <span class="value">${userData.follower_count.toLocaleString()}</span>
 </div>
 <div class="stat">
 <span class="label">Following</span>
 <span class="value">${userData.following_count.toLocaleString()}</span>
 </div>
 <div class="stat">
 <span class="label">Posts</span>
 <span class="value">${userData.media_count.toLocaleString()}</span>
 </div>
 </div>
 <div class="bio">
 <strong>Bio:</strong>
 <p>${userData.biography || 'No bio'}</p>
 </div>
 <div class="extra">
 <div><strong>User ID:</strong> ${userData.id}</div>
 <div><strong>Private:</strong> ${userData.is_private ? '🔒 Yes' : '🌐 No'}</div>
 ${userData.external_url ? `<div><strong>Website:</strong> <a href="${userData.external_url}" target="_blank">${userData.external_url}</a></div>` : ''}
 ${userData.category_name ? `<div><strong>Category:</strong> ${userData.category_name}</div>` : ''}
 </div>
 <div class="user-id-display">
 <strong>Instagram ID: <code>${userData.id}</code></strong>
 </div>
 </div>
 `;
 }else{
 status.innerText="❌ Unable to fetch profile";
 }
 }catch(e){
 status.innerText="❌ Error: " + e.message;
 result.innerHTML=`<div class="error">Error occurred: ${e.message}</div>`;
 console.error('API Error:', e);
 }
 },2000);
};