import {FPS,TOTAL_FRAMES,locate} from './timeline.mjs';
import {resourcePaths,renderFrame} from './film.mjs';
const canvas=document.getElementById('frame'),ctx=canvas.getContext('2d');
const seek=document.getElementById('seek'),clock=document.getElementById('clock'),shot=document.getElementById('shot');
const toggles={original:document.getElementById('ab'),layers:document.getElementById('leaf'),actors:document.getElementById('actor'),motion:document.getElementById('motion'),shadow:document.getElementById('shadow')};
let at=0,playing=false,started=0,anchor=0,manifest,imgs={};
function opts(){return {original:toggles.original.checked,layers:toggles.layers.checked,actors:toggles.actors.checked,motion:toggles.motion.checked,shadow:toggles.shadow.checked}}
function paint(f){at=Math.max(0,Math.min(TOTAL_FRAMES-1,Math.floor(f)));const s=renderFrame(ctx,at,imgs,manifest,opts());
 seek.value=String(at);const sec=at/FPS;clock.textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(Math.floor(sec%60)).padStart(2,'0')}:${String(at%FPS).padStart(2,'0')} / 2160`;
 shot.textContent=`${s.id}  ·  ${s.name}  ·  ${s.status}`;window.__PEEKABOO_LAST_FRAME=at;
}
function pause(){playing=false;document.getElementById('play').textContent='Play'}
function tick(now){if(!playing)return;const frame=anchor+Math.floor((now-started)*FPS/1000);if(frame>=TOTAL_FRAMES){pause();paint(TOTAL_FRAMES-1);return}paint(frame);requestAnimationFrame(tick)}
function play(){if(playing){pause();return}if(at>=TOTAL_FRAMES-1)at=0;anchor=at;started=performance.now();playing=true;document.getElementById('play').textContent='Pause';requestAnimationFrame(tick)}
document.getElementById('play').onclick=play;
document.getElementById('back').onclick=()=>{pause();paint(at-1)};
document.getElementById('forward').onclick=()=>{pause();paint(at+1)};
seek.oninput=()=>{pause();paint(+seek.value)};
for(const item of Object.values(toggles))item.onchange=()=>paint(at);
window.addEventListener('keydown',e=>{if(['INPUT','BUTTON'].includes(document.activeElement?.tagName) && e.code==='Space')return;
 if(e.code==='Space'){e.preventDefault();play()}else if(e.code==='ArrowLeft'){e.preventDefault();pause();paint(at-1)}else if(e.code==='ArrowRight'){e.preventDefault();pause();paint(at+1)}});
async function getImage(path){return new Promise((resolve)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{
 // A clearly disclosed GitHub-only painting proxy if original binary is absent.
 // The downloadable handoff contains exact PNG originals and all matte layers.
 if(/^assets\/frames\/SH\d{2}-v01\.png$/.test(path)){
   const proxy=new Image();proxy.onload=()=>resolve(proxy);proxy.onerror=()=>resolve(null);
   proxy.src='./'+path.replace(/-v01\.png$/,'-proxy.jpg');
 }else resolve(null);
};img.src='./'+path})}
const response=await fetch('./production/layers-manifest.json');manifest=await response.json();
const paths=resourcePaths(manifest);const pairs=await Promise.all(paths.map(async p=>[p,await getImage(p)]));imgs=Object.fromEntries(pairs);
paint(0);
window.peekaboo={renderAtFrame:(f,o={})=>renderFrame(ctx,f,imgs,manifest,o),seek:(f)=>{pause();paint(f)},locate,paths};
