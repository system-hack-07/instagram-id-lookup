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

/* SCAN */
document.getElementById("scanBtn").onclick = async function(){

const user=document.getElementById("user").value;
const status=document.getElementById("status");
const bar=document.getElementById("bar");
const result=document.getElementById("result");

if(!user){
status.innerText="Enter username";
return;
}

/* SOUND */
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

try{
const r=await fetch(`/api/info?username=${user}`);
const text=await r.text();

let d;
try{
d=JSON.parse(text);
}catch(e){
status.innerText="Server error";
return;
}

if(d.error){
status.innerText="Error: "+d.error;
return;
}

status.innerText="Profile found";

result.innerHTML=`
<div style="border:1px solid #00ffd5;padding:15px;margin-top:10px;width:300px">
<div style="display:flex;gap:10px;align-items:center">
<img src="${d.pic}" style="width:50px;border-radius:50%">
<div>
<h3>${d.name}</h3>
<p>@${d.username}</p>
</div>
</div>
<div>Followers: ${d.followers}</div>
<div>Following: ${d.following}</div>
<div>Posts: ${d.posts}</div>
</div>
`;

}catch(e){
status.innerText="Request failed";
}
};
