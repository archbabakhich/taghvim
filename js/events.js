/* Event engine: expands the event data into dates for a Persian year; personal events; ICS export. */
var Ev=(function(){
'use strict';
var CATS={
  ancient:{n:'جشن‌های باستانی ایران',on:1},
  kings:{n:'شاه ایران (جلوس و درگذشت)',on:1},
  royal:{n:'خاندان پهلوی',on:1},
  martyr:{n:'جاویدنام',on:1},
  hist:{n:'رویدادهای تاریخی',on:1},
  nat:{n:'روزهای ملی',on:1},
  culture:{n:'شاعر، دانشمند، فیلسوف و عارف',on:1},
  relig:{n:'مناسبت‌های مذهبی (قمری)',on:0},
  intl:{n:'روزهای جهانی',on:0},
  personal:{n:'یادداشت‌های من',on:1}
};
var CAT_ORDER=['ancient','kings','royal','martyr','hist','nat','culture','relig','intl','personal'];
var cache={},personal=[];

/* ---------- personal events ---------- */
var PKEY='taghvim-personal-v1';
function loadPersonal(){try{var r=localStorage.getItem(PKEY);personal=r?JSON.parse(r):[];if(!Array.isArray(personal))personal=[]}catch(e){personal=[]}}
function savePersonal(){try{localStorage.setItem(PKEY,JSON.stringify(personal))}catch(e){}cache={}}
function listPersonal(){return personal.slice()}
function addPersonal(o){o.id='u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);personal.push(o);savePersonal();return o}
function updatePersonal(id,o){for(var i=0;i<personal.length;i++)if(personal[i].id===id){o.id=id;personal[i]=o;break}savePersonal()}
function removePersonal(id){personal=personal.filter(function(p){return p.id!==id});savePersonal()}
function replacePersonal(arr){personal=arr.filter(function(p){return p&&p.t&&(p.j||(p.c&&p.m&&p.d))});savePersonal()}

/* ---------- done state of tasks ---------- */
var DKEY='taghvim-done-v1',done={};
function loadDone(){try{var r=localStorage.getItem(DKEY);done=r?JSON.parse(r):{};if(!done||typeof done!=='object')done={}}catch(e){done={}}}
function isDone(id,j){return !!done[id+':'+j]}
function setDone(id,j,v){if(v)done[id+':'+j]=1;else delete done[id+':'+j];try{localStorage.setItem(DKEY,JSON.stringify(done))}catch(e){}}
function getDone(){return JSON.parse(JSON.stringify(done))}
function putDone(o){done=(o&&typeof o==='object')?o:{};try{localStorage.setItem(DKEY,JSON.stringify(done))}catch(e){}}

/* ---------- expansion ---------- */
function lastWeekday(py,mo,wd){
  var j=Cal.p2j(py,mo,Cal.pMonthLen(py,mo));
  while(Cal.weekday(j)!==wd)j--;
  return j;
}
function occurrences(e,py,lo,hi){
  var out=[],j;
  if(e.c==='p'){if(e.d<=Cal.pMonthLen(py,e.m))out.push(Cal.p2j(py,e.m,e.d))}
  else if(e.c==='r'){out.push(lastWeekday(py,e.mo,e.wd))}
  else if(e.c==='g'){
    for(var gy=py+621;gy<=py+622;gy++){
      if(e.m===2&&e.d===29&&Cal.gMonthLen(gy,2)<29)continue;
      j=Cal.g2j(gy,e.m,e.d);if(j>=lo&&j<hi)out.push(j);
    }
  }else if(e.c==='h'){
    var h0=Cal.j2h(lo).y;
    for(var hy=h0;hy<=h0+1;hy++){j=Cal.h2j(hy,e.m,e.d);if(j>=lo&&j<hi)out.push(j)}
  }else if(e.c==='once'){if(e.j>=lo&&e.j<hi)out.push(e.j)}
  return out;
}
function recOf(p){return p.rec||(p.once?'once':'year')}
function personalOcc(p,lo,hi,py0){
  var r=recOf(p),out=[],j,end=p.ej||1e9;
  if(r==='once'){if(p.j>=lo&&p.j<hi)out.push(p.j)}
  else if(r==='year'){return occurrences({c:p.c,m:p.m,d:p.d},py0,lo,hi)}
  else if(r==='day'){for(j=Math.max(lo,p.j);j<hi&&j<=end;j++)out.push(j)}
  else if(r==='week'){j=p.j;if(lo>j)j+=Math.ceil((lo-j)/7)*7;for(;j<hi&&j<=end;j+=7)out.push(j)}
  else if(r==='month'){
    if(p.cal==='g'){
      var sd=Cal.j2g(p.j).d,a=Cal.j2g(lo),b=Cal.j2g(hi-1),y=a.y,m=a.m;
      while(y<b.y||(y===b.y&&m<=b.m)){j=Cal.g2j(y,m,Math.min(sd,Cal.gMonthLen(y,m)));if(j>=Math.max(lo,p.j)&&j<hi&&j<=end)out.push(j);m++;if(m>12){m=1;y++}}
    }else{
      var psd=Cal.j2p(p.j).d,py=Cal.j2p(lo).y;
      for(var mm=1;mm<=12;mm++){j=Cal.p2j(py,mm,Math.min(psd,Cal.pMonthLen(py,mm)));if(j>=Math.max(lo,p.j)&&j<hi&&j<=end)out.push(j)}
    }
  }
  return out;
}
function index(py){
  if(cache[py])return cache[py];
  var lo=Cal.pYearStart(py),hi=Cal.pYearStart(py+1),map={};
  function put(j,e,kind){(map[j]||(map[j]=[])).push({t:e.t,k:kind||e.k,y:e.y||0,h:e.h?1:0,id:e.id||'',note:e.note||'',rm:(e.rm>=0?e.rm:-1),rt:e.rt||'09:00',task:e.task?1:0})}
  EVENT_DATA.forEach(function(e){occurrences(e,py,lo,hi).forEach(function(j){put(j,e)})});
  PEOPLE.forEach(function(p){if(p.noev)return;var e={c:'p',m:p.m,d:p.d,t:p.e+' '+p.n,k:'culture',y:p.y,note:p.r};occurrences(e,py,lo,hi).forEach(function(j){put(j,e)})});
  personal.forEach(function(p){
    var e={t:p.t,id:p.id,note:p.note,k:'personal',rm:p.rm,rt:p.rt,task:p.task?1:0};
    personalOcc(p,lo,hi,py).forEach(function(j){put(j,e,'personal')});
  });
  return (cache[py]=map);
}
function eventsOn(j,cats){
  var py=Cal.j2p(j).y,list=(index(py)[j]||[]).filter(function(e){return cats[e.k]});
  list.sort(function(a,b){return (b.h-a.h)||(CAT_ORDER.indexOf(a.k)-CAT_ORDER.indexOf(b.k))});
  return list;
}
function isHoliday(j,cats,fridayOff){
  if(!fridayOff&&Cal.weekday(j)===6)return true;
  return eventsOn(j,cats).some(function(e){return e.h});
}
/* all events of a Persian year, sorted by date */
function yearEvents(py,cats){
  var idx=index(py),out=[];
  Object.keys(idx).forEach(function(k){
    idx[k].forEach(function(e){if(cats[e.k])out.push({j:+k,e:e})});
  });
  out.sort(function(a,b){return a.j-b.j||(CAT_ORDER.indexOf(a.e.k)-CAT_ORDER.indexOf(b.e.k))});
  return out;
}
function clearCache(){cache={}}

/* ---------- ICS export ---------- */
function icsEscape(s){return String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
function pad(n,w){n=String(n);while(n.length<(w||2))n='0'+n;return n}
function icsDate(j){var g=Cal.j2g(j);return pad(g.y,4)+pad(g.m)+pad(g.d)}
function buildICS(fromPY,toPY,cats,dateLabel){
  var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Taghvim Shahanshahi//FA','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:تقویم شاهنشاهی','X-WR-TIMEZONE:Asia/Tehran'];
  var stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  for(var py=fromPY;py<=toPY;py++){
    yearEvents(py,cats).forEach(function(o){
      var next=icsDate(o.j+1);
      lines.push('BEGIN:VEVENT','UID:'+o.j+'-'+(o.e.id||icsEscape(o.e.t).length+'-'+o.e.k+'-'+o.e.t.length+'-'+Math.abs(hash(o.e.t)))+'@taghvim',
        'DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+icsDate(o.j),'DTEND;VALUE=DATE:'+next,'SUMMARY:'+icsEscape(o.e.t),
        'DESCRIPTION:'+icsEscape(dateLabel(o.j)+(o.e.note?'\n'+o.e.note:'')),'TRANSP:TRANSPARENT');
      if(o.e.k==='personal'&&o.e.rm>=0){
        var hm=(o.e.rt||'09:00').split(':'),mins=o.e.rm*1440-((+hm[0]||0)*60+(+hm[1]||0));
        lines.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsEscape(o.e.t),'TRIGGER:'+(mins>=0?'-':'')+'PT'+Math.abs(mins)+'M','END:VALARM');
      }
      lines.push('END:VEVENT');
    });
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h}

loadPersonal();loadDone();
return {isDone:isDone,setDone:setDone,getDone:getDone,putDone:putDone,recOf:recOf,CATS:CATS,CAT_ORDER:CAT_ORDER,eventsOn:eventsOn,isHoliday:isHoliday,yearEvents:yearEvents,clearCache:clearCache,
  listPersonal:listPersonal,addPersonal:addPersonal,updatePersonal:updatePersonal,removePersonal:removePersonal,replacePersonal:replacePersonal,buildICS:buildICS};
})();
