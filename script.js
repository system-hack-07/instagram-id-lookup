body {
  background:#05060a;
  color:#00ffd5;
  font-family:'Orbitron',sans-serif;
  text-align:center;
  margin:0;
}

/* WAVES */
.waves {
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  z-index:-1;
}

.waves span {
  position:absolute;
  border-radius:50%;
  border:1px solid rgba(0,255,213,0.3);
  animation:wave 8s linear infinite;
}

.waves span:nth-child(1){width:200px;height:200px;}
.waves span:nth-child(2){width:400px;height:400px;animation-delay:2s;}
.waves span:nth-child(3){width:600px;height:600px;animation-delay:4s;}

@keyframes wave {
  0% {transform:translate(-50%,-50%) scale(0.5);opacity:0.8;}
  100% {transform:translate(-50%,-50%) scale(1.8);opacity:0;}
}

/* APP */
.app {
  margin-top:50px;
  padding-bottom:100px; /* FIX overlap */
}

.title {
  font-size:36px;
  background:linear-gradient(90deg,#00ffd5,#00bfff,#7a5cff);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.input-box {margin:20px;}

input {
  padding:10px;
  background:black;
  border:1px solid #00ffd5;
  color:#00ffd5;
}

button {
  padding:10px;
  background:#00ffd5;
  border:none;
  cursor:pointer;
}

/* BOT */
.bot-console {
  margin:15px auto;
  width:260px;
  height:100px;
  overflow-y:auto;
  border:1px solid #00ffd5;
  padding:8px;
  font-size:11px;
  text-align:left;
}

/* GALLERY */
.gallery {
  margin-top:20px;
  display:grid;
  grid-template-columns:repeat(2,140px);
  gap:10px;
  justify-content:center;
}

.gallery img {
  width:100%;
  cursor:pointer;
}

/* MODAL */
.modal {
  display:none;
  position:fixed;
  top:0;left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.9);
  justify-content:center;
  align-items:center;
}

.modal img {width:80%;}

/* BOOT */
.boot-screen {
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:black;
  color:#00ffd5;
  display:none;
  z-index:999;
  padding:20px;
  font-family:monospace;
}

/* FOOTER FIXED */
.footer {
  position:fixed;
  bottom:0;
  left:0;
  width:100%;

  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;

  padding:8px 0;
  gap:4px;

  background:rgba(0,0,0,0.6);
  backdrop-filter:blur(10px);

  z-index:10;
}

.copyright {
  font-size:12px;
  opacity:0.8;
}

/* GLITCH FIXED */
.made {
  position:relative;
  font-size:13px;
  max-width:90%;
  overflow:hidden;
}

.glitch-name::before,
.glitch-name::after {
  content:attr(data-text);
  position:absolute;
  left:0;
  width:100%;
  text-align:center;
}

.glitch-name::before {
  color:red;
  animation:glitch 1s infinite;
  clip-path: inset(0 0 50% 0);
}

.glitch-name::after {
  color:blue;
  animation:glitch 1s infinite reverse;
  clip-path: inset(50% 0 0 0);
}

@keyframes glitch {
  0% {transform:translate(0);}
  50% {transform:translate(-1px,1px);}
  100% {transform:translate(0);}
    }
