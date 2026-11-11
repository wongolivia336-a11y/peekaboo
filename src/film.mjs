/**
 * Deterministic painterly 2D compositing, shared by browser playback and CLI.
 * Composed from original PNG pixels + separately named manual masks.
 * Camera is locked: movement belongs to characters and foliage, not the whole JPEG.
 * No animation state carries across frames; renderFrame(frame) supports seeking.
 */
import {FPS,WIDTH,HEIGHT,locate,smooth,wind,clamp} from './timeline.mjs';

export function resourcePaths(manifest){
 const set=new Set();
 for (const shot of Object.values(manifest)){
  set.add(shot.base);
  if(shot.restored_base) set.add(shot.restored_base);
  for(const item of Object.values(shot.layers))set.add(item.path);
 }
 return [...set];
}

function layer(ctx,img,info,x=0,y=0,angle=0,opacity=1,pivot=null){
 if(!img || !info)return;
 ctx.save();ctx.globalAlpha=opacity;
 if(pivot){ctx.translate(pivot[0],pivot[1]);ctx.rotate(angle);ctx.drawImage(img,info.x+x-pivot[0],info.y+y-pivot[1]);}
 else ctx.drawImage(img,info.x+x,info.y+y);
 ctx.restore();
}
function sceneLeaves(ctx,images,config,sid,t,amplitude=1){
 let count=0;
 for(const [name,info] of Object.entries(config.layers)){
  if(!name.includes('leaf_'))continue;
  const k=count++;
  const amp=amplitude*(k===0?1:.73);
  const dx=amp*(2.4*wind(t+.3,k*1.9));
  const dy=amp*(1.3*wind(t-.7,k*2.3));
  layer(ctx,images[info.path],info,dx,dy,0,.66);
 }
}
function wrapper(ctx,t){
 // A pale fleck sinks only after the happy pause; it is not a horror particle.
 const u=clamp((t-5.5)/5.4);
 if(u===0 || u>=1)return;
 const x=800+13*Math.sin(u*5.1)+18*u, y=337+u*192;
 ctx.save();ctx.globalAlpha=Math.sin(Math.PI*u)*.75;
 ctx.translate(x,y);ctx.rotate(.42*Math.sin(u*12));
 ctx.fillStyle='#E4D3B8';ctx.strokeStyle='#9D8B70';ctx.lineWidth=.7;
 ctx.beginPath();ctx.moveTo(-3,-2);ctx.lineTo(1,-4);ctx.lineTo(4,2);ctx.lineTo(-1,3);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.restore();
}
function shadowMisregistration(ctx,t){
 const u=smooth(3,10,t)*(1-smooth(13,16,t));
 if(u<=0)return;
 ctx.save();ctx.globalAlpha=.045*u;ctx.fillStyle='#615B52';
 ctx.beginPath();ctx.ellipse(233+3*u,205,71,144,-.21,0,Math.PI*2);ctx.fill();ctx.restore();
}
function actor(ctx,imgs,config,sid,name,x=0,y=0,angle=0,opacity=1,pivot=null){
 const id=`${sid}_${name}`;const info=config.layers[id];
 layer(ctx,imgs[info?.path],info,x,y,angle,opacity,pivot);
}
/**
 * @param {CanvasRenderingContext2D} ctx Context at fixed 1448x1086 art coordinates.
 * @param {number} frame integer in [0,2159]
 * @param {Record<string,HTMLImageElement>} imgs decoded images by manifest path
 * @param {object} manifest production/layers-manifest.json
 * @param {object} opts original:true for source A/B; layers:false disables foreground motion
 */
export function renderFrame(ctx,frame,imgs,manifest,opts={}){
 const s=locate(frame),cfg=manifest[s.id],t=s.time;
 ctx.save();ctx.clearRect(0,0,WIDTH,HEIGHT);
 ctx.fillStyle='#E8DDBC';ctx.fillRect(0,0,WIDTH,HEIGHT);
 const base=imgs[opts.original?cfg.base:(cfg.restored_base||cfg.base)];
 if(!base){ctx.restore();return s}
 ctx.drawImage(base,0,0,WIDTH,HEIGHT);
 if(opts.original){ctx.restore();return s}
 const motion=opts.motion===false?0:clamp((opts.motionGain??1),0,2);
 const ls=opts.layers!==false;
 const staged=opts.actors!==false;
 if(staged){
  if(s.id==='SH01'){
   // Three tiny children run at different speeds; position is sampled from the clock.
   const start=smooth(.2,2.1,t);const exit=smooth(6.0,9.8,t);
   const energy=start*(1-exit);
   for(let k=0;k<3;k++){
    const name=['runner_a','runner_b','runner_c','runner_d'][k];
    actor(ctx,imgs,cfg,s.id,name,motion*energy*(26+(k%2)*11),
      motion*energy*1.5*Math.sin(t*7.4+k),0,1);
   }
  }
  if(s.id==='SH02'){
   const dash=smooth(.3,5.9,t)*(1-smooth(8.5,10,t));
   actor(ctx,imgs,cfg,s.id,'runner_girl',-25*motion*dash,2.5*motion*Math.sin(t*7)*dash,0,1);
   actor(ctx,imgs,cfg,s.id,'runner_back',19*motion*dash,-4*motion*dash,0,1);
   // Protagonist's hand/foot contact remains original: a second drawing is
   // required before it can convincingly climb higher, not simulated by a slide.
  }
  if(s.id==='SH04'){
   // The lower boy stops, then very slowly raises his head. Body / feet locked.
   const raise=smooth(3.3,8.4,t);
   const angle=motion*(-.078+.078*raise);
   actor(ctx,imgs,cfg,s.id,'looking_head',0,-2*motion*raise,angle,1,[888,478]);
  }
  if(s.id==='SH05'){
   const desire=smooth(3.8,8.9,t)*(1-smooth(13.8,16,t));
   actor(ctx,imgs,cfg,s.id,'hand',2.8*desire*motion,-1.3*desire*motion,0,.80);
   if(opts.shadow!==false)shadowMisregistration(ctx,t);
  }
 }
 if(ls){
  let strength=1;
  if(s.id==='SH01')strength=.62;
  if(s.id==='SH02')strength=.52;
  if(s.id==='SH03')strength=(.60+.40*smooth(1.8,4,t))*(1-.65*smooth(9.3,12,t));
  if(s.id==='SH04')strength=.36*(1-.5*smooth(6,14,t));
  if(s.id==='SH05')strength=.28;
  if(s.id==='SH06')strength=2.2*smooth(.7,12,t);
  if(s.id==='SH07')strength=.30*(1-smooth(5,11.5,t));
  if(strength>0)sceneLeaves(ctx,imgs,cfg,s.id,t,strength*motion);
 }
 if(s.id==='SH03' && opts.effects!==false && motion)wrapper(ctx,t);
 // Film ends on an unadorned cut, with no artificial sunset or dissolve.
 if(s.id==='SH07' && s.localFrame>=310){ctx.fillStyle='#23251F';ctx.fillRect(0,0,WIDTH,HEIGHT)}
 ctx.restore();return s;
}
