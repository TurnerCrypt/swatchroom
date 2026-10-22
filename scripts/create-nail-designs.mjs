import sharp from 'sharp';
import {extraDesigns} from './expanded-designs.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
const out=new URL('../public/designs/',import.meta.url);mkdirSync(out,{recursive:true});
// Original vector artwork, rasterized to YouCam's reference-image dimensions.
const defs=`<linearGradient id="base" x2=".8" y2="1"><stop stop-color="#f4d3cb"/><stop offset=".6" stop-color="#c18f87"/><stop offset="1" stop-color="#e8bdb3"/></linearGradient><linearGradient id="silver"><stop stop-color="#5f6270"/><stop offset=".24" stop-color="#fff"/><stop offset=".4" stop-color="#aaaaba"/><stop offset=".65" stop-color="#fff"/><stop offset="1" stop-color="#626271"/></linearGradient><radialGradient id="aura"><stop stop-color="#fff1a0"/><stop offset=".3" stop-color="#f4a1c9"/><stop offset=".65" stop-color="#bb83dc"/><stop offset="1" stop-color="#b89fc9"/></radialGradient><linearGradient id="cat" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#290d21"/><stop offset=".35" stop-color="#4a1838"/><stop offset=".49" stop-color="#f6adcb"/><stop offset=".55" stop-color="#ad587d"/><stop offset=".72" stop-color="#4d1733"/><stop offset="1" stop-color="#260b20"/></linearGradient><linearGradient id="jelly" x2=".6" y2="1"><stop stop-color="#ffc1d2"/><stop offset="1" stop-color="#d34c89"/></linearGradient><linearGradient id="amber" x2="1" y2="1"><stop stop-color="#f4b444"/><stop offset=".5" stop-color="#9c4819"/><stop offset="1" stop-color="#e4a244"/></linearGradient><clipPath id="nail"><path d="M200 12C80 12 20 140 20 305L28 745Q200 795 372 745L380 305C380 140 320 12 200 12Z"/></clipPath>`;
const art={
 'chrome-french':`<rect width="400" height="800" fill="url(#base)"/><path d="M0 0H400V205C310 105 115 115 0 230Z" fill="url(#silver)"/><path d="M0 230C125 108 309 107 400 205" fill="none" stroke="#f4eeed" stroke-width="5"/>`,
 'cherry-cat-eye':`<rect width="400" height="800" fill="url(#cat)"/>${[[85,210],[260,130],[305,360],[145,460],[285,620],[90,675]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="19" fill="#f7d4df" opacity=".92"/>`).join('')}`,
 'lilac-aura':`<rect width="400" height="800" fill="#b39ac7"/><ellipse cx="195" cy="370" rx="235" ry="380" fill="url(#aura)"/>`,
 'jelly-bows':`<rect width="400" height="800" fill="url(#jelly)"/><g stroke="#fff3f0" fill="none" stroke-width="10" stroke-linecap="round"><path d="M200 300C60 190 75 420 200 300C325 200 345 415 200 300M198 300Q168 440 115 500M202 300Q227 440 285 490"/></g><circle cx="200" cy="300" r="15" fill="#fdf2dc"/>`,
 'tortoise-glaze':`<rect width="400" height="800" fill="url(#amber)"/><g fill="#392013" opacity=".88"><path d="M0 60Q160 0 145 150T20 310L0 200Z"/><path d="M270 0Q170 180 330 225T400 75Z"/><path d="M390 340Q165 250 225 450T400 535Z"/><path d="M0 420Q210 360 130 540T0 670Z"/><path d="M195 800Q120 610 310 625T400 800Z"/></g><path d="M65 100Q200 200 100 330M290 350Q150 470 320 540" fill="none" stroke="#f6c15d" stroke-width="30" opacity=".3"/>`,
 'ribbon-french':`<rect width="400" height="800" fill="url(#base)"/><path d="M-30 70Q230 330 440 20M-30 175Q245 410 440 110" fill="none" stroke="#fff9f0" stroke-width="22"/><path d="M-30 190Q245 425 440 125" fill="none" stroke="#704159" stroke-width="7"/><path d="M-20 650Q200 410 430 660" fill="none" stroke="#fff9f0" stroke-width="17"/>`
};
Object.assign(art,{
 'jade-marble':`<rect width="400" height="800" fill="#aeb8a0"/><g fill="none" stroke-linecap="round"><path d="M-40 50Q350 210 130 360T310 820M250 -50Q50 130 300 330T170 850" stroke="#e5ead7" stroke-width="45" opacity=".7"/><path d="M-40 50Q350 210 130 360T310 820" stroke="#6d8876" stroke-width="14"/><path d="M250 -50Q50 130 300 330T170 850" stroke="#fcf7df" stroke-width="7"/></g>`,
 'petal-studio':`<rect width="400" height="800" fill="url(#base)"/>${[[120,240],[270,460],[105,650]].map(([x,y])=>`<g transform="translate(${x} ${y})">${[0,60,120,180,240,300].map(a=>`<ellipse cy="-37" rx="22" ry="40" transform="rotate(${a})" fill="#fff5ec" stroke="#e0b9c2" stroke-width="3"/>`).join('')}<circle r="17" fill="#d8ad63"/></g>`).join('')}`,
 'wild-neutral':`<rect width="400" height="800" fill="#dfbea0"/>${[[80,150],[250,240],[100,430],[290,560],[105,690]].map(([x,y],i)=>`<g transform="translate(${x} ${y}) rotate(${i*23})"><ellipse rx="35" ry="43" fill="#a46d42"/><path d="M-10 -48Q-65 -35 -45 17M20 -42Q65 -20 38 28M-23 40Q0 65 29 43" fill="none" stroke="#4d3021" stroke-width="14" stroke-linecap="round"/></g>`).join('')}`,
 'midnight-orbit':`<rect width="400" height="800" fill="#242b4b"/><g fill="#e9cf8a">${[[110,180],[280,380],[140,600]].map(([x,y])=>`<path d="M${x} ${y-45}Q${x+8} ${y-8} ${x+35} ${y}Q${x+8} ${y+8} ${x} ${y+45}Q${x-8} ${y+8} ${x-35} ${y}Q${x-8} ${y-8} ${x} ${y-45}Z"/>`).join('')}<circle cx="285" cy="130" r="5"/><circle cx="75" cy="370" r="5"/><circle cx="285" cy="650" r="6"/></g>`,
 'picnic-check':`<rect width="400" height="800" fill="#f6d9b7"/>${Array.from({length:10},(_,y)=>Array.from({length:5},(_,x)=>(x+y)%2?`<rect x="${x*80}" y="${y*80}" width="80" height="80" fill="#a5af83"/>`:'').join('')).join('')}`,
 'ocean-lines':`<rect width="400" height="800" fill="#c7e5de"/><g fill="none" stroke-linecap="round">${[0,1,2,3,4,5].map(i=>`<path d="M-20 ${i*150}Q80 ${i*150-90} 200 ${i*150}T430 ${i*150}" stroke="${i%2?'#fff9e9':'#4d8098'}" stroke-width="26"/>`).join('')}</g>`
});
Object.assign(art,{
 'cherry-picnic':`<rect width="400" height="800" fill="#f3e3d1"/>${[[125,200],[235,460],[110,670]].map(([x,y])=>`<g transform="translate(${x} ${y})"><path d="M0 0Q15 -70 45 -90Q60 -50 85 5" stroke="#5e8053" stroke-width="8" fill="none"/><ellipse cx="59" cy="-82" rx="27" ry="10" fill="#749762" transform="rotate(-25 59 -82)"/><circle r="29" fill="#b82e4b"/><circle cx="85" cy="5" r="29" fill="#c93b51"/><circle cx="-8" cy="-10" r="6" fill="#f7b4bc"/></g>`).join('')}`,
 'zebra-lines':`<rect width="400" height="800" fill="#f3e9d7"/><g fill="#3f2d28">${[0,1,2,3,4,5].map(i=>`<path d="M-30 ${i*150}Q180 ${i*150+100} 430 ${i*150-30}L430 ${i*150+15}Q160 ${i*150+130} -30 ${i*150+30}Z"/>`).join('')}</g>`,
 'blue-porcelain':`<rect width="400" height="800" fill="#f6f3e9"/><path d="M80 800Q300 500 130 250T250 -30" stroke="#34549b" stroke-width="9" fill="none"/>${[[130,200],[230,460],[100,650]].map(([x,y])=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse cy="-29" rx="14" ry="31" transform="rotate(${a})" fill="#5476b1"/>`).join('')}<circle r="11" fill="#234381"/></g>`).join('')}`,
 'pink-heart':`<rect width="400" height="800" fill="#edc1d2"/><g fill="#b73759">${[[120,190],[260,430],[130,650]].map(([x,y])=>`<path transform="translate(${x} ${y}) scale(1.2)" d="M0 18C-75 -25 -35 -85 0 -45C35 -85 75 -25 0 18Z"/>`).join('')}</g>`,
 'gold-edge':`<rect width="400" height="800" fill="url(#base)"/><path d="M0 0H400V185Q200 100 0 185Z" fill="#d1ae62"/><path d="M0 185Q200 100 400 185" stroke="#fff0c6" stroke-width="7" fill="none"/><path d="M40 720Q200 765 360 720" stroke="#aa8145" stroke-width="7" fill="none"/>`,
 'sunset-ombre':`<defs><linearGradient id="sunset" x2="0" y2="1"><stop stop-color="#a689ce"/><stop offset=".45" stop-color="#e5a2b7"/><stop offset="1" stop-color="#ef9b48"/></linearGradient></defs><rect width="400" height="800" fill="url(#sunset)"/>`,
 'retro-daisy':`<rect width="400" height="800" fill="#b8a0d1"/>${[[130,180],[265,420],[100,660]].map(([x,y])=>`<g transform="translate(${x} ${y})">${[0,45,90,135,180,225,270,315].map(a=>`<ellipse cy="-38" rx="15" ry="34" transform="rotate(${a})" fill="#fff4d7"/>`).join('')}<circle r="22" fill="#e6bc50"/></g>`).join('')}`,
 'mocha-swirl':`<rect width="400" height="800" fill="#aa7c59"/><path d="M-90 -20Q500 180 180 350T360 830" fill="none" stroke="#eed9bc" stroke-width="65"/><path d="M-70 -20Q500 180 200 350T380 830" fill="none" stroke="#53372c" stroke-width="22"/>`,
 'chocolate-dot':`<rect width="400" height="800" fill="#f0dfcb"/>${Array.from({length:8},(_,y)=>Array.from({length:4},(_,x)=>`<circle cx="${45+x*100+(y%2?35:0)}" cy="${60+y*100}" r="10" fill="#5e3a2a"/>`).join('')).join('')}`,
 'lilac-check':`<rect width="400" height="800" fill="#faf0df"/>${Array.from({length:10},(_,y)=>Array.from({length:5},(_,x)=>(x+y)%2?`<rect x="${x*80}" y="${y*80}" width="80" height="80" fill="#b9a0d0"/>`:'').join('')).join('')}`,
 'flame-tip':`<rect width="400" height="800" fill="url(#base)"/><path d="M0 0H400V330Q310 255 345 110Q275 180 250 350Q180 280 190 90Q95 170 95 300Q15 250 0 360Z" fill="#bd3e31"/><path d="M0 0H400V160Q325 90 315 240Q240 180 250 45Q135 70 130 200Q50 80 0 220Z" fill="#eea14b"/>`,
 'silver-orbit':`<rect width="400" height="800" fill="#414862"/><g fill="url(#silver)"><path d="M260 110A85 85 0 1 0 280 255A100 100 0 0 1 260 110Z"/><path d="M130 450L145 495L190 510L145 525L130 570L115 525L70 510L115 495Z"/><circle cx="285" cy="655" r="16"/><circle cx="85" cy="290" r="9"/></g>`
});
for(const design of extraDesigns)art[design.id]=design.artwork;
const data={},pressOnData={};
for(const [id,artwork]of Object.entries(art)){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="0 0 400 800"><defs>${defs}</defs><g clip-path="url(#nail)">${artwork}<path d="M105 130Q65 300 85 470" fill="none" stroke="white" stroke-width="13" stroke-linecap="round" opacity=".38"/></g></svg>`;
 writeFileSync(new URL(id+'.svg',out),svg);
 // Full-bleed UI texture: the selected CSS shape supplies the only clipping mask.
 const texture=`<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="0 0 400 800"><defs>${defs}</defs>${artwork}<path d="M105 130Q65 300 85 470" fill="none" stroke="white" stroke-width="13" stroke-linecap="round" opacity=".38"/></svg>`;
 writeFileSync(new URL(id+'-fill.svg',out),texture);
 // Polish textures must reach every edge: YouCam supplies the detected nail mask.
 const polish=`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="0 0 400 800"><defs>${defs}</defs>${artwork}</svg>`;
 const png=await sharp(Buffer.from(polish)).png().withMetadata({density:96}).toBuffer();
 // Extension references retain a silhouette, with no baked-in gloss or bottom margin.
 const extensionDefs=defs.replace('L28 745Q200 795 372 745','L28 620Q200 980 372 620');
 const extension=`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="0 0 400 800"><defs>${extensionDefs}</defs><g clip-path="url(#nail)">${artwork}</g></svg>`;
 const press=await sharp(Buffer.from(extension)).trim().resize(400,800,{fit:'fill'}).png().withMetadata({density:96}).toBuffer();
 writeFileSync(new URL(id+'-extension.png',out),press);pressOnData[id]='/designs/'+id+'-extension.png';
 // A wider reference lowers height relative to the detected thumb width.
 const thumb=await sharp(Buffer.from(extension)).trim().resize(520,800,{fit:'fill'}).png().withMetadata({density:96}).toBuffer();
 writeFileSync(new URL(id+'-thumb.png',out),thumb);pressOnData[id+'-thumb']='/designs/'+id+'-thumb.png';
 writeFileSync(new URL(id+'.png',out),png);data[id]='/designs/'+id+'.png';console.log(`${id}: 400 × 800, ${Math.round(png.length/1024)} KB`);
}
writeFileSync(new URL('../app/design-assets.ts',import.meta.url),'// Generated by scripts/create-nail-designs.mjs. Server-only reference paths; image bytes are static assets.\nexport const designAssets: Record<string,string> = '+JSON.stringify(data)+';\nexport const pressOnAssets: Record<string,string> = '+JSON.stringify(pressOnData)+';\n');
