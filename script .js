const bootText=document.getElementById("bootText");
const app=document.getElementById("app");

const logs=[
"Booting system...",
"Loading modules...",
"Connecting API...",
"System ready."
];

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

/* MATRIX */
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

/* LOOKUP */
document.getElementById("scanBtn").onclick=async function(){

const user=document.getElementById("user").value;
const status=document.getElementById("status");
const bar=document.getElementById("bar");
const result=document.getElementById("result");

if(!user){
status.innerText="Enter username";
return;
}

new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg").play();

status.innerText="Looking up...";
bar.style.width="0%";

/* progress */
let p=0;
let prog=setInterval(()=>{
p+=5;
bar.style.width=p+"%";
if(p>=100)clearInterval(prog);
},80);

/* API */
setTimeout(async ()=>{

try{
const r=await fetch(`/api/info?username=${user}`);
const d=await r.json();

if(d.error){
status.innerText="Not found";
return;
}

status.innerText="Profile loaded";

result.innerHTML=`
<div class="card">
<div class="profile">
<img src="${d.pic}">
<div>
<h3>${d.username}</h3>
<p>@${d.username}</p>
</div>
</div>

<div>Followers: ${d.followers || 0}</div>
<div>Following: ${d.following || 0}</div>
</div>
`;

}catch(e){
status.innerText="Error";
}

},2000);
};