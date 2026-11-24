/* 照片尋寶：輪盤＋加分板（index.html、wheel.html、scoreboard.html 共用） */
(function(){
const NUMS=['202','203','403','404','602','603'];
const COLS=['#F4A6B5','#8CC8EA','#8FD3B0','#F7C873','#C4B2E8','#F9B98C'];
const GROUPS=[{n:'第1組',c:'紅色',s:'★',hex:'#E0564F',soft:'#FBD9D6'},{n:'第2組',c:'藍色',s:'●',hex:'#3A7FC2',soft:'#D3E6F7'},{n:'第3組',c:'綠色',s:'▲',hex:'#3C9A63',soft:'#D2EEDD'}];
const KEY='photoHunt.scores.v1',PKEY='photoHunt.wheel.v1';
const load=(k,d)=>{try{return Object.assign(d,JSON.parse(localStorage.getItem(k)||'{}'))}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
// 點過的按鈕取消焦點，避免空白鍵誤按
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b)setTimeout(()=>b.blur(),0)},true);

function confetti(host){const box=document.createElement('div');box.className='confetti';host.appendChild(box);
 const cs=['#F4A6B5','#8CC8EA','#8FD3B0','#F7C873','#C4B2E8','#F9B98C','#fff'];
 for(let k=0;k<90;k++){const i=document.createElement('i');i.style.left=Math.random()*100+'%';i.style.background=cs[k%cs.length];
  i.style.setProperty('--dx',(Math.random()*400-200)+'px');i.style.setProperty('--r',(Math.random()*900-450)+'deg');
  i.style.animationDuration=(1.6+Math.random()*1.6)+'s';i.style.animationDelay=(Math.random()*.4)+'s';box.appendChild(i)}
 setTimeout(()=>box.remove(),3800)}
function chime(){try{const a=new (window.AudioContext||window.webkitAudioContext)();[523,659,784,1047].forEach((f,k)=>{const o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=f;o.connect(g);g.connect(a.destination);const t=a.currentTime+k*.12;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.5);o.start(t);o.stop(t+.55)})}catch(e){}}

function wheel(root){
 const st=load(PKEY,{noRepeat:true,picked:[]});
 const R=400,C=400;let html='';
 NUMS.forEach((n,k)=>{const a0=(k*60-90)*Math.PI/180,a1=((k+1)*60-90)*Math.PI/180;
  html+=`<g data-i="${k}"><path d="M${C} ${C}L${C+R*Math.cos(a0)} ${C+R*Math.sin(a0)}A${R} ${R} 0 0 1 ${C+R*Math.cos(a1)} ${C+R*Math.sin(a1)}Z" fill="${COLS[k]}" stroke="#fff" stroke-width="8"/>
  <g transform="rotate(${k*60+30} ${C} ${C})"><text class="lbl" data-a="${k*60+30}" x="${C}" y="${C-R*0.66}" text-anchor="middle" dominant-baseline="middle" font-size="104" fill="#4A3F35" font-family="Huninn,'Noto Sans TC',sans-serif">${n}</text>
  <text class="done" x="${C}" y="${C-R*0.4}" text-anchor="middle" dominant-baseline="middle" font-size="60" fill="#4A3F35" opacity="0">✓</text></g></g>`});
 root.innerHTML=`<div class="tool-wrap"><div class="wheel-box"><svg class="wheel-pointer" viewBox="0 0 90 110"><path d="M45 104L8 30a40 40 0 1 1 74 0z" fill="#E07A8B" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><circle cx="45" cy="38" r="13" fill="#fff"/></svg>
 <div class="wheel-rot"><svg viewBox="0 0 800 800">${html}</svg></div><button class="wheel-hub" aria-label="轉輪盤">轉！</button></div>
 <div class="wheel-side"><h2>幸運輪盤</h2><div class="result"><div class="lab">按「轉！」看看是誰</div><div class="num">？</div></div>
 <div class="row-ctl"><label class="toggle"><input type="checkbox" class="nr"><span class="sw"></span>抽過不重複</label><button class="pbtn pink rs">重新開始</button></div>
 <div class="picked"></div><div class="hint">按 空白鍵 或 Enter 也可以轉喔</div></div></div>`;
 const rot=root.querySelector('.wheel-rot'),hub=root.querySelector('.wheel-hub'),res=root.querySelector('.result'),
  num=res.querySelector('.num'),lab=res.querySelector('.lab'),nr=root.querySelector('.nr'),pk=root.querySelector('.picked');
 let angle=0,spinning=false;nr.checked=st.noRepeat;
 function upright(){root.querySelectorAll('.lbl').forEach(t=>t.style.transform=`rotate(${-(angle+ +t.dataset.a)}deg)`)}
 function paint(){root.querySelectorAll('svg g[data-i]').forEach(g=>{const on=st.noRepeat&&st.picked.includes(NUMS[+g.dataset.i]);g.style.opacity=on?.32:1;g.querySelector('.done').setAttribute('opacity',on?1:0)});
  pk.innerHTML=st.picked.length?'抽過：'+st.picked.map(n=>`<span>${n}</span>`).join(''):'';save(PKEY,st)}
 function spin(){if(spinning)return;const pool=NUMS.map((n,k)=>k).filter(k=>!(st.noRepeat&&st.picked.includes(NUMS[k])));
  if(!pool.length){lab.textContent='全部抽完了！';num.textContent='★';num.style.fontSize='';return}
  const k=pool[Math.floor(Math.random()*pool.length)];spinning=true;hub.disabled=true;res.classList.remove('pop');
  lab.textContent='轉呀轉…';num.textContent='…';num.style.fontSize='';
  const target=(360-(k*60+30)+(Math.random()*36-18)+3600)%360;const cur=((angle%360)+360)%360;
  angle+=360*6+((target-cur+360)%360);rot.style.transform=`rotate(${angle}deg)`;upright();
  setTimeout(()=>{spinning=false;hub.disabled=false;lab.textContent='就是你！';num.textContent=NUMS[k];void res.offsetWidth;res.classList.add('pop');
   if(!st.picked.includes(NUMS[k]))st.picked.push(NUMS[k]);paint();confetti(root.closest('.slide')||document.body);chime()},4900)}
 hub.onclick=spin;nr.onchange=()=>{st.noRepeat=nr.checked;paint()};
 root.querySelector('.rs').onclick=()=>{st.picked=[];lab.textContent='按「轉！」看看是誰';num.textContent='？';num.style.fontSize='';paint()};
 upright();paint();return {spin};
}

function board(root){
 const st=load(KEY,{g:[0,0,0],p:{}});NUMS.forEach(n=>st.p[n]=st.p[n]||0);
 const stars=(v,col)=>{const m=Math.min(v,10);return `<span style="color:${col}">${'★'.repeat(m)}</span>`+(v>10?`<span class="more">＋${v-10}</span>`:'')};
 root.innerHTML=`<div class="sb"><div class="sb-top"><h2 style="margin:0 20px 0 0">加分板</h2><button class="tab on" data-t="g">組別</button><button class="tab" data-t="p">個人</button><button class="pbtn pink rs">全部歸零</button></div>
 <div class="sb-pane on" data-p="g">${GROUPS.map((g,k)=>`<div class="gcard" style="background:${g.soft};border-color:${g.hex}"><div class="nm" style="color:${g.hex}">${g.s} ${g.n} ${g.c}</div><div class="score" data-g="${k}">0</div><div class="stars" data-gs="${k}"></div>
 <div class="pm"><button class="minus" data-gd="${k}" data-d="-1" aria-label="減一分">−</button><button style="background:${g.hex}" data-gd="${k}" data-d="1" aria-label="加一分">＋</button></div></div>`).join('')}</div>
 <div class="sb-pane" data-p="p" style="gap:40px 50px">${NUMS.map((n,k)=>`<div class="pcard" style="--c:${COLS[k]}"><div class="no">${n}</div><div class="score" data-pn="${n}">0</div><div class="stars" data-ps="${n}"></div>
 <div class="pm"><button class="minus" data-pd="${n}" data-d="-1" aria-label="減一分">−</button><button style="background:${COLS[k]}" data-pd="${n}" data-d="1" aria-label="加一分">＋</button></div></div>`).join('')}</div></div>`;
 function paint(){st.g.forEach((v,k)=>{root.querySelector(`[data-g="${k}"]`).textContent=v;root.querySelector(`[data-gs="${k}"]`).innerHTML=stars(v,GROUPS[k].hex)});
  NUMS.forEach((n,k)=>{root.querySelector(`[data-pn="${n}"]`).textContent=st.p[n];root.querySelector(`[data-ps="${n}"]`).innerHTML=stars(st.p[n],'#E0A43A')})}
 const bump=el=>{el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')};
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();
  if(b.dataset.t){root.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t===b));root.querySelectorAll('.sb-pane').forEach(p=>p.classList.toggle('on',p.dataset.p===b.dataset.t))}
  else if(b.dataset.gd!==undefined){const k=+b.dataset.gd;st.g[k]=Math.max(0,st.g[k]+ +b.dataset.d);save(KEY,st);paint();bump(root.querySelector(`[data-g="${k}"]`))}
  else if(b.dataset.pd){const n=b.dataset.pd;st.p[n]=Math.max(0,st.p[n]+ +b.dataset.d);save(KEY,st);paint();bump(root.querySelector(`[data-pn="${n}"]`))}
  else if(b.classList.contains('rs')){if(confirm('確定要把所有分數歸零嗎？')){st.g=[0,0,0];NUMS.forEach(n=>st.p[n]=0);save(KEY,st);paint()}}});
 addEventListener('storage',e=>{if(e.key===KEY){const s=load(KEY,{g:[0,0,0],p:{}});st.g=s.g;Object.assign(st.p,s.p);paint()}});
 paint();return {};
}
window.PhotoHunt={wheel,board};
})();
