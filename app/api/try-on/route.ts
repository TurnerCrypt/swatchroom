import { env } from 'cloudflare:workers';
import { shades, designs, samplePhoto } from '../../catalog';
import { designAssets, pressOnAssets } from '../../design-assets';
import { fingers, nailShapes, validateCustom, CustomSet } from '../../custom-set';

// The Site remains owner-private. Never expose this funded proxy publicly
// without adding durable per-user budgets and abuse protection.
const HOST='https://yce-api-01.makeupar.com';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
function key(){return (env as Record<string,string>).YOUCAM_API_KEY||process.env.YOUCAM_API_KEY;}
async function api(path:string,method='GET',body?:unknown){
 const r=await fetch(HOST+path,{method,headers:{Authorization:`Bearer ${key()}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(25000)});
 const d=await r.json() as any;
 if(!r.ok||d.status&&d.status!==200){const detail=JSON.stringify(d).toLowerCase();if(detail.includes('credit')||detail.includes('balance'))throw new Error('Not enough YouCam units. Please ask the studio owner to check the balance.');if(r.status===401||r.status===403)throw new Error('YouCam could not authorize this request. Please check the server key.');throw new Error('YouCam could not process this request. Please try again shortly.');}return d.data;
}
async function signingKey(){return crypto.subtle.importKey('raw',new TextEncoder().encode(key()),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function token(task:string){const payload=btoa(JSON.stringify({task,exp:Date.now()+10*60*1000}));const sig=await crypto.subtle.sign('HMAC',await signingKey(),new TextEncoder().encode(payload));return payload+'.'+btoa(String.fromCharCode(...new Uint8Array(sig)));}
async function decode(t:string){const [payload,signature]=t.split('.');if(!payload||!signature)throw new Error('Invalid preview reference.');const valid=await crypto.subtle.verify('HMAC',await signingKey(),Uint8Array.from(atob(signature),c=>c.charCodeAt(0)),new TextEncoder().encode(payload));if(!valid)throw new Error('Invalid preview reference.');const d=JSON.parse(atob(payload));if(d.exp<Date.now()||typeof d.task!=='string')throw new Error('Preview expired. Please create a new preview.');return d.task;}
function resultUrl(value:any):string|undefined{if(typeof value==='string'&&value.startsWith('https://'))return value;if(Array.isArray(value))for(const v of value){const r=resultUrl(v);if(r)return r;}if(value&&typeof value==='object')for(const [k,v]of Object.entries(value)){if(['url','urls','result_url','output_url','results','data'].includes(k)){const r=resultUrl(v);if(r)return r;}}}
export async function GET(req:Request){if(!key())return json({configured:false});const t=new URL(req.url).searchParams.get('task');if(!t)return json({configured:true});try{const id=await decode(t);const data=await api('/s2s/v2.0/task/nail-vto/'+encodeURIComponent(id));if(data.task_status==='error'||data.error){const e=JSON.stringify(data.error);throw new Error(e.includes('nail')?'We could not see your nails clearly. Try one hand with bare, unobstructed nails in natural light.':'This preview could not be completed. Please try a clearer hand photo.');}return json({status:data.task_status,image:data.task_status==='success'?resultUrl(data.results):undefined});}catch(e){return json({error:e instanceof Error?e.message:'Could not check this preview.'},400);}}
export async function POST(req:Request){
 if(!key())return json({error:'Live previews are not connected yet. Please ask the studio owner to configure the YouCam server key.'},503);
 if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Please start your preview from the studio.'},403);
 if(Number(req.headers.get('content-length')||0)>11*1024*1024)return json({error:'Please use an image smaller than 10 MB.'},413);
 try{const form=await req.formData();const mode=form.get('mode')||'colour';if(!['design','colour','custom'].includes(String(mode)))return json({error:'Please choose a valid nail collection.'},400);const design=designs.find(d=>d.id===form.get('design'));const index=Number(form.get('shade'));const finish=form.get('finish');if(mode!=='custom'&&(mode==='design'?!design:!form.has('shade')||!Number.isInteger(index)||!shades[index]||!['cream','matte'].includes(String(finish))))return json({error:mode==='design'?'Please choose a design from the library.':'Please choose a valid shade and finish.'},400);
 let custom:CustomSet|undefined;if(mode==='custom'){try{custom=validateCustom(JSON.parse(String(form.get('custom'))),designs.map(d=>d.id));}catch{return json({error:'Please choose valid styles, shape and length for your custom set.'},400);}}
 let source:Record<string,string>={src_file_url:samplePhoto};const photo=form.get('photo');
 if(photo instanceof File){if(form.get('consent')!=='true')return json({error:'Please allow YouCam to process your photo first.'},400);if(!['image/jpeg','image/png'].includes(photo.type)||photo.size===0||photo.size>10*1024*1024)return json({error:'Choose a JPG or PNG smaller than 10 MB.'},400);
 const bytes=await photo.arrayBuffer();const sig=new Uint8Array(bytes);if(!(photo.type==='image/jpeg'?sig[0]===255&&sig[1]===216:sig[0]===137&&sig[1]===80&&sig[2]===78&&sig[3]===71))return json({error:'This file is not a valid JPG or PNG.'},400);
 const prep=await api('/s2s/v2.0/file','POST',{files:[{file_name:photo.type==='image/png'?'hand.png':'hand.jpg',content_type:photo.type,file_size:photo.size}]});const f=prep.files?.[0];if(!f?.file_id||!f?.requests?.[0])throw new Error('Could not prepare your image upload.');
 const upload=f.requests[0];const u=new URL(upload.url);if(u.protocol!=='https:'||!u.hostname.endsWith('.amazonaws.com'))throw new Error('Unexpected image upload destination.');const response=await fetch(u,{method:'PUT',headers:upload.headers,body:bytes,signal:AbortSignal.timeout(25000)});if(!response.ok)throw new Error('Your photo could not be uploaded. Please try again.');source={src_file_id:f.file_id};}
 const shape=custom?nailShapes.find(s=>s.id===custom.shape):undefined;
 const extensions=!!shape?.api;
 const referenceIds:string[]=[];
 const referenceDesigns=mode==='design'&&design?[design.id]:custom?[...new Set(custom.fingers.map((n,i)=>n.design?(extensions&&i===0?n.design+'-thumb':n.design):null).filter((id):id is string=>!!id))]:[];
 for(const designId of referenceDesigns){const assetPath=(extensions?pressOnAssets:designAssets)[designId];if(!assetPath)throw new Error('This design reference is unavailable.');const assetUrl=new URL(assetPath,req.url);const assets=(env as any).ASSETS;const local=['127.0.0.1','localhost','[::1]'].includes(assetUrl.hostname);if(!assets&&!local)throw new Error('Design asset binding is unavailable.');const reference=assets?await assets.fetch(new Request(assetUrl)):await fetch(assetUrl,{signal:AbortSignal.timeout(10000)});if(!reference.ok)throw new Error('Could not load the design reference.');const bytes=new Uint8Array(await reference.arrayBuffer());if(bytes.byteLength>1024*1024||bytes[0]!==137||bytes[1]!==80)throw new Error('Invalid design reference.');const prep=await api('/s2s/v2.0/file','POST',{files:[{file_name:designId+'.png',content_type:'image/png',file_size:bytes.byteLength}]});const f=prep.files?.[0];if(!f?.file_id||!f?.requests?.[0])throw new Error('Could not prepare the design reference.');const upload=f.requests[0];const u=new URL(upload.url);if(u.protocol!=='https:'||!u.hostname.endsWith('.amazonaws.com'))throw new Error('Unexpected design upload destination.');const r=await fetch(u,{method:'PUT',headers:upload.headers,body:bytes,signal:AbortSignal.timeout(25000)});if(!r.ok)throw new Error('The design reference could not be uploaded.');referenceIds.push(f.file_id);}
 const effects=fingers.map((finger,i)=>{
 const nail=custom?.fingers[i];const designId=nail?.design||(mode==='design'?design?.id:null);const texture=nail?.texture||(mode==='design'?'cream':String(finish));
 const effect:Record<string,unknown>={sub_type:designId?'design':'color',finger,texture,reflection:texture==='matte'?10:designId?35:100,contrast:50,roughness:texture==='matte'?80:designId?20:0};
 if(designId)effect.ref_file_index=referenceDesigns.indexOf(extensions&&finger==='thumb'?designId+'-thumb':designId);else{effect.color=nail?.color||shades[index].hex;if(extensions){effect.shape=shape!.api;effect.length=finger==='thumb'?Math.max(.8,Math.round((custom!.length*.85+Number.EPSILON)*100)/100):custom!.length;}}
 if(!extensions)effect.transparency=0;
 return effect;
 });
 const data=await api('/s2s/v2.0/task/nail-vto','POST',{version:'1.0',...source,effect_type:extensions?'press_on_nails':'nail_polish',ref_file_ids:referenceIds,effects});
 if(!data.task_id)throw new Error('YouCam did not return a preview reference.');return json({token:await token(data.task_id)});
 }catch(e){return json({error:e instanceof Error?e.message:'Could not start the preview.'},502);}
}
