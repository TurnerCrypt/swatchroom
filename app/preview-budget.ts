import {env} from 'cloudflare:workers';
export class PreviewLimit extends Error{status:number;constructor(message:string,status:number){super(message);this.status=status;}}
// Reservations are deliberately retained even after a provider error: retries cannot evade the cap.
export async function reservePreview(req:Request){
 const local=['127.0.0.1','localhost','[::1]'].includes(new URL(req.url).hostname);
 const db=(env as any).DB as D1Database|undefined;
 if(local)return; // Existing local workflow; the hosted endpoint always requires durable storage.
 if(!db)throw new PreviewLimit('Live previews are paused while demo limits are configured.',503);
 const identity=(env as any).SWATCHROOM_DIRECT==='true'?req.headers.get('cf-connecting-ip'):(req.headers.get('oai-authenticated-user-id')||req.headers.get('cf-connecting-ip'));
 if(!identity)throw new PreviewLimit('Could not identify this preview session. Please reopen the demo.',403);
 const secret=(env as any).YOUCAM_API_KEY||process.env.YOUCAM_API_KEY;
 const signing=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signature=await crypto.subtle.sign('HMAC',signing,new TextEncoder().encode(identity));
 const client=Array.from(new Uint8Array(signature),b=>b.toString(16).padStart(2,'0')).join('');
 const now=Date.now(),day=now-now%86400000;
 const row=await db.prepare(`INSERT INTO preview_requests (id,client,created_at)
 SELECT ?,?,? WHERE (SELECT COUNT(*) FROM preview_requests)<200
 AND (SELECT COUNT(*) FROM preview_requests WHERE created_at>=?)<50
 AND (SELECT COUNT(*) FROM preview_requests WHERE client=? AND created_at>=?)<10
 AND NOT EXISTS(SELECT 1 FROM preview_requests WHERE client=? AND created_at>?)
 RETURNING id`).bind(crypto.randomUUID(),client,now,day,client,day,client,now-60000).first();
 if(!row)throw new PreviewLimit('Demo preview limit reached. Wait at least one minute between previews; each visitor has ten per UTC day. Saved looks remain available.',429);
}
