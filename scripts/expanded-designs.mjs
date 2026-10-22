export const collections=[
 ['Colour-block French',['Cobalt Cut','Olive Outline','Burgundy Double Tip','Lilac Diagonal'],['#d9b9aa','#304b9e','#efddc2']],
 ['Velvet cat-eye',['Forest Velvet','Plum Magnet','Copper Current','Champagne Halo'],['#233d36','#abcb9b','#ecd8a2']],
 ['Aura glow',['Peach Eclipse','Blue Bloom','Crimson Cloud','Matcha Mist'],['#b8a9ca','#f09096','#fff3ac']],
 ['Soft plaid',['Cocoa Tartan','Berry Flannel','Butter Plaid','Denim Weave'],['#ead8c2','#795344','#c89d83']],
 ['Lace detail',['Midnight Lace','Bridal Filigree','Plum Veil','Rose Corset'],['#ddbdba','#4e3445','#f3e4d3']],
 ['Snake print',['Sage Serpent','Golden Python','Silver Scale','Burgundy Snake'],['#c6c6a2','#616c49','#e8d8ad']],
 ['Croc texture art',['Chocolate Croc','Cherry Croc','Emerald Croc','Ivory Croc'],['#957058','#493327','#d2ac82']],
 ['Cow print',['Mocha Moo','Pink Pasture','Classic Cow','Blue Pasture'],['#f3e6d4','#49392e','#d2b499']],
 ['Coastal motifs',['Pearl Tide','Seashell Sketch','Coral Reef','Ocean Keepsake'],['#c4ded7','#347c88','#f5ead3']],
 ['Fruit art',['Lemon Sorbet','Strawberry Picnic','Orange Grove','Watermelon Sugar'],['#f6e6c3','#e2b33d','#648459']],
 ['Butterfly wings',['Lilac Wings','Monarch Moment','Blue Morph','Pink Flutter'],['#dfc9e3','#8066a1','#f5e9d7']],
 ['Gemstone art',['Ruby Frame','Sapphire Jewel','Emerald Heirloom','Amethyst Charm'],['#ead4bd','#486e74','#c8a361']],
 ['Negative space',['Fine Line Nude','Half Moon Study','Floating Arches','Minimal Contour'],['#dcb6a7','#653e36','#f6ebdc']],
 ['Sculptural waves',['Caramel Fold','Pink Current','Cobalt Flow','Olive Ribbon'],['#dfb796','#704a35','#f7e6c9']],
 ['Ombré French',['Baby Boomer','Berry Fade','Blue Airbrush','Peach Frost'],['#e9bac9','#fff3dd','#c39ac5']],
 ['Celestial detail',['Zodiac Dust','Solar Flare','Lavender Galaxy','Starlight Tips'],['#35314e','#d8bc78','#eee0ba']],
 ['Botanical art',['Pressed Fern','Sakura Branch','Forget Me Not','Lavender Sprig'],['#edddcf','#637a57','#d49aaf']],
 ['Heart edit',['Heart French','Red Love Letter','Lilac Sweetheart','Heart Outline'],['#efd1d1','#b64b66','#fff0de']],
 ['Ribbon detail',['Ballet Wrap','Pearl Bow','Burgundy Ribbon','Blue Gift'],['#e8c0d2','#a76284','#f8e8d6']]
];
const palettes=[['#cad7e8','#304b9e','#f1debd'],['#d6c9b9','#6c7545','#f4e8d2'],['#d7acb7','#822c48','#f4c6bc'],['#d7c0ea','#8967b0','#fff0cc']];
const dot=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
function artwork(f,v,colors){const [a,b,c]=colors;const rect=`<rect width="400" height="800" fill="${a}"/>`;const pts=[[90,155],[270,310],[115,500],[265,670]];const stroke=(d,w=8,col=b)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
 switch(f){
 case 0:return rect+`<path d="M0 0H400V${130+v*30}Q200 ${40+v*35} 0 ${210-v*15}Z" fill="${b}"/>`+stroke(`M0 ${235+v*10}Q200 ${80+v*30} 400 ${170+v*20}`,12,c);
 case 1:return `<defs><linearGradient id="velvet" x1="0" y1="${v%2}" x2="1" y2="${1-v%2}"><stop stop-color="${b}"/><stop offset=".38" stop-color="${a}"/><stop offset=".5" stop-color="${c}"/><stop offset=".64" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="800" fill="url(#velvet)"/>`+pts.slice(0,v+1).map(([x,y])=>dot(x,y,5,c)).join('');
 case 2:return `<defs><radialGradient id="glow"><stop stop-color="${c}"/><stop offset=".4" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></radialGradient></defs>`+rect+`<ellipse cx="${150+v*32}" cy="${280+v*60}" rx="230" ry="350" fill="url(#glow)"/>`;
 case 3:return rect+Array.from({length:6},(_,i)=>`<rect x="${i*95-40+v*8}" width="24" height="800" fill="${b}" opacity=".55"/><rect y="${i*150+v*12}" width="400" height="38" fill="${b}" opacity=".45"/>`+stroke(`M${i*95+2} 0V800`,3,c)+stroke(`M0 ${i*150+60}H400`,4,c)).join('');
 case 4:return rect+Array.from({length:7},(_,i)=>stroke(`M0 ${i*130}Q100 ${i*130-95} 200 ${i*130}T400 ${i*130}`,4)+Array.from({length:5},(_,j)=>`<circle cx="${j*100+(i%2?45:0)}" cy="${i*130+35}" r="${16+v*3}" fill="none" stroke="${b}" stroke-width="3"/>`).join('')).join('');
 case 5:return rect+Array.from({length:11},(_,y)=>Array.from({length:5},(_,x)=>`<ellipse cx="${x*95+(y%2?45:0)}" cy="${y*80}" rx="${40-v*3}" ry="35" fill="${(x+y)%3?b:c}" opacity="${(x+y)%2?.5:.85}"/>`).join('')).join('');
 case 6:return rect+Array.from({length:7},(_,y)=>Array.from({length:3},(_,x)=>`<rect x="${x*145-20+(y%2?30:0)}" y="${y*125-20}" width="${110+v*4}" height="95" rx="28" fill="${(x+y)%3?b:c}" opacity=".65"/>`).join('')).join('');
 case 7:return rect+pts.map(([x,y],i)=>`<path d="M${x-55} ${y}q${-30+v*7} -80 65 -60t-5 115q-70 35 -60 -55Z" fill="${i%2?b:c}"/>`).join('');
 case 8:return rect+pts.map(([x,y],i)=>stroke(`M${x-40} ${y+30}Q${x} ${y-80} ${x+40} ${y+30}M${x} ${y-35}V${y+30}M${x-23} ${y-10}L${x} ${y+30}L${x+24} ${y-10}`,5,i%2?b:c)).join('')+Array.from({length:6},(_,i)=>dot(50+i*55,750-i*100,5,c)).join('');
 case 9:return rect+pts.map(([x,y],i)=>v===1?`<path d="M${x-28} ${y}Q${x} ${y+85} ${x+30} ${y}Q${x} ${y-25} ${x-28} ${y}Z" fill="${b}"/>`+dot(x-10,y+12,3,c)+dot(x+8,y+23,3,c):`<ellipse cx="${x}" cy="${y}" rx="${30+v*5}" ry="42" transform="rotate(${i*30} ${x} ${y})" fill="${b}"/>`+stroke(`M${x} ${y-25}L${x+18} ${y-55}`,5,c)).join('');
 case 10:return rect+pts.slice(0,2+v%2).map(([x,y])=>`<g transform="translate(${x} ${y}) rotate(${v*18})"><path d="M0 0C-110 -130 -100 85 0 20C100 85 110 -130 0 0Z" fill="${b}" stroke="${c}" stroke-width="5"/>`+stroke('M0 -5V70M0 10L-50 -30M0 10L50 -30',5,c)+'</g>').join('');
 case 11:return rect+pts.map(([x,y],i)=>`<path d="M${x} ${y-45}l35 45 -35 50 -35 -50Z" fill="${b}" stroke="${c}" stroke-width="7"/>`+dot(x-45,y,5,c)+dot(x+45,y,5,c)).join('');
 case 12:return rect+stroke(v===0?'M70 0V800M320 0V800':v===1?'M0 710Q200 510 400 710':v===2?'M40 550V250Q200 40 360 250V550':'M-40 150Q390 100 200 400T400 750',8,b)+stroke('M0 65Q200 10 400 65',5,c);
 case 13:return rect+stroke(`M-60 ${50+v*60}Q480 180 120 410T430 850`,60,b)+stroke(`M-30 ${70+v*60}Q510 180 150 410T460 850`,15,c);
 case 14:return `<defs><linearGradient id="fade" x2="${v%2*.3}" y2="1"><stop stop-color="${b}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="400" height="800" fill="url(#fade)"/>`+stroke(`M0 ${80+v*20}Q200 10 400 ${80+v*20}`,4,c);
 case 15:return rect+pts.map(([x,y],i)=>`<path d="M${x} ${y-35}L${x+8} ${y-8}L${x+32} ${y}L${x+8} ${y+8}L${x} ${y+35}L${x-8} ${y+8}L${x-32} ${y}L${x-8} ${y-8}Z" fill="${i%2?b:c}"/>`+dot(x+45,y-45,4,c)).join('');
 case 16:return rect+stroke(`M80 800Q${300-v*30} 450 150 50`,6,b)+pts.map(([x,y],i)=>v%2?`<g transform="translate(${x} ${y})">${Array.from({length:5},(_,k)=>`<ellipse cy="-20" rx="12" ry="23" transform="rotate(${k*72})" fill="${c}"/>`).join('')}${dot(0,0,8,b)}</g>`:`<ellipse cx="${x}" cy="${y}" rx="17" ry="43" transform="rotate(${i%2?45:-45} ${x} ${y})" fill="${b}"/>`).join('');
 case 17:return rect+pts.map(([x,y])=>`<path transform="translate(${x} ${y}) scale(${.7+v*.12})" d="M0 30C-85 -15 -45 -90 0 -40C45 -90 85 -15 0 30Z" fill="${v===3?'none':b}" stroke="${b}" stroke-width="6"/>`).join('');
 default:return rect+stroke(`M${80+v*25} 0Q340 220 120 450T300 820`,14,b)+`<g transform="translate(200 ${240+v*70})"><path d="M0 0C-110 -100 -110 70 0 0C110 70 110 -100 0 0Z" fill="none" stroke="${c}" stroke-width="8"/>`+stroke('M0 0L-65 120M0 0L70 120',7,c)+'</g>';
 }
}
export const extraDesigns=collections.flatMap(([tag,names,base],f)=>names.map((name,v)=>{const colors=v===0?base:palettes[(v+f)%4];return {id:`edit-${f+1}-${v+1}`,name,hex:colors[0],tag,description:`${name}: an original ${tag.toLowerCase()} interpretation with ${['balanced accents','diagonal movement','layered detail','contrasting contours'][v]}.`,artwork:artwork(f,v,colors)};}));
export const extraShades=[['Oxblood','#4C1725'],['Black Cherry','#3E1C2C'],['Aubergine','#583451'],['Midnight Navy','#1E304A'],['Forest','#244637'],['Teal','#287E83'],['Jade','#77A996'],['Sea Glass','#ADD5C8'],['Sage','#A5AC94'],['Chartreuse','#B8BC48'],['Lemon Cream','#F3E6AD'],['Apricot','#EEAA79'],['Coral','#E87570'],['Papaya','#E99560'],['Brick','#9D493B'],['Cinnamon','#A45B42'],['Caramel','#BC8D62'],['Sandstone','#C9AD8E'],['Taupe','#A28B80'],['Mushroom','#B6A99F'],['Cool Cocoa','#755B57'],['Ballet Pink','#F0D2DB'],['Bubblegum','#E78DB7'],['Raspberry','#B63869'],['Periwinkle','#989FD5'],['Smoky Lavender','#92859F']].map(([name,hex])=>({name,hex,description:`${name}, a solid colour to wear alone or combine in your own nail set.`}));
