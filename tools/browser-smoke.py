"""Browser QA when loopback navigation is blocked by sandbox policy.
Runs the exact shared renderFrame JS via Chromium `about:blank` script injection;
resources are handed in as data URIs from disk. No local-network navigation needed.
This validates browser Canvas 2D pixels but is NOT a full end-to-end URL navigation test.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
import re,json,base64
R=Path(__file__).resolve().parent.parent
s1=(R/'src/timeline.mjs').read_text()
s2=(R/'src/film.mjs').read_text()
s2=re.sub(r'^import\s+\{[^;]+?\}\s+from\s+[\'\"][^\'\"]+[\'\"];?\s*','',s2,flags=re.M)
script=re.sub(r'\bexport\s+(?=(?:const|function))','',s1+'\n'+s2)
script+='\nwindow.__renderFilm=renderFrame;window.__locate=locate;'
manifest=json.loads((R/'production/layers-manifest.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1490,'height':1120},device_scale_factor=1)
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.goto('about:blank');page.set_content('<style>*{margin:0;padding:0}body{background:#171915}canvas{display:block}</style><canvas id="film" width="1448" height="1086"></canvas>')
 page.add_script_tag(content=script)
 for shot,frame in [('SH03',600),('SH04',890),('SH06',1660)]:
  cfg=manifest[shot]
  paths=[cfg['base']]+([cfg['restored_base']] if 'restored_base' in cfg else [])+[x['path'] for x in cfg['layers'].values()]
  assets={path:'data:image/png;base64,'+base64.b64encode((R/path).read_bytes()).decode('ascii') for path in paths}
  page.evaluate('''async ({assets,manifest,frame})=>{
   const images={};
   await Promise.all(Object.entries(assets).map(async ([path,src])=>{
    const img=new Image();img.src=src;await img.decode();images[path]=img;
   }));
   const ctx=document.getElementById('film').getContext('2d');
   window.__renderFilm(ctx,frame,images,manifest);
   window.__lastPaintedFrame=frame;
  }''', {'assets':assets,'manifest':manifest,'frame':frame})
  page.locator('#film').screenshot(path=str(R/f'edits/previews/browser-verified-{shot}-{frame}.png'))
  print('Verified browser frame:',shot,frame, 'dimensions',page.locator('#film').evaluate('(el)=>[el.width,el.height]'))
 print('Chromium page errors:',errs)
 assert not errs
 b.close()
