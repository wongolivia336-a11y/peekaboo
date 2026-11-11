const fs=require('node:fs');const {Canvas,loadImage}=require('skia-canvas');
(async()=>{
 const {renderFrame,resourcePaths}=await import('../src/film.mjs');
 const manifest=JSON.parse(fs.readFileSync('production/layers-manifest.json')); const images={};
 for(const p of resourcePaths(manifest))images[p]=await loadImage(require('node:path').resolve(p));
 const canvas=new Canvas(1448,1086),ctx=canvas.getContext('2d');
 const frames=[0,120,239,240,360,479,480,600,767,768,890,1103,1104,1300,1487,1488,1660,1847,1848,2000,2159];
 fs.mkdirSync('edits/previews', {recursive:true});
 for(const f of frames){renderFrame(ctx,f,images,manifest);fs.writeFileSync(`edits/previews/frame-${String(f).padStart(4,'0')}.png`,await canvas.toBuffer('png'))}
 console.log('Wrote',frames.length,'screenshot checkpoints (rendered from identical shared code)');
})().catch(e=>{console.error(e);process.exit(1)});
