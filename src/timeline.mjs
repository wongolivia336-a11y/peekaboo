/** PEEKABOO / NOT FOUND YET — pure 24fps, 2160-frame score. No random clock. */
export const FPS=24;
export const WIDTH=1448;
export const HEIGHT=1086;
export const SHOTS=[
 {id:'SH01',name:'Afternoon',start:0,length:240,status:'coded-draft'},
 {id:'SH02',name:'Hide and seek',start:240,length:240,status:'partial-animation'},
 {id:'SH03',name:'Private happiness',start:480,length:288,status:'coded-proof'},
 {id:'SH04',name:'The look',start:768,length:336,status:'coded-draft'},
 {id:'SH05',name:'Looking through',start:1104,length:384,status:'partial-animation'},
 {id:'SH06',name:'Outside myself',start:1488,length:360,status:'coded-draft'},
 {id:'SH07',name:'Nobody returns',start:1848,length:312,status:'coded-draft'},
];
export const TOTAL_FRAMES=2160;
export const clamp=(x,min=0,max=1)=>Math.max(min,Math.min(max,x));
export const smooth=(a,b,t)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x)};
export function locate(frame){
 const f=clamp(Math.floor(frame),0,TOTAL_FRAMES-1);
 const shot=SHOTS.find(s=>f>=s.start && f<s.start+s.length) || SHOTS.at(-1);
 return {...shot,globalFrame:f,localFrame:f-shot.start,time:(f-shot.start)/FPS,progress:(f-shot.start)/shot.length};
}
// Irregular but deterministic, anchored in physical time (no Math.random()).
export function wind(t,phase=0){return .67*Math.sin(.71*t+phase)+.22*Math.sin(1.47*t+2*phase)+.11*Math.sin(.31*t-phase)};
