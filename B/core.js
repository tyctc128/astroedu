(function(root){
'use strict';
const D=Math.PI/180;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const wrap=v=>((v%360)+360)%360;
function equatorial(ra,dec){const r=ra*D,d=dec*D;return [Math.cos(d)*Math.cos(r),Math.cos(d)*Math.sin(r),Math.sin(d)];}
function horizontal(ra,dec,date,lat,lon){
 const jd=date/86400000+2440587.5,t=(jd-2451545)/36525;
 const lst=wrap(280.46061837+360.98564736629*(jd-2451545)+.000387933*t*t-t*t*t/38710000+lon);
 const h=(lst-ra)*D,d=dec*D,l=lat*D;
 const east=-Math.cos(d)*Math.sin(h),up=Math.sin(d)*Math.sin(l)+Math.cos(d)*Math.cos(h)*Math.cos(l),north=Math.sin(d)*Math.cos(l)-Math.cos(d)*Math.cos(h)*Math.sin(l);
 return {az:wrap(Math.atan2(east,north)/D),alt:Math.asin(clamp(up,-1,1))/D,vec:[east,up,north]};
}
function cameraBasis(az,alt){let a=az*D,b=alt*D;return {f:[Math.cos(b)*Math.sin(a),Math.sin(b),Math.cos(b)*Math.cos(a)],r:[Math.cos(a),0,-Math.sin(a)],u:[-Math.sin(b)*Math.sin(a),Math.cos(b),-Math.sin(b)*Math.cos(a)]};}
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function project(v,cam,w,h){const b=cameraBasis(cam.az,cam.alt),z=dot(v,b.f),r=(cam.roll||0)*D,x=dot(v,b.r)*Math.cos(r)-dot(v,b.u)*Math.sin(r),y=dot(v,b.r)*Math.sin(r)+dot(v,b.u)*Math.cos(r);if(cam.perspective){if(z<=.01)return null;const s=w/(2*Math.tan(cam.fov*D/2));return {x:w/2+x*s/z,y:h/2-y*s/z,z};}if(z<-.4)return null;const k=2/(1+z),s=w/(4*Math.tan(cam.fov*D/4));return {x:w/2+k*x*s,y:h/2-k*y*s,z};}
function altAzVector(az,alt){return cameraBasis(az,alt).f;}
function validScene(input){
 if(!input||input.v!==1)throw Error('無法讀取這個版本的情境');
 const t=Date.parse(input.time);if(!Number.isFinite(t)||t<Date.UTC(2000,0,1)||t>Date.UTC(2050,11,31,23,59))throw Error('日期需介於 2000 至 2050 年');
 const p=input.place;if(!p||typeof p.name!=='string'||p.name.length>60||![p.lat,p.lon].every(Number.isFinite)||Math.abs(p.lat)>90||Math.abs(p.lon)>180)throw Error('觀測位置格式不正確');
 const c=input.camera;if(!c||![c.az,c.alt,c.fov].every(Number.isFinite)||c.alt < -89||c.alt>89||c.fov<15||c.fov>150)throw Error('星圖視角格式不正確');
 const layers={};for(const k of ['lines','labels','grid','ecliptic','ground','milky','trails','night','dso','bounds','art','equatorial','daylight','landscape'])layers[k]=!!input.layers?.[k];
 const lesson=['triangle','motion','seasons','moon'].includes(input.lesson)?input.lesson:'triangle';
 const selected=typeof input.selected==='string'&&/^[A-Za-z0-9]{1,30}$/.test(input.selected)?input.selected:'91262';
 return {v:1,time:new Date(t).toISOString(),place:{name:p.name,lat:p.lat,lon:p.lon},camera:{az:wrap(c.az),alt:c.alt,fov:c.fov},layers,lesson,selected};
}
function encodeScene(s){return encodeURIComponent(JSON.stringify(validScene(s)));}
function decodeScene(s){if(s.length>12000)throw Error('情境連結過長');return validScene(JSON.parse(decodeURIComponent(s)));}
function shiftMonth(time,amount){const d=new Date(time),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+amount);const end=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,end));return d.getTime();}
function phaseName(angle){if(angle<10||angle>350)return '新月';if(angle<80)return '眉月';if(angle<100)return '上弦月';if(angle<170)return '盈凸月';if(angle<190)return '滿月';if(angle<260)return '虧凸月';if(angle<280)return '下弦月';return '殘月';}
function directionName(az){return ["北 N","東北 NE","東 E","東南 SE","南 S","西南 SW","西 W","西北 NW"][Math.round(wrap(az)/45)%8];}
function guideTarget(target,cam){if(target.alt<0)return {kind:"below"};const v=altAzVector(target.az,target.alt),b=cameraBasis(cam.az,cam.alt),z=dot(v,b.f),r=(cam.roll||0)*D,x=dot(v,b.r)*Math.cos(r)-dot(v,b.u)*Math.sin(r),y=dot(v,b.r)*Math.sin(r)+dot(v,b.u)*Math.cos(r);const distance=Math.acos(clamp(z,-1,1))/D;return {kind:distance<5?"found":"turn",angle:Math.abs(x)+Math.abs(y)<1e-8?90:Math.atan2(x,y)/D,distance};}
const api={directionName,guideTarget,D,clamp,wrap,equatorial,horizontal,project,cameraBasis,altAzVector,validScene,encodeScene,decodeScene,shiftMonth,phaseName};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SkyCore=api;
})(globalThis);
