/**
 * Deterministic video exporter. Uses skia-canvas to execute the SAME film.mjs
 * renderAtFrame() as the browser. Pipes raw RGBA to local ffmpeg, audio omitted.
 * npm install (or NODE_PATH=$(npm root -g) for system-provided dependencies).
 * node tools/export-video.cjs --width=720 --frames=48 --out=edits/renders/smoke.mp4
 */
const {spawn}=require('node:child_process');
const fs=require('node:fs');const path=require('node:path');
const {once}=require('node:events');
const {Canvas,loadImage}=require('skia-canvas');
const root=path.resolve(__dirname,'..');process.chdir(root);
const getArg=(key,def)=>{const m=process.argv.find(v=>v.startsWith('--'+key+'='));return m?m.split('=').slice(1).join('='):def};
const width=Number(getArg('width','1448'));
const height=Math.round(width*3/4);
const start=Number(getArg('start','0'));
const frames=Number(getArg('frames','2160'));
const out=getArg('out',`edits/renders/${width===1448?'PEEKABOO-90s-fullres-WORKPRINT':'PEEKABOO-90s-preview-WORKPRINT'}.mp4`);
(async()=>{
 const {renderFrame,resourcePaths}=await import('../src/film.mjs');
 const data=JSON.parse(fs.readFileSync('production/layers-manifest.json'));
 const images={};const paths=resourcePaths(data);
 console.log(`Decoding ${paths.length} original/painted/masked layer assets`);
 for (const p of paths)images[p]=await loadImage(path.resolve(root,p));
 const canvas=new Canvas(width,height);const ctx=canvas.getContext('2d',{alpha:false});ctx.scale(width/1448,height/1086);
 const fps=24;
 const encoder=spawn('ffmpeg',['-hide_banner','-loglevel','warning','-y',
  '-f','rawvideo','-pix_fmt','rgba','-video_size',`${width}x${height}`,'-framerate',String(fps),'-i','pipe:0',
  '-an','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',out],
  {stdio:['pipe','inherit','inherit']});
 let codePromise=new Promise((res,rej)=>{encoder.on('exit',code=>code===0?res():rej(new Error('ffmpeg exited '+code)));encoder.on('error',rej)});
 const t0=Date.now();fs.mkdirSync(path.dirname(out),{recursive:true});
 for(let i=0;i<frames;i++){
  const frame=start+i;renderFrame(ctx,frame,images,data);
  const rgba=ctx.getImageData(0,0,width,height).data;
  const bytes=Buffer.from(rgba.buffer,rgba.byteOffset,rgba.byteLength);
  if(!encoder.stdin.write(bytes))await once(encoder.stdin,'drain');
  if(i%240===0||i===frames-1)console.log(`frame ${i+1}/${frames} / shot ${frame} / ${((Date.now()-t0)/1000).toFixed(1)} s`);
 }
 encoder.stdin.end();await codePromise;
 console.log('EXPORTED',path.resolve(out),'size',fs.statSync(out).size,'duration',frames/fps);
})().catch(err=>{console.error(err.stack||err);process.exit(1)});
