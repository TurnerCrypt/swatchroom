export const fingers=['thumb','index','middle','ring','pinky'] as const;
export const nailShapes=[
 {id:'natural',label:'Keep my shape',api:null,description:'Keep the shape in your photo.'},
 {id:'square',label:'Square',api:'square_oval',description:'Straight sides and a flat tip.'},
 {id:'squoval',label:'Squoval',api:'squoval_oval',description:'A square tip with softened corners.'},
 {id:'oval',label:'Oval',api:'oval_oval',description:'A rounded, elongated tip.'},
 {id:'almond',label:'Almond',api:'almond_oval',description:'Tapered sides and a softly pointed tip.'},
 {id:'stiletto',label:'Stiletto',api:'stiletto_oval',description:'A tapered, sharply pointed tip.'},
 {id:'coffin',label:'Coffin / ballerina',api:null,description:'Tapered sides and a flat tip. Salon brief only; preview keeps your photographed shape.'},
 {id:'round',label:'Round',api:null,description:'A short, rounded tip. Salon brief only; preview keeps your photographed shape.'}
] as const;
export const materials=['Not decided','Regular polish','Gel polish','Acrylic','Builder / hard gel','Soft-gel extensions','Polygel / acrygel','Dip powder','Press-ons'] as const;
export type NailStyle={color:string;design:string|null;texture:'cream'|'matte'|'metallic'};
export type CustomSet={fingers:NailStyle[];shape:string;length:number;material:string};
export const initialCustom:CustomSet={fingers:fingers.map(()=>({color:'#B783A2',design:null,texture:'cream'})),shape:'natural',length:1.2,material:'Not decided'};
export function validateCustom(value:unknown,designIds:readonly string[]):CustomSet{
 const v=value as CustomSet;
 if(!v||!Array.isArray(v.fingers)||v.fingers.length!==5||!nailShapes.some(s=>s.id===v.shape)||!materials.includes(v.material as any)||!Number.isFinite(v.length)||v.length<.8||v.length>2.15)throw new Error('Please choose a valid shape, length and salon preference.');
 for(const nail of v.fingers){if(!nail||!/^#[0-9a-f]{6}$/i.test(nail.color)||!['cream','matte','metallic'].includes(nail.texture)||(nail.design!==null&&(!designIds.includes(nail.design)||nail.texture==='metallic')))throw new Error('Please choose a valid colour, design and finish for each finger.');}
 return v;
}
export function customBrief(set:CustomSet){return ['SWATCHROOM — MY NAIL SET',`Shape: ${nailShapes.find(s=>s.id===set.shape)?.label}`,`Extension length scale: ${set.length.toFixed(2)} (visual proportion, not millimetres)`,`Salon preference: ${set.material}`,'',...set.fingers.map((s,i)=>`${fingers[i]}: ${s.design||s.color}, ${s.texture}`),'','Shape and length controls apply to custom-colour nails; patterned nails use the reference outline. Material is a salon preference, not a simulated material. Round/coffin selections keep the photographed shape in AI previews.'].join('\n');}
