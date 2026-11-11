"""Loss-aware manual masks for the seven uploaded original painted keyframes.
Non-generative: source pixels copied into layers; only small actor footprint inpainting.
Source PNGs are never modified; polygons are hand registered to 1448x1086 artboard.
"""
from pathlib import Path
import json
import cv2
import numpy as np

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'assets'/'layers'
OUT.mkdir(parents=True,exist_ok=True)
REGISTRY={}

# Edge-safe translucent paper overlay: background remains original for wind patches.
LEAF_GROUPS={
 'SH01':[
  ('leaf_a',[(325,10),(640,2),(720,115),(590,210),(382,185)],12),
  ('leaf_b',[(720,45),(935,25),(1070,180),(973,315),(762,287)],12)],
 'SH02':[
  ('leaf_a',[(320,0),(667,8),(685,165),(525,240),(353,189)],12),
  ('leaf_b',[(1035,30),(1376,10),(1447,254),(1335,398),(1079,329)],12)],
 'SH03':[
  ('leaf_a',[(125,20),(370,10),(478,155),(352,288),(170,300)],14),
  ('leaf_b',[(590,10),(842,9),(915,220),(751,299),(554,231)],14),
  ('leaf_c',[(1190,185),(1447,204),(1447,430),(1242,502),(1178,362)],13)],
 'SH04':[
  ('leaf_a',[(50,5),(401,0),(510,255),(316,401),(60,322)],14),
  ('leaf_b',[(1071,5),(1447,0),(1447,289),(1243,382),(1099,223)],14)],
 'SH05':[
  ('leaf_a',[(657,3),(965,0),(1074,177),(847,270),(663,176)],13),
  ('leaf_b',[(1232,442),(1447,383),(1447,756),(1202,779),(1115,594)],13)],
 'SH06':[
  ('leaf_a',[(0,0),(420,0),(522,270),(423,463),(0,410)],17),
  ('leaf_b',[(32,275),(538,309),(635,735),(298,782),(0,612)],20)],
 'SH07':[
  ('leaf_a',[(442,8),(755,0),(858,130),(679,270),(460,185)],13)],
}

def store_crop(name,base,mask,details,clean=False):
    # bbox padded 8px so displacement doesn't clip
    y,x=np.where(mask>0)
    x0=max(0,int(x.min())-8); x1=min(base.shape[1],int(x.max())+9)
    y0=max(0,int(y.min())-8); y1=min(base.shape[0],int(y.max())+9)
    rgba=np.dstack((base[y0:y1,x0:x1],mask[y0:y1,x0:x1]))
    cv2.imwrite(str(OUT/(name+'.png')),rgba)
    details[name]={'path':f'assets/layers/{name}.png','x':x0,'y':y0,'width':x1-x0,'height':y1-y0}
    return (x0,y0,x1,y1)

for index in range(1,8):
 sid=f'SH{index:02d}'
 image=cv2.imread(str(ROOT/f'assets/frames/{sid}-v01.png'),cv2.IMREAD_COLOR)
 if image is None: raise RuntimeError(sid)
 H,W=image.shape[:2]
 meta={'base':f'assets/frames/{sid}-v01.png','layers':{},'fidelity':'original painting as immutable base; localized manual overlays'}
 for name,pts,blur in LEAF_GROUPS[sid]:
  mask=np.zeros((H,W),np.uint8)
  cv2.fillPoly(mask,[np.array(pts,np.int32)],255)
  mask=cv2.GaussianBlur(mask,(0,0),blur)
  store_crop(f'{sid}_{name}',image,mask,meta['layers'])
 # Only small area removals. All altered pixels get explicit provenance below.
 actors=[]
 if sid=='SH01':
  actors=[('runner_a',(1008,750,1032,801)),('runner_b',(1040,748,1068,800)),('runner_c',(1071,750,1099,800)),('runner_d',(1102,754,1145,805))]
 if sid=='SH02':
  actors=[('runner_girl',(406,652,534,860)),('runner_back',(803,655,866,803))]
 if sid=='SH04':
  actors=[('looking_head',(821,357,960,487))]
 if sid=='SH05':
  actors=[('hand',(339,919,492,1054))]
 # Actor cutouts are elliptical feather masks; avoid claims of clean roto.
 if actors:
  cleaned=image.copy()
  for an,(l,t,r,b) in actors:
   # Some regions are drawn with ellipse, to avoid rigid rectangular region.
   center=((l+r)//2,(t+b)//2)
   axes=((r-l)//2-3,(b-t)//2-3)
   matte=np.zeros((H,W),np.uint8)
   cv2.ellipse(matte,center,axes,0,0,360,255,-1)
   if an=='looking_head':
    # isolate ONLY head; avoid broad inpaint over body
    cv2.ellipse(matte,(889,424),(53,58),0,0,360,255,-1)
   if an=='hand':
    cv2.ellipse(matte,(414,988),(58,51),0,0,360,255,-1)
   sharp=matte.copy()
   matte=cv2.GaussianBlur(matte,(0,0),2.3)
   store_crop(f'{sid}_{an}',image,matte,meta['layers'])
   if an not in ('hand',):
    # Do not pretend the inferred material under removed characters is original.
    small=cv2.dilate(sharp,np.ones((5,5),np.uint8),iterations=1)
    cleaned=cv2.inpaint(cleaned,small,5,cv2.INPAINT_TELEA)
  if sid in ('SH01','SH02','SH04'):
   cv2.imwrite(str(OUT/f'{sid}_restored_bg.png'),cleaned)
   meta['restored_base']=f'assets/layers/{sid}_restored_bg.png'
   meta['restoration']='OpenCV Telea inpaint under isolated actor mattes; hand repair needed for final'
 REGISTRY[sid]=meta

(ROOT/'production'/'layers-manifest.json').write_text(json.dumps(REGISTRY,indent=2,ensure_ascii=False))
print('Prepared',len(REGISTRY),'shots, layers:',sum(len(m['layers']) for m in REGISTRY.values()))
