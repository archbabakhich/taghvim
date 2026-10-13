const fs=require('fs'),vm=require('vm');
let code=['tables','core','astro'].map(f=>fs.readFileSync('js/'+f+'.js','utf8')).join('\n');
code+='\n;this.Cal=Cal;this.Astro=Astro;';
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
const {Cal,Astro}=ctx;let fail=0;
function eq(name,a,b){const ok=JSON.stringify(a)===JSON.stringify(b);if(!ok){fail++;console.log('FAIL',name,JSON.stringify(a),'!=',JSON.stringify(b))}else console.log('ok  ',name)}
// persian <-> gregorian known pairs
const P=(y,m,d)=>Cal.j2g(Cal.p2j(y,m,d));
eq('1405/1/1',P(1405,1,1),{y:2026,m:3,d:21});
eq('1403/1/1',P(1403,1,1),{y:2024,m:3,d:20});
eq('1403/12/30',P(1403,12,30),{y:2025,m:3,d:20});
eq('1404/1/1',P(1404,1,1),{y:2025,m:3,d:21});
eq('1405/7/21',P(1405,7,21),{y:2026,m:10,d:13});
eq('1357/11/22',P(1357,11,22),{y:1979,m:2,d:11});
eq('1355/1/1 (2535)',P(1355,1,1),{y:1976,m:3,d:21});
eq('1354/12/24',P(1354,12,24),{y:1976,m:3,d:14});
eq('1341/11/6',P(1341,11,6),{y:1963,m:1,d:26});
eq('1320/6/25',P(1320,6,25),{y:1941,m:9,d:16});
eq('1314/10/17',P(1314,10,17),{y:1936,m:1,d:8});
eq('1350/7/20 2500 yrs',P(1350,7,20),{y:1971,m:10,d:12});
eq('weekday 2026-10-13 is Tue(3)',Cal.weekday(Cal.g2j(2026,10,13)),3);
eq('weekday 2024-03-20 is Wed(4)',Cal.weekday(Cal.g2j(2024,3,20)),4);
// round trip over wide range
let bad=0;for(let j=Cal.g2j(1850,1,1);j<Cal.g2j(2100,1,1);j+=7){const p=Cal.j2p(j);if(Cal.p2j(p.y,p.m,p.d)!==j||p.d<1||p.d>Cal.pMonthLen(p.y,p.m)){bad++;if(bad<4)console.log('rt',j,p)}}
eq('roundtrip persian',bad,0);
bad=0;for(let j=Cal.g2j(1900,1,1);j<Cal.g2j(2030,1,1);j+=5){const h=Cal.j2h(j);if(Cal.h2j(h.y,h.m,h.d)!==j||h.d<1||h.d>30)bad++}
eq('roundtrip hijri',bad,0);
// hijri sanity: 2026-03-20 ~ 1 Shawwal 1447 (Eid al-Fitr Iran 2026 = Mar 20 or 21)
console.log('hijri 2026-03-20',Cal.j2h(Cal.g2j(2026,3,20)),'2026-03-21',Cal.j2h(Cal.g2j(2026,3,21)));
console.log('ashura 1448:',Cal.j2g(Cal.h2j(1448,1,10)));
// equinox
const t=ms=>new Date(ms).toISOString();
console.log('spring 2026',t(Astro.season('spring',2026)),'(expect 2026-03-20T14:46Z)');
console.log('spring 2027',t(Astro.season('spring',2027)),'(expect 2027-03-20T20:25Z)');
console.log('autumn 2026',t(Astro.season('autumn',2026)),'(expect 2026-09-23T00:05Z)');
console.log('winter 2026',t(Astro.season('winter',2026)),'(expect 2026-12-21T20:50Z)');
// moon
const ph=Astro.phasesBetween(Date.UTC(2026,9,1),Date.UTC(2026,10,1));
console.log(ph.map(x=>Astro.PHASE_NAMES[x.p]+' '+t(x.t)).join('\n'));
console.log('(expect new 2026-10-10 ~15:50Z, full 2026-10-26 ~04:12Z)');
console.log('moonState now',Astro.moonState(Date.UTC(2026,9,13,12)));
console.log(fail?('FAILS: '+fail):'ALL PASS');
// validate astronomical rule against official table
{let mism=[];for(let y=1304;y<=1498;y++){}}
