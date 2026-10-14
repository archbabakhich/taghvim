/* Taghvim Shahanshahi — UI */
(function(){
'use strict';
/* ====================== constants ====================== */
var PM=['فروردین','اردیبهشت','خرداد','تیر','امرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
var GM=['ژانویه','فوریه','مارس','آوریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوامبر','دسامبر'];
var HM=['محرم','صفر','ربیع‌الاول','ربیع‌الثانی','جمادی‌الاول','جمادی‌الثانی','رجب','شعبان','رمضان','شوال','ذی‌القعده','ذی‌الحجه'];
var WD=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه']; /* index 0 = Saturday */
var WDS=['ش','ی','د','س','چ','پ','ج'];
var SEASON_NAMES={spring:'آغاز بهار (اعتدال بهاری)',summer:'آغاز تابستان',autumn:'آغاز پاییز (اعتدال پاییزی)',winter:'آغاز زمستان'};
function seasonOf(pm){return pm<=3?'بهار':pm<=6?'تابستان':pm<=9?'پاییز':'زمستان'}
var ICON={
  month:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  year:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  tunnel:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2"/>',
  star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8z"/>',
  tools:'<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
  prev:'<path d="M9 6l6 6-6 6"/>',next:'<path d="M15 6l-6 6 6 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',
  share:'<path d="M12 15V4M8 8l4-4 4 4M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6"/>'
};
function ic(n,cls){return '<svg class="ic '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true">'+ICON[n]+'</svg>'}

/* ====================== settings ====================== */
var SKEY='taghvim-settings-v2';
var S={theme:'auto',digits:'fa',weekStart:0,showG:1,showMoon:1,showHijri:0,tz:'device',cats:{}};
Ev.CAT_ORDER.forEach(function(k){S.cats[k]=!!Ev.CATS[k].on});
try{var raw=localStorage.getItem(SKEY);if(raw){var o=JSON.parse(raw);for(var k in o){if(k==='cats'){for(var c in o.cats)S.cats[c]=!!o.cats[c]}else S[k]=o[k]}}}catch(e){}
function saveS(){try{localStorage.setItem(SKEY,JSON.stringify(S))}catch(e){}}
function applyTheme(){var r=document.documentElement;if(S.theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',S.theme)}

/* ====================== formatting ====================== */
var FA='۰۱۲۳۴۵۶۷۸۹';
function num(n){var s=String(n);return S.digits==='lat'?s:s.replace(/\d/g,function(d){return FA[d]})}
function pad2(n){return n<10?'0'+n:''+n}
function hhmm(h,m,s){return '\u2066'+num(pad2(h)+':'+pad2(m)+(s===undefined?'':':'+pad2(s)))+'\u2069'}
function impY(py){return py+Cal.IMPERIAL_OFFSET}
function pd(j){return Cal.j2p(j)}
function impStr(j){var p=pd(j);return num(p.d)+' '+PM[p.m-1]+' '+num(impY(p.y))+' شاهنشاهی'}
function shStr(j){var p=pd(j);return num(p.d)+' '+PM[p.m-1]+' '+num(p.y)+' هجری شمسی'}
function gStr(j){var g=Cal.j2g(j);return num(g.d)+' '+GM[g.m-1]+' '+num(g.y)+' میلادی'}
function hStr(j){var h=Cal.j2h(j);return num(h.d)+' '+HM[h.m-1]+' '+num(h.y)+' هجری قمری'}
function shortLabel(j){var p=pd(j);return num(p.d)+' '+PM[p.m-1]}
function wdName(j){return WD[Cal.weekday(j)]}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function $(s,r){return (r||document).querySelector(s)}
function toast(msg){
  var t=document.createElement('div');t.className='toast';t.textContent=msg;t.setAttribute('role','status');
  document.body.appendChild(t);setTimeout(function(){t.remove()},2600);
}
/* instant -> Julian day in the chosen time zone */
function msToJ(ms){
  if(S.tz==='tehran'){var d=new Date(ms+3.5*3600000);return Cal.g2j(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate())}
  return Cal.jOfDate(new Date(ms));
}
function msClock(ms,tz,withSec){
  var d;
  if(tz==='tehran'){d=new Date(ms+3.5*3600000);return hhmm(d.getUTCHours(),d.getUTCMinutes(),withSec?d.getUTCSeconds():undefined)}
  d=new Date(ms);return hhmm(d.getHours(),d.getMinutes(),withSec?d.getSeconds():undefined);
}
function msJ(ms,tz){
  if(tz==='tehran'){var d=new Date(ms+3.5*3600000);return Cal.g2j(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate())}
  return Cal.jOfDate(new Date(ms));
}

/* ====================== moon glyph ====================== */
function moonSVG(p,size){
  /* p: 0 new … 0.5 full … 1 new */
  var r=10,c=12,k=Math.cos(2*Math.PI*p),illum=(1-k)/2,rx=Math.abs(k)*r,waxing=p<0.5,d;
  if(illum<0.01)return '<svg viewBox="0 0 24 24" width="'+(size||24)+'" height="'+(size||24)+'" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".75"/></svg>';
  if(illum>0.99)return '<svg viewBox="0 0 24 24" width="'+(size||24)+'" height="'+(size||24)+'" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#F2D58C" stroke="#C9A24A" stroke-width="1"/></svg>';
  var crescent=illum<0.5;
  if(waxing)d='M'+c+' '+(c-r)+' A'+r+' '+r+' 0 0 1 '+c+' '+(c+r)+' A'+rx+' '+r+' 0 0 '+(crescent?0:1)+' '+c+' '+(c-r)+'Z';
  else d='M'+c+' '+(c-r)+' A'+r+' '+r+' 0 0 0 '+c+' '+(c+r)+' A'+rx+' '+r+' 0 0 '+(crescent?1:0)+' '+c+' '+(c-r)+'Z';
  return '<svg viewBox="0 0 24 24" width="'+(size||24)+'" height="'+(size||24)+'" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="rgba(120,120,140,.28)" stroke="currentColor" stroke-width="1" opacity=".9"/><path d="'+d+'" fill="#F2D58C"/></svg>';
}
function moonName(p){
  var f=p;
  if(f<0.03||f>0.97)return 'ماه نو';
  if(f<0.22)return 'هلال نو (رو به افزایش)';
  if(f<0.28)return 'تربیع اول';
  if(f<0.47)return 'رو به بدر';
  if(f<0.53)return 'ماه کامل';
  if(f<0.72)return 'رو به محاق';
  if(f<0.78)return 'تربیع آخر';
  return 'هلال پایانی';
}
function dayNoonMs(j){
  var g=Cal.j2g(j);
  return S.tz==='tehran'?Date.UTC(g.y,g.m-1,g.d,12)-3.5*3600000:new Date(g.y,g.m-1,g.d,12).getTime();
}

/* ====================== state ====================== */
var today=Cal.todayJ(),tp=Cal.j2p(today);
var st={tab:'month',cur:{y:tp.y,m:tp.m},sel:null,yearV:tp.y,tools:'convert',evMode:'upcoming',evYear:tp.y,q:'',dir:'',sheet:null,conv:{cal:'imp'},dist:{},astroY:tp.y,tr:'all',tc:{}};
var installEv=null,sheetOpen=false,timer=null;

/* ====================== helpers: events ====================== */
function evs(j){return Ev.eventsOn(j,S.cats)}
function isHol(j){return Ev.isHoliday(j,S.cats,false)}
function originNote(e,py){
  if(!e.y)return '';
  var n=py-e.y,s=impY(e.y)>0?num(impY(e.y))+' شاهنشاهی':'';
  if(n>0)s+=(s?' · ':'')+num(n)+' سال پیش';
  return s;
}
function evRow(j,e,opt){
  opt=opt||{};
  var p=pd(j),left=opt.noDate?'':'<div class="d"><b>'+num(p.d)+'</b><span>'+PM[p.m-1]+'</span></div>';
  var rel=opt.rel?'<div class="rel">'+relText(j)+'</div>':'';
  var on=originNote(e,opt.py||p.y);
  var del=(e.k==='personal'&&e.id)?' <button class="btn ghost sm" data-a="edit-p" data-id="'+esc(e.id)+'" data-j="'+j+'">ویرایش</button>':'';
  var tk=(e.k==='personal'&&e.task)?chkBtn(e.id,j):'';
  return '<div class="ev"><i class="bar-c '+e.k+'"></i>'+left+'<div class="t"><div class="ti">'+tk+esc(e.t)+(e.h?'<span class="tag hol">تعطیل</span>':'')+'</div>'+
    ((on||e.note||!opt.noCat)?'<small>'+(opt.noCat?'':esc(Ev.CATS[e.k].n)+(on?' · ':''))+on+(e.note?(on||!opt.noCat?' · ':'')+esc(e.note):'')+'</small>':'')+rel+del+'</div></div>';
}
function relText(j){
  var d=j-today;
  if(d===0)return 'امروز';if(d===1)return 'فردا';if(d===-1)return 'دیروز';
  return d>0?num(d)+' روز دیگر':num(-d)+' روز پیش';
}

/* ====================== views ====================== */
function weekHeader(){
  var h='';
  for(var i=0;i<7;i++){var idx=(S.weekStart+i)%7;h+='<div class="wd'+(idx===6?' f':'')+'">'+WDS[idx]+'</div>'}
  return h;
}
function firstOffset(j){return (Cal.weekday(j)-S.weekStart+7)%7}

/* ---------- Iran clock (Asia/Tehran, rules from the device's IANA tz database) ---------- */
var TZF=null;
try{TZF=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tehran',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'})}catch(e){}
function tehranNow(ms){
  var off=210,y,mo,d,h,mi,sc;
  if(TZF){
    var o={};TZF.formatToParts(new Date(ms)).forEach(function(x){o[x.type]=+x.value});
    y=o.year;mo=o.month;d=o.day;h=o.hour%24;mi=o.minute;sc=o.second;
    off=Math.round((Date.UTC(y,mo-1,d,h,mi,sc)-Math.floor(ms/1000)*1000)/60000);
  }else{var t=new Date(ms+210*60000);h=t.getUTCHours();mi=t.getUTCMinutes();sc=t.getUTCSeconds()}
  return {h:h,m:mi,s:sc,off:off};
}
function two(n){return (n<10?'0':'')+n}
function offStr(o){var a=Math.abs(o);return (o<0?'-':'+')+two(Math.floor(a/60))+':'+two(a%60)}
function clockHTML(){
  var ms=Date.now(),t=tehranNow(ms),loc=-new Date(ms).getTimezoneOffset();
  var s=num(two(t.h)+':'+two(t.m)+':'+two(t.s));
  var offTxt=t.off===210?'ساعت رسمی ایران':'ساعت تابستانی ایران';
  var l=loc!==t.off?' · ساعت دستگاه شما '+num(two(new Date(ms).getHours())+':'+two(new Date(ms).getMinutes())):'';
  return '<span class="tl">ساعت ایران</span> <b dir="ltr">'+s+'</b><small>'+offTxt+' ('+num('UTC'+offStr(t.off))+')'+l+'</small>';
}
function tickClock(){var e=document.getElementById('tclock');if(e)e.innerHTML=clockHTML()}
setInterval(tickClock,1000);

function hero(){
  var p=tp,ms=Date.now(),mo=Astro.moonState(ms);
  var h='<section class="hero" aria-label="امروز"><div class="eyebrow">امروز · '+wdName(today)+(isHol(today)?' · روز تعطیل':'')+'</div>'+
    '<div class="big">'+num(p.d)+' '+PM[p.m-1]+' '+num(impY(p.y))+'</div>'+
    '<div class="tclock" id="tclock">'+clockHTML()+'</div>'+
    '<div class="lines"><span>'+shStr(today)+'</span><span>'+gStr(today)+'</span>'+(S.showHijri?'<span>'+hStr(today)+'</span>':'')+'</div>';
  if(S.showMoon)h+='<div class="moon" title="'+moonName(mo.frac)+'">'+moonSVG(mo.frac,34)+'</div>';
  var nextSpring={py:p.y+1},days=Math.max(0,Cal.pYearStart(p.y+1)-today);
  h+='<div class="chipline"><span class="pill">'+seasonOf(p.m)+'</span><span class="pill">روز '+num(Cal.dayOfYear(today))+' از '+num(Cal.pYearLen(p.y))+'</span>'+
    '<span class="pill">هفتهٔ '+num(Cal.weekOfYear(today,S.weekStart))+'</span><span class="pill">'+num(days)+' روز تا نوروز '+num(impY(nextSpring.py))+'</span></div></section>';
  return h;
}
function nextNowruz(){
  var now=Date.now(),gy=new Date(now).getUTCFullYear(),ms=Astro.season('spring',gy);
  if(ms<now){gy++;ms=Astro.season('spring',gy)}
  return {ms:ms,py:gy-621};
}

function vMonth(){
  var y=st.cur.y,m=st.cur.m,first=Cal.p2j(y,m,1),len=Cal.pMonthLen(y,m),off=firstOffset(first),last=first+len-1;
  var g1=Cal.j2g(first),g2=Cal.j2g(last);
  var gtxt=GM[g1.m-1]+(g1.m!==g2.m?' و '+GM[g2.m-1]:'')+' '+num(g2.y);
  var phases={};
  if(S.showMoon)Astro.phasesBetween(dayNoonMs(first)-86400000,dayNoonMs(last)+2*86400000).forEach(function(o){phases[msToJ(o.t)]=o});
  var h=hero()+remPanel()+taskPanel();
  h+='<div class="bar"><button class="titlebtn" data-a="picker" aria-label="انتخاب ماه و سال"><h2>'+PM[m-1]+' '+num(impY(y))+'</h2><div class="sub">'+num(y)+' شمسی · '+gtxt+(Cal.isLeapPersian(y)?' · سال کبیسه':'')+'</div></button>'+
    '<div class="btns"><button class="ib" data-a="prevm" aria-label="ماه قبل">'+ic('prev')+'</button><button class="txtbtn" data-a="today">امروز</button><button class="ib" data-a="next" aria-label="ماه بعد">'+ic('next')+'</button></div></div>';
  h+='<div class="grid'+(st.dir?' slide-'+st.dir:'')+'" role="grid" aria-label="'+PM[m-1]+' '+num(impY(y))+'">'+weekHeader();
  for(var i=0;i<off;i++)h+='<div class="cell empty"></div>';
  for(var d=1;d<=len;d++){
    var j=first+d-1,es=evs(j),wdv=Cal.weekday(j),hol=es.some(function(e){return e.h});
    var c='cell'+(wdv===6?' fri':'')+(hol?' hol':'')+(j===today?' today':'')+(st.sel===j?' sel':'');
    var g=Cal.j2g(j);
    h+='<button class="'+c+'" role="gridcell" data-a="day" data-j="'+j+'" aria-label="'+wdName(j)+' '+impStr(j)+(es.length?' — '+esc(es.map(function(e){return e.t}).join('، ')):'')+'">'+
      '<span class="n">'+num(d)+'</span>'+(S.showG?'<span class="g">'+(g.d===1?GM[g.m-1].slice(0,3)+' ':'')+(S.digits==='lat'?g.d:g.d)+'</span>':'');
    if(es.length){var seen={};h+='<span class="dots">';es.forEach(function(e){if(!seen[e.k]){seen[e.k]=1;h+='<i class="dot '+e.k+'"></i>'}});h+='</span>'}
    if(phases[j])h+='<span class="mn" title="'+['ماه نو','تربیع اول','ماه کامل','تربیع آخر'][phases[j].p]+'">'+moonSVG(phases[j].p/4,10)+'</span>';
    h+='</button>';
  }
  h+='</div>';
  /* legend */
  var used={};for(var d2=0;d2<len;d2++)evs(first+d2).forEach(function(e){used[e.k]=1});
  h+='<div class="legend">'+Ev.CAT_ORDER.filter(function(k){return used[k]}).map(function(k){return '<span><i class="dot '+k+'"></i>'+Ev.CATS[k].n+'</span>'}).join('')+'<span style="color:var(--red)">● جمعه و تعطیل</span></div>';
  h+=royalPanel();
  h+=sagePanel(today);
  /* month events */
  var rows='';
  for(var d3=0;d3<len;d3++){var jj=first+d3;evs(jj).forEach(function(e){rows+=evRow(jj,e,{py:y})})}
  h+='<section class="panel"><p class="label">مناسبت‌های '+PM[m-1]+' '+num(impY(y))+'</p>'+(rows||'<p class="sm" style="margin:0">در این ماه مناسبتی ثبت نشده است.</p>')+'</section>';
  h+='<button class="fab" data-a="add-p" aria-label="افزودن یادداشت">'+ic('plus')+'</button>';
  return h;
}

function vYear(){
  var y=st.yearV,start=Cal.pYearStart(y),next=Cal.pYearStart(y+1),g1=Cal.j2g(start),g2=Cal.j2g(next-1);
  var h='<div class="bar"><div><h2>'+num(impY(y))+' شاهنشاهی</h2><div class="sub">'+num(y)+' هجری شمسی · '+num(g1.y)+'–'+num(g2.y)+' میلادی · '+(Cal.isLeapPersian(y)?'سال کبیسه (۳۶۶ روز)':'سال عادی (۳۶۵ روز)')+'</div></div>'+
    '<div class="btns"><button class="ib" data-a="y-prev" aria-label="سال قبل">'+ic('prev')+'</button><button class="txtbtn" data-a="y-today">امسال</button><button class="ib" data-a="y-next" aria-label="سال بعد">'+ic('next')+'</button></div></div>';
  h+='<div class="ygrid">';
  for(var m=1;m<=12;m++){
    var first=Cal.p2j(y,m,1),len=Cal.pMonthLen(y,m),off=firstOffset(first);
    h+='<button class="mini" data-a="open-month" data-y="'+y+'" data-m="'+m+'" aria-label="'+PM[m-1]+' '+num(impY(y))+'"><h4>'+PM[m-1]+'</h4><div class="mg">';
    for(var i=0;i<off;i++)h+='<span></span>';
    for(var d=1;d<=len;d++){
      var j=first+d-1,cl=(j===today?'t ':'')+(Cal.weekday(j)===6||isHol(j)?'h ':'')+(evs(j).length?'e':'');
      h+='<span class="'+cl+'">'+num(d)+'</span>';
    }
    h+='</div></button>';
  }
  return h+'</div>';
}

function vEvents(){
  var h='<div class="bar"><div><h2>رویدادها</h2><div class="sub">مناسبت‌های ایران و دوران پهلوی</div></div></div>';
  h+='<div class="panel"><div class="seg" role="group"><button data-a="ev-mode" data-v="upcoming" aria-pressed="'+(st.evMode==='upcoming')+'">پیش رو</button><button data-a="ev-mode" data-v="year" aria-pressed="'+(st.evMode==='year')+'">همهٔ سال</button><button data-a="ev-mode" data-v="rem" aria-pressed="'+(st.evMode==='rem')+'">یادآوری‌ها</button><button data-a="ev-mode" data-v="task" aria-pressed="'+(st.evMode==='task')+'">کارها</button></div>';
  if(st.evMode==='rem')return h+'</div>'+remView();
  if(st.evMode==='task')return h+'</div>'+taskView();
  h+='<div class="row"><input type="search" id="q" placeholder="جستجو در مناسبت‌ها…" value="'+esc(st.q)+'" aria-label="جستجو"></div>';
  h+='<div class="chips">'+Ev.CAT_ORDER.map(function(k){return '<button class="chip" data-a="cat" data-k="'+k+'" aria-pressed="'+!!S.cats[k]+'"><i class="dot '+k+'"></i>'+Ev.CATS[k].n+'</button>'}).join('')+'</div></div>';
  if(st.evMode==='year'){
    h+='<div class="row tight"><button class="ib" data-a="ev-year" data-v="-1" aria-label="سال قبل">'+ic('prev')+'</button><div class="big-num" style="flex:1;text-align:center">'+num(impY(st.evYear))+' <span class="sm">شاهنشاهی · '+num(st.evYear)+' شمسی</span></div><button class="ib" data-a="ev-year" data-v="1" aria-label="سال بعد">'+ic('next')+'</button></div>';
  }
  h+='<div id="evlist">'+evList()+'</div>';
  return h;
}
function norm(s){return String(s).replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌‏]/g,' ').toLowerCase()}
function evList(){
  var q=norm(st.q.trim()),out='',list;
  if(st.evMode==='upcoming'){
    list=[];
    [tp.y,tp.y+1].forEach(function(py){Ev.yearEvents(py,S.cats).forEach(function(o){if(o.j>=today&&o.j<=today+90)list.push(o)})});
    list.sort(function(a,b){return a.j-b.j});
    if(q)list=list.filter(function(o){return norm(o.e.t).indexOf(q)>=0});
    if(!list.length)return '<p class="empty-msg">'+(q?'موردی پیدا نشد.':'در ۹۰ روز آینده مناسبتی با دسته‌های انتخابی نیست.')+'</p>';
    out='<section class="panel">'+list.map(function(o){return evRow(o.j,o.e,{rel:1})}).join('')+'</section>';
    return out;
  }
  list=Ev.yearEvents(st.evYear,S.cats);
  if(q)list=list.filter(function(o){return norm(o.e.t).indexOf(q)>=0});
  if(!list.length)return '<p class="empty-msg">'+(q?'موردی پیدا نشد.':'مناسبتی با دسته‌های انتخابی نیست.')+'</p>';
  var cur=0,buf='';
  list.forEach(function(o){
    var m=pd(o.j).m;
    if(m!==cur){if(buf)out+=buf+'</section>';cur=m;out+='<div class="mh">'+PM[m-1]+'</div>';buf='<section class="panel">'}
    buf+=evRow(o.j,o.e,{py:st.evYear});
  });
  return out+buf+'</section>';
}





/* ---------- poem / saying of the day ---------- */
var QPOOL=[];PEOPLE.forEach(function(p){(p.q||[]).forEach(function(q){QPOOL.push({p:p,t:q[0],s:q[1]})})});
function quoteHtml(t,s,who){
  return '<blockquote class="vq">'+t.split(' / ').map(esc).join('<br>')+'</blockquote><div class="vs">'+esc(who)+(s?' · '+esc(s):'')+'</div>';
}
function sagePanel(j,onlyMatch){
  var q=Cal.j2p(j),hit=PEOPLE.filter(function(p){return p.m===q.m&&p.d===q.d});
  var h='';
  if(hit.length){
    h+='<section class="panel sage"><div class="label">'+(j===today?'امروز':'این روز')+' در تقویم شاعر، دانشمند، فیلسوف و عارف</div>'+hit.slice(0,3).map(function(p){
      var who=p.n+' ('+p.r+')',head='<div class="vh">'+esc(p.e+' '+p.n)+'</div>';
      var body=p.q&&p.q.length?quoteHtml(p.q[Math.abs(j+q.y)%p.q.length][0],p.q[Math.abs(j+q.y)%p.q.length][1],p.n):'';
      return head+body+'<div class="sm">'+esc(p.b)+'</div>';
    }).join('<hr class="sep">')+'</section>';
    return h;
  }
  if(onlyMatch||!QPOOL.length)return '';
  var it=QPOOL[((j%QPOOL.length)+QPOOL.length)%QPOOL.length];
  return '<section class="panel sage"><div class="label">شعر و سخن روز</div>'+quoteHtml(it.t,it.s,it.p.n)+'</section>';
}

/* ---------- Pahlavi dynasty births / deaths under the calendar ---------- */
function royalPanel(){
  var list=evs(today).filter(function(e){return e.k==='royal'||e.k==='kings'});
  var py=pd(today).y,h='';
  if(list.length){
    h+='<section class="panel royal"><div class="label">امروز در تقویم خاندان پهلوی و شاه ایران</div>'+list.map(function(e){
      var on=originNote(e,py);
      return '<div class="rt"><b>'+esc(e.t)+'</b>'+(on?'<small>'+on+'</small>':'')+'</div>';
    }).join('')+'</section>';
    return h;
  }
  var best=null;
  [py,py+1].forEach(function(y){Ev.yearEvents(y,S.cats).forEach(function(o){if(o.e.k==='royal'&&o.j>today&&(!best||o.j<best.j))best=o})});
  if(!best)return '';
  return '<section class="panel royal"><div class="label">نزدیک‌ترین مناسبت خاندان پهلوی</div><div class="rt"><b>'+esc(best.e.t)+'</b><small>'+relText(best.j)+' · '+num(pd(best.j).d)+' '+PM[pd(best.j).m-1]+'</small></div></section>';
}

/* ---------- tasks ---------- */
function chkBtn(id,j){var dn=Ev.isDone(id,j);return '<button class="chk" data-a="tdone" data-id="'+esc(id)+'" data-j="'+j+'" aria-pressed="'+dn+'" aria-label="انجام شد"><svg viewBox="0 0 24 24" class="ic"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>'}
function taskRow(o,withDate){
  var p=pd(o.j);
  return '<div class="ev"><i class="bar-c personal"></i>'+(withDate?'<div class="d"><b>'+num(p.d)+'</b><span>'+PM[p.m-1]+'</span></div>':'')+'<div class="t"><div class="ti">'+chkBtn(o.e.id,o.j)+esc(o.e.t)+'</div>'+(o.e.note?'<small>'+esc(o.e.note)+'</small>':'')+'</div></div>';
}
function tasksBetween(a,b){
  var out=[];
  [tp.y,tp.y+1].forEach(function(py){Ev.yearEvents(py,{personal:true}).forEach(function(o){if(o.e.task&&o.j>=a&&o.j<=b)out.push(o)})});
  out.sort(function(x,y){return x.j-y.j});return out;
}
function taskPanel(){
  var l=tasksBetween(today,today);if(!l.length)return '';
  var left=l.filter(function(o){return !Ev.isDone(o.e.id,o.j)}).length;
  return '<section class="panel"><div class="label">کارهای امروز · '+(left?num(left)+' کار مانده':'همه انجام شد ✓')+'</div>'+l.map(function(o){return taskRow(o,false)}).join('')+'</section>';
}
function taskView(){
  var h='<div class="row"><button class="btn" data-a="add-p" data-task="1">افزودن کار</button></div>';
  var groups=[['امروز',today,today],['فردا',today+1,today+1],['۷ روز آینده',today+2,today+8]],any=false;
  groups.forEach(function(g){var l=tasksBetween(g[1],g[2]);if(!l.length)return;any=true;h+='<div class="mh">'+g[0]+'</div><section class="panel">'+l.map(function(o){return taskRow(o,g[0]==='۷ روز آینده')}).join('')+'</section>'});
  if(!any)h+='<p class="empty-msg">کاری برای این هفته نیست. با «افزودن کار» یک کار روزانه، هفتگی یا ماهانه بسازید.</p>';
  return h;
}

/* ---------- reminders ---------- */
function remList(horizon){
  var out=[];
  [tp.y,tp.y+1].forEach(function(py){Ev.yearEvents(py,{personal:true}).forEach(function(o){
    if(o.e.rm<0)return;var rj=o.j-o.e.rm;
    if(o.j>=today&&rj<=today+horizon)out.push({j:o.j,rj:rj,e:o.e});
  })});
  out.sort(function(a,b){return a.rj-b.rj||a.j-b.j});
  return out;
}
function remRow(o){
  var due=o.rj<=today,p=pd(o.j);
  return '<div class="ev"><i class="bar-c personal"></i><div class="d"><b>'+num(p.d)+'</b><span>'+PM[p.m-1]+'</span></div><div class="t"><div class="ti">'+esc(o.e.t)+(due?'<span class="tag hol">'+(o.j===today?'امروز':'در راه')+'</span>':'')+'</div>'+
    '<small>'+relText(o.j)+' · یادآوری: '+(o.e.rm?num(o.e.rm)+' روز قبل':'همان روز')+' ساعت '+remTime(o.e.rt)+'</small>'+(o.e.note?'<small>'+esc(o.e.note)+'</small>':'')+
    ' <button class="btn ghost sm" data-a="edit-p" data-id="'+esc(o.e.id)+'" data-j="'+o.j+'">ویرایش</button></div></div>';
}
function remTime(t){var a=String(t||'09:00').split(':');return '\u2066'+num((a[0].length<2?'0':'')+a[0])+':'+num(a[1]||'00')+'\u2069'}
function remPanel(){
  var due=remList(0);if(!due.length)return '';
  return '<section class="panel tun-today"><div class="label">یادآوری‌های پیش رو</div>'+due.map(remRow).join('')+'</section>';
}
function remView(){
  var h='<div class="row"><button class="btn" data-a="add-p">افزودن یادآوری</button></div>';
  var list=remList(365);
  if(!list.length)h+='<p class="empty-msg">یادآوری فعالی نیست. هنگام افزودن یادداشت، «زمان یادآوری» را انتخاب کنید.</p>';
  else h+='<section class="panel">'+list.slice(0,60).map(remRow).join('')+'</section>'+(list.length>60?'<p class="note">'+num(list.length-60)+' مورد دیگر نمایش داده نشد.</p>':'');
  h+='<section class="panel"><p class="label">اعلان و تقویم گوشی</p><p class="note" style="margin-top:0">با باز بودن برنامه، یادآوری سر وقت اعلان می‌شود. مرورگرها اجازهٔ اعلان در زمانی که برنامه بسته است را به برنامه‌های وب نمی‌دهند؛ برای یادآوری مطمئن، یادآوری‌ها را به تقویم گوشی بفرستید.</p><div class="row tight"><button class="btn sm" data-a="notify">'+((window.Notification&&Notification.permission==='granted')?'اعلان‌ها روشن است':'روشن‌کردن اعلان‌ها')+'</button><button class="btn ghost sm" data-a="ics-rem">یادآوری‌ها در تقویم گوشی (ICS)</button></div></section>';
  return h;
}
function askNotify(){try{if(window.Notification&&Notification.permission==='default')Notification.requestPermission().then(function(){checkReminders(true)})}catch(e){}}
function checkReminders(){
  var nowM=new Date().getHours()*60+new Date().getMinutes();
  var due=remList(0).filter(function(o){var t=String(o.e.rt||'09:00').split(':');return o.rj<today||(o.rj===today&&nowM>=(+t[0]*60+(+t[1]||0)))});if(!due.length)return;
  var seen={};try{seen=JSON.parse(localStorage.getItem('taghvim-notified')||'{}')}catch(e){}
  var fresh=due.filter(function(o){return !seen[o.e.id+':'+o.j+':'+today]});if(!fresh.length)return;
  fresh.forEach(function(o){seen[o.e.id+':'+o.j+':'+today]=1});
  try{localStorage.setItem('taghvim-notified',JSON.stringify(seen))}catch(e){}
  var msg=fresh.map(function(o){return o.e.t+' — '+(o.j===today?'امروز':relText(o.j))}).join('\n');
  toast('یادآوری: '+fresh[0].e.t+(fresh.length>1?' و '+num(fresh.length-1)+' مورد دیگر':''));
  try{if(window.Notification&&Notification.permission==='granted'){
    if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(function(r){r.showNotification('تقویم شاهنشاهی',{body:msg,icon:'icons/icon-192.png',tag:'taghvim-rem-'+today})});
    else new Notification('تقویم شاهنشاهی',{body:msg});
  }}catch(e){}
}

/* ---------- time tunnel ---------- */
var ERAS={all:['همهٔ دوران','۲۴۷۹–۲۵۳۷'],r:['رضاشاه بزرگ','۲۴۷۹–۲۵۰۰'],m:['محمدرضاشاه','۲۵۰۰–۲۵۳۷']};
function vTunnel(){
  var h='<div class="bar"><div><h2>تونل زمان</h2><div class="sub">دستاوردهای دورهٔ پهلوی، سال به سال</div></div></div>';
  var tdy=Cal.j2p(today),hit=TUNNEL.filter(function(e){return e.m===tdy.m&&e.d===tdy.d});
  if(hit.length)h+='<section class="panel tun-today"><div class="label">امروز در تونل زمان · '+num(tdy.d)+' '+PM[tdy.m-1]+'</div>'+hit.map(tunItem).join('')+'</section>';
  h+='<div class="panel"><div class="seg" role="group">'+['all','r','m'].map(function(k){return '<button data-a="tr" data-v="'+k+'" aria-pressed="'+(st.tr===k)+'">'+ERAS[k][0]+'<br><span class="sm">'+ERAS[k][1]+'</span></button>'}).join('')+'</div>';
  h+='<div class="chips" style="margin-top:10px">'+Object.keys(TUNNEL_CATS).map(function(k){return '<button class="chip" data-a="tc" data-k="'+k+'" aria-pressed="'+(st.tc[k]!==false)+'">'+TUNNEL_CATS[k]+'</button>'}).join('')+'</div></div>';
  var list=TUNNEL.filter(function(e){return (st.tr==='all'||e.r===st.tr)&&st.tc[e.c]!==false}).sort(function(a,b){return a.y-b.y||((a.m||0)-(b.m||0))||((a.d||0)-(b.d||0))});
  if(!list.length)h+='<p class="empty-msg">موردی با این فیلتر نیست.</p>';
  var cur=0,buf='';
  list.forEach(function(e){
    var dec=Math.floor(impY(e.y)/10)*10;
    if(dec!==cur){if(buf)h+=buf+'</section>';cur=dec;h+='<div class="mh">دههٔ '+num(dec)+'</div>';buf='<section class="panel tun">'}
    buf+=tunItem(e);
  });
  if(buf)h+=buf+'</section>';
  h+='<p class="note">این فهرست دستاوردهای دورهٔ پهلوی است. همهٔ سال‌ها به شاهنشاهی نوشته شده‌اند.</p>';
  return h;
}
function tunItem(e){
  var dt=e.m?num(e.d)+' '+PM[e.m-1]+' ':'';
  return '<div class="ev tl"><i class="bar-c '+(({pol:'royal',dip:'kings',soc:'nat',eco:'ancient',cul:'culture'})[e.c])+'"></i><div class="d"><b>'+num(impY(e.y))+'</b><span>شاهنشاهی</span></div><div class="t"><div class="ti">'+esc(e.t)+'</div><small>'+dt+num(impY(e.y))+' شاهنشاهی · '+TUNNEL_CATS[e.c]+'</small><div class="tx">'+esc(e.x)+'</div></div></div>';
}

/* ---------- date input group ---------- */
var CALS=[['imp','شاهنشاهی'],['sh','شمسی'],['g','میلادی'],['h','قمری']];
function monthNames(cal){return cal==='g'?GM:cal==='h'?HM:PM}
function jToCal(j,cal){
  if(cal==='g'){var g=Cal.j2g(j);return {y:g.y,m:g.m,d:g.d}}
  if(cal==='h')return Cal.j2h(j);
  var p=pd(j);return {y:cal==='imp'?impY(p.y):p.y,m:p.m,d:p.d};
}
function calToJ(cal,y,m,d){
  if(cal==='g')return Cal.g2j(y,m,d);
  if(cal==='h')return Cal.h2j(y,m,d);
  return Cal.p2j(cal==='imp'?y-Cal.IMPERIAL_OFFSET:y,m,d);
}
function validCal(cal,y,m,d){
  if(!(y>0&&m>=1&&m<=12&&d>=1&&d<=31))return false;
  var j=calToJ(cal,y,m,d),b=jToCal(j,cal);
  return b.y===y&&b.m===m&&b.d===d;
}
function dateGroup(id,j,cal){
  var v=jToCal(j,cal),names=monthNames(cal);
  return '<div class="row" data-grp="'+id+'"><input type="number" inputmode="numeric" id="'+id+'y" value="'+v.y+'" aria-label="سال" style="max-width:96px"><select id="'+id+'m" aria-label="ماه">'+
    names.map(function(n,i){return '<option value="'+(i+1)+'"'+(i+1===v.m?' selected':'')+'>'+n+'</option>'}).join('')+'</select><input type="number" inputmode="numeric" id="'+id+'d" value="'+v.d+'" min="1" max="31" aria-label="روز" style="max-width:76px"></div>';
}
function readGroup(id,cal){
  var y=parseInt($('#'+id+'y').value,10),m=parseInt($('#'+id+'m').value,10),d=parseInt($('#'+id+'d').value,10);
  if(!validCal(cal,y,m,d))return null;
  return calToJ(cal,y,m,d);
}
function resCards(j){
  var es=evs(j);
  return '<div class="card"><div><b>'+wdName(j)+'</b><span>'+seasonOf(pd(j).m)+' · روز '+num(Cal.dayOfYear(j))+' سال'+'</span></div><span>'+relText(j)+'</span></div>'+
    '<div class="card"><div><b>'+impStr(j)+'</b><span>تقویم شاهنشاهی</span></div></div>'+
    '<div class="card"><div><b>'+shStr(j)+'</b><span>تقویم هجری شمسی</span></div></div>'+
    '<div class="card"><div><b>'+gStr(j)+'</b><span>تقویم میلادی</span></div></div>'+
    '<div class="card"><div><b>'+hStr(j)+'</b><span>تقویم هجری قمری (جدول ایران، تقریبی)</span></div></div>'+
    (es.length?'<div class="card"><div><b>'+esc(es.map(function(e){return e.t}).join('، '))+'</b><span>مناسبت‌ها</span></div></div>':'');
}
function calSeg(cur){return '<div class="seg" role="group" aria-label="نوع تقویم">'+CALS.map(function(c){return '<button data-a="conv-cal" data-v="'+c[0]+'" aria-pressed="'+(cur===c[0])+'">'+c[1]+'</button>'}).join('')+'</div>'}

function vTools(){
  var h='<div class="bar"><div><h2>ابزارها</h2><div class="sub">تبدیل تاریخ، فاصله، نجوم</div></div></div>';
  h+='<div class="seg" role="group"><button data-a="tools" data-v="convert" aria-pressed="'+(st.tools==='convert')+'">تبدیل تاریخ</button><button data-a="tools" data-v="dist" aria-pressed="'+(st.tools==='dist')+'">فاصله دو تاریخ</button><button data-a="tools" data-v="astro" aria-pressed="'+(st.tools==='astro')+'">نجوم</button></div>';
  if(st.tools==='convert'){
    var cal=st.conv.cal,j=st.conv.j||today;
    h+='<section class="panel"><p class="label">تاریخ را در تقویم دلخواه وارد کنید</p>'+calSeg(cal)+dateGroup('c',j,cal)+
      '<div class="row tight"><button class="btn" data-a="conv-go">تبدیل</button><button class="btn ghost" data-a="conv-today">امروز</button></div><div class="res" id="cres">'+resCards(j)+'</div>'+
      '<p class="note">برای تاریخ‌های پیش از ۲۴۸۴ شاهنشاهی از قاعدهٔ امروزی (لحظهٔ اعتدال بهاری) استفاده می‌شود؛ ممکن است با منابع تاریخی یک یا دو روز تفاوت داشته باشد.</p></section>';
  }else if(st.tools==='dist'){
    var cal2=st.conv.cal,a=st.dist.a||today,b=st.dist.b||today+100;
    h+='<section class="panel"><p class="label">نوع تقویم برای ورودی و حساب سال و ماه</p>'+calSeg(cal2)+
      '<p class="label" style="margin-top:12px">از تاریخ</p>'+dateGroup('a',a,cal2)+'<p class="label">تا تاریخ</p>'+dateGroup('b',b,cal2)+
      '<div class="row tight"><button class="btn" data-a="dist-go">محاسبه</button></div><div class="res" id="dres">'+distHTML(a,b,cal2)+'</div></section>';
  }else{
    h+=vAstro();
  }
  return h;
}
function distHTML(a,b,cal){
  if(a>b){var t=a;a=b;b=t}
  var days=b-a,x=jToCal(a,cal),y=jToCal(b,cal);
  var yy=y.y-x.y,mm=y.m-x.m,dd=y.d-x.d;
  if(dd<0){mm--;var pm=y.m-1,py2=y.y;if(pm<1){pm=12;py2--}
    var ml=cal==='g'?Cal.gMonthLen(py2,pm):cal==='h'?30:Cal.pMonthLen(cal==='imp'?py2-Cal.IMPERIAL_OFFSET:py2,pm);dd+=ml}
  if(mm<0){yy--;mm+=12}
  var work=0,cnt=0;
  if(days<=7300){for(var j=a;j<b;j++){cnt++;if(!isHol(j))work++}}
  return '<div class="card"><div><div class="big-num">'+num(days)+' روز</div><span>'+num(Math.floor(days/7))+' هفته و '+num(days%7)+' روز</span></div></div>'+
    '<div class="card"><div><b>'+num(yy)+' سال، '+num(mm)+' ماه و '+num(dd)+' روز</b><span>بر پایهٔ تقویم '+CALS.filter(function(c){return c[0]===cal})[0][1]+'</span></div></div>'+
    (cnt?'<div class="card"><div><b>'+num(work)+' روز کاری</b><span>بدون جمعه‌ها و تعطیلی‌های رسمی انتخابی (بازهٔ نیم‌باز)</span></div></div>':'');
}

function vAstro(){
  var py=st.astroY,gy=py+621,seasons=['spring','summer','autumn','winter'],h='';
  var nn=nextNowruz();
  h+='<section class="panel"><p class="label">شمارش معکوس تحویل سال '+num(impY(nn.py))+' شاهنشاهی</p><div class="big-num" id="cd" aria-live="off">…</div><div class="sm" id="cd-sub"></div></section>';
  h+='<div class="row tight"><button class="ib" data-a="astro-y" data-v="-1" aria-label="سال قبل">'+ic('prev')+'</button><div class="big-num" style="flex:1;text-align:center">'+num(impY(py))+' <span class="sm">شاهنشاهی · '+num(py)+' شمسی</span></div><button class="ib" data-a="astro-y" data-v="1" aria-label="سال بعد">'+ic('next')+'</button></div>';
  h+='<section class="panel"><p class="label">لحظهٔ آغاز فصل‌ها در سال '+num(py)+' (به وقت تهران و ساعت دستگاه)</p><div class="res">';
  seasons.forEach(function(s){
    var ms=Astro.season(s,s==='spring'?gy:gy), j=msJ(ms,'tehran'),pp=pd(j);
    h+='<div class="card"><div><b>'+SEASON_NAMES[s]+'</b><span>'+num(pp.d)+' '+PM[pp.m-1]+' '+num(impY(pp.y))+' · '+gStr(j)+'</span></div><div style="text-align:left"><b>'+msClock(ms,'tehran',true)+'</b><span>تهران'+(S.tz==='device'?' · دستگاه '+msClock(ms,'device'):'')+'</span></div></div>';
  });
  h+='</div><p class="note">محاسبه بر پایهٔ نظریهٔ VSOP87 با دقت کمتر از یک ثانیه. تحویل سال پیش از ظهر تهران، همان روز را آغاز سال می‌کند و پس از ظهر، روز بعد را.</p></section>';
  /* moon phases of selected Persian month */
  var cm=st.cur,first=Cal.p2j(cm.y,cm.m,1),last=first+Cal.pMonthLen(cm.y,cm.m)-1;
  var ph=Astro.phasesBetween(dayNoonMs(first)-43200000,dayNoonMs(last)+43200000);
  h+='<section class="panel"><p class="label">فازهای ماه در '+PM[cm.m-1]+' '+num(impY(cm.y))+'</p><div class="res">'+ph.map(function(o){
    var j=msToJ(o.t);
    return '<div class="card"><div style="display:flex;gap:10px;align-items:center">'+moonSVG(o.p/4,28)+'<div><b>'+Astro.PHASE_NAMES[o.p]+'</b><span>'+wdName(j)+' '+shortLabel(j)+'</span></div></div><b>'+msClock(o.t,S.tz==='tehran'?'tehran':'device')+'</b></div>';
  }).join('')+'</div><p class="note">ماه را از تب «ماه» عوض کنید. زمان‌ها تقریبی و در حد چند دقیقه‌اند.</p></section>';
  return h;
}
function tickCountdown(){
  var el=$('#cd');if(!el){return}
  var nn=nextNowruz(),diff=nn.ms-Date.now();
  if(diff<0)diff=0;
  var d=Math.floor(diff/86400000),hh=Math.floor(diff/3600000)%24,mm=Math.floor(diff/60000)%60,ss=Math.floor(diff/1000)%60;
  el.textContent=num(d)+' روز و '+hhmm(hh,mm,ss);
  var sub=$('#cd-sub');if(sub)sub.textContent='لحظهٔ تحویل: '+shStr(msJ(nn.ms,'tehran'))+' ساعت '+msClock(nn.ms,'tehran',true)+' به وقت تهران';
}

function vSettings(){
  function sw(id,label,on){return '<label class="switch"><span>'+label+'</span><input type="checkbox" data-a="set" data-k="'+id+'" '+(on?'checked':'')+'></label>'}
  var h='<div class="bar"><div><h2>تنظیمات</h2><div class="sub">ظاهر، دسته‌ها، پشتیبان</div></div></div>';
  h+='<section class="panel"><p class="label">پوسته</p><div class="seg" role="group"><button data-a="theme" data-v="auto" aria-pressed="'+(S.theme==='auto')+'">خودکار</button><button data-a="theme" data-v="light" aria-pressed="'+(S.theme==='light')+'">روشن</button><button data-a="theme" data-v="dark" aria-pressed="'+(S.theme==='dark')+'">تیره</button></div>'+
    '<p class="label" style="margin-top:14px">ارقام</p><div class="seg" role="group"><button data-a="digits" data-v="fa" aria-pressed="'+(S.digits==='fa')+'">فارسی ۱۲۳</button><button data-a="digits" data-v="lat" aria-pressed="'+(S.digits==='lat')+'">لاتین 123</button></div>'+
    '<p class="label" style="margin-top:14px">آغاز هفته</p><div class="seg" role="group"><button data-a="wstart" data-v="0" aria-pressed="'+(S.weekStart===0)+'">شنبه</button><button data-a="wstart" data-v="1" aria-pressed="'+(S.weekStart===1)+'">یکشنبه</button><button data-a="wstart" data-v="2" aria-pressed="'+(S.weekStart===2)+'">دوشنبه</button></div>'+
    '<p class="label" style="margin-top:14px">منطقهٔ زمانی فازهای ماه</p><div class="seg" role="group"><button data-a="tz" data-v="device" aria-pressed="'+(S.tz==='device')+'">ساعت دستگاه</button><button data-a="tz" data-v="tehran" aria-pressed="'+(S.tz==='tehran')+'">وقت تهران</button></div>'+
    '<div style="margin-top:8px">'+sw('showG','نمایش تاریخ میلادی در خانه‌ها',S.showG)+sw('showMoon','نمایش ماه و فازها',S.showMoon)+sw('showHijri','نمایش تاریخ قمری در بالای صفحه',S.showHijri)+'</div></section>';
  h+='<section class="panel"><p class="label">دسته‌های مناسبت</p><div class="chips">'+Ev.CAT_ORDER.map(function(k){return '<button class="chip" data-a="cat" data-k="'+k+'" aria-pressed="'+!!S.cats[k]+'"><i class="dot '+k+'"></i>'+Ev.CATS[k].n+'</button>'}).join('')+'</div>'+
    '<p class="note">مناسبت‌های مربوط به پس از ۱۳۵۷ در این برنامه نیست. دسته‌های «مذهبی (قمری)» و «جهانی» به‌صورت پیش‌فرض خاموش‌اند.</p></section>';
  h+='<section class="panel"><p class="label">خروجی و پشتیبان</p><div class="row tight"><button class="btn sm" data-a="ics">خروجی برای تقویم گوشی (ICS)</button><button class="btn ghost sm" data-a="bk-export">پشتیبان یادداشت‌ها</button><label class="btn ghost sm" for="bk-file" style="display:inline-flex;align-items:center">بازیابی<input type="file" id="bk-file" accept=".json,application/json" hidden></label></div>'+
    '<p class="note">فایل ICS مناسبت‌های دسته‌های روشن را برای پنج سال به‌صورت رویدادهای تمام‌روزه می‌سازد و با Google Calendar یا برنامهٔ تقویم گوشی باز می‌شود.</p></section>';
  if(installEv)h+='<section class="panel"><p class="label">نصب</p><button class="btn" data-a="install">نصب روی صفحهٔ اصلی</button></section>';
  h+='<section class="panel about"><div class="logo"><img src="logo.png" alt="Lion and Sun – Architecture Studio"></div><p><b>تقویم شاهنشاهی</b> · نسخه B25</p><p>طراح و سازنده: <b>بابک محمدزاده</b></p><p>Architecture Studio Lion and Sun</p><p><a class="site" href="https://www.lion-sun.de" target="_blank" rel="noopener">www.lion-sun.de</a></p></section>';
  h+='<section class="panel"><p class="label">منابع و سپاس</p><div class="credit">سال شاهنشاهی = سال هجری شمسی + ۱۱۸۰ (مبدأ: تاجگذاری کوروش بزرگ؛ رسمی از ۲۴ اسفند ۱۳۵۴ تا ۵ شهریور ۱۳۵۷).<br>'+
    'جدول سال‌های کبیسه ۱۳۰۴ تا ۱۴۹۸: مرکز تقویم مؤسسهٔ ژئوفیزیک دانشگاه تهران.<br>'+
    'جدول ماه‌های قمری ایران: داده‌های Qamari (روزبه پورنادر) و پروژهٔ تقویم فارسی.<br>'+
    'لحظهٔ اعتدال و انقلاب: کتابخانهٔ equinox با مجوز MIT، بر پایهٔ VSOP87 و IAU2000B (پروژهٔ تقویم فارسی اندروید).<br>'+
    'جشن‌های باستانی ایران: داده‌های آزاد (CC0) پروژهٔ events و StarCal.<br>'+
    'فازهای ماه: الگوریتم‌های Jean Meeus.</div></section>';
  return h;
}

/* ====================== sheets ====================== */
function openSheet(html){
  $('#sheetRoot').innerHTML='<div class="scrim" data-a="close"></div><section class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>'+html+'</section>';
  if(!sheetOpen){sheetOpen=true;try{history.pushState({sheet:1},'')}catch(e){}}
}
function closeSheet(noRender){
  $('#sheetRoot').innerHTML='';st.sel=null;
  if(sheetOpen){sheetOpen=false;try{if(history.state&&history.state.sheet)history.back()}catch(e){}}
  if(!noRender)render(true);
}
window.addEventListener('popstate',function(){if(sheetOpen){sheetOpen=false;$('#sheetRoot').innerHTML='';st.sel=null;render(true)}});

function daySheet(j){
  var es=evs(j),p=pd(j),ms=dayNoonMs(j),mo=Astro.moonState(ms);
  var h='<h3>'+wdName(j)+' '+num(p.d)+' '+PM[p.m-1]+'</h3><div class="sm">'+num(impY(p.y))+' شاهنشاهی · '+relText(j)+(isHol(j)?' · <span style="color:var(--red)">تعطیل</span>':'')+'</div>';
  h+='<div class="dl"><div><span>شاهنشاهی</span><b>'+impStr(j)+'</b></div><div><span>هجری شمسی</span><b>'+shStr(j)+'</b></div><div><span>میلادی</span><b>'+gStr(j)+'</b></div><div><span>هجری قمری</span><b>'+hStr(j)+'</b></div>'+
    '<div><span>روز سال / هفتهٔ سال</span><b>'+num(Cal.dayOfYear(j))+' / '+num(Cal.weekOfYear(j,S.weekStart))+'</b></div><div><span>فصل</span><b>'+seasonOf(p.m)+'</b></div></div>';
  if(S.showMoon)h+='<div class="moonrow">'+moonSVG(mo.frac,44)+'<div><b>'+moonName(mo.frac)+'</b><div class="sm">سن ماه ≈ '+num(Math.round(mo.age*10)/10)+' روز · روشنایی ≈ '+num(Math.round(mo.illum*100))+'٪</div></div></div>';
  h+='<p class="label" style="margin-top:12px">مناسبت‌ها</p>'+(es.length?es.map(function(e){return evRow(j,e,{noDate:1,py:p.y})}).join(''):'<p class="sm" style="margin:0 0 6px">برای این روز مناسبتی ثبت نشده است.</p>');
  h+=sagePanel(j,true).replace('class="panel sage"','class="sage in"');
  h+='<div class="row tight" style="margin-top:12px"><button class="btn" data-a="add-p" data-j="'+j+'">افزودن یادداشت</button><button class="btn ghost" data-a="share-day" data-j="'+j+'">'+ic('share')+'</button><button class="btn ghost" data-a="conv-this" data-j="'+j+'">تبدیل</button><button class="btn ghost" data-a="close">بستن</button></div>';
  openSheet(h);
}
function pickerSheet(){
  var y=st.cur.y,h='<h3>رفتن به ماه و سال</h3><div class="row tight" style="justify-content:center"><button class="ib" data-a="pk-y" data-v="-1" aria-label="سال قبل">'+ic('prev')+'</button><div class="big-num" style="min-width:160px;text-align:center" id="pk-year">'+num(impY(y))+'</div><button class="ib" data-a="pk-y" data-v="1" aria-label="سال بعد">'+ic('next')+'</button></div>'+
    '<div class="sm" style="text-align:center" id="pk-sub">'+num(y)+' شمسی</div><div class="pick">';
  for(var m=1;m<=12;m++)h+='<button data-a="pk-m" data-m="'+m+'" aria-pressed="'+(m===st.cur.m)+'">'+PM[m-1]+'</button>';
  h+='</div><div class="row tight"><button class="btn ghost" data-a="pk-today">همین ماه</button><button class="btn ghost" data-a="close">بستن</button></div>';
  openSheet(h);
}
var pkY=0;
function personalSheet(opts){
  opts=opts||{};
  var p=opts.p,j=opts.j||today,uj=p&&Ev.recOf(p)!=='year',cal=p?(uj?(p.cal||'p'):p.c):'i',rec=p?Ev.recOf(p):'once';
  if(cal==='p')cal='i';
  var v=p&&!uj?{y:0,m:p.m,d:p.d}:jToCal(p&&uj?p.j:j,cal==='g'?'g':'imp');
  var ev0=p&&p.ej?jToCal(p.ej,cal==='g'?'g':'imp'):null;
  var names=cal==='g'?GM:PM;
  var h='<h3>'+(p?'ویرایش یادداشت':'یادداشت یا مناسبت شخصی')+'</h3>'+
    '<div class="row"><input type="text" id="pt" placeholder="عنوان (مثلاً تولد، قسط، قرارداد)" value="'+esc(p?p.t:'')+'" aria-label="عنوان" maxlength="120"></div>'+
    '<p class="label">تاریخ</p><div class="seg" role="group"><button data-a="p-cal" data-v="i" aria-pressed="'+(cal==='i')+'">شاهنشاهی</button><button data-a="p-cal" data-v="p" aria-pressed="'+(cal==='p')+'">شمسی</button><button data-a="p-cal" data-v="g" aria-pressed="'+(cal==='g')+'">میلادی</button></div>'+
    '<div class="row" id="pdate"><input type="number" inputmode="numeric" id="py" value="'+(p&&!uj?'':v.y)+'" placeholder="سال" aria-label="سال" style="max-width:96px"><select id="pm">'+names.map(function(n,i){return '<option value="'+(i+1)+'"'+(i+1===v.m?' selected':'')+'>'+n+'</option>'}).join('')+'</select><input type="number" inputmode="numeric" id="pd" value="'+v.d+'" min="1" max="31" aria-label="روز" style="max-width:76px"></div>'+
    '<p class="label">تکرار</p><div class="row"><select id="prec" aria-label="تکرار">'+[['once','یک‌بار'],['day','هر روز'],['week','هر هفته'],['month','هر ماه'],['year','هر سال']].map(function(o){return '<option value="'+o[0]+'"'+(rec===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></div>'+
    '<p class="sm" style="margin:0 0 4px">پایان تکرار (اختیاری، برای روزانه / هفتگی / ماهانه)</p><div class="row"><input type="number" inputmode="numeric" id="ey" value="'+(ev0?ev0.y:'')+'" placeholder="سال" aria-label="سال پایان" style="max-width:96px"><input type="number" inputmode="numeric" id="em" value="'+(ev0?ev0.m:'')+'" placeholder="ماه (عدد)" aria-label="ماه پایان" style="max-width:110px"><input type="number" inputmode="numeric" id="ed" value="'+(ev0?ev0.d:'')+'" placeholder="روز" aria-label="روز پایان" style="max-width:80px"></div>'+
    '<label class="switch"><span>این یک «کار» است (تیک‌خور)</span><input type="checkbox" id="ptask" '+((p?p.task:opts.task)?'checked':'')+'></label>'+
    '<p class="label">یادآوری</p><div class="row"><select id="prm" aria-label="زمان یادآوری">'+[[-1,'بدون یادآوری'],[0,'همان روز'],[1,'۱ روز قبل'],[2,'۲ روز قبل'],[3,'۳ روز قبل'],[7,'یک هفته قبل']].map(function(o){return '<option value="'+o[0]+'"'+((p&&p.rm>=0?p.rm:-1)===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select><input type="time" id="prt" value="'+esc(p&&p.rt?p.rt:'09:00')+'" aria-label="ساعت یادآوری" style="max-width:120px"></div>'+
    '<div class="row"><textarea id="pn" placeholder="توضیح (اختیاری)" aria-label="توضیح">'+esc(p&&p.note?p.note:'')+'</textarea></div>'+
    '<div class="row tight"><button class="btn" data-a="p-save" data-id="'+(p?esc(p.id):'')+'">ذخیره</button>'+(p?'<button class="btn danger" data-a="p-del" data-id="'+esc(p.id)+'">حذف</button>':'')+'<button class="btn ghost" data-a="close">انصراف</button></div>';
  st.pcal=cal;
  openSheet(h);
}

/* ====================== render ====================== */

function footerBlock(){
  var bk=st.tab==='settings'?'':'<section class="panel bkp"><p class="label">پشتیبان‌گیری</p><p class="sm" style="margin:0 0 8px">یادداشت‌ها و تنظیمات شما فقط روی همین دستگاه ذخیره می‌شود؛ از آن‌ها پشتیبان بگیرید.</p><div class="row tight"><button class="btn sm" data-a="bk-export">ذخیرهٔ پشتیبان</button><label class="btn ghost sm" for="bk-file" style="display:inline-flex;align-items:center">بازیابی از فایل<input type="file" id="bk-file" accept=".json,application/json" hidden></label></div></section>';
  return bk+'<footer class="credit"><img src="logo.png" alt=""><div><b>طراح: بابک محمدزاده</b><span>Architecture Studio Lion and Sun</span><a class="site" href="https://www.lion-sun.de" target="_blank" rel="noopener">www.lion-sun.de</a></div></footer>';
}
var TABS=[['month','month','ماه'],['year','year','سال'],['events','star','رویدادها'],['tunnel','tunnel','تونل زمان'],['tools','tools','ابزار'],['settings','gear','تنظیمات']];
function render(keepScroll){
  var y0=window.scrollY,v=$('#app');
  var fn={month:vMonth,year:vYear,events:vEvents,tunnel:vTunnel,tools:vTools,settings:vSettings}[st.tab];
  v.innerHTML='<div class="view">'+fn()+footerBlock()+'</div>';
  $('#tabs').innerHTML=TABS.map(function(t){return '<button data-a="tab" data-t="'+t[0]+'" aria-current="'+(st.tab===t[0])+'">'+ic(t[1])+t[2]+'</button>'}).join('');
  st.dir='';
  clearInterval(timer);
  if(st.tab==='tools'&&st.tools==='astro'){tickCountdown();timer=setInterval(tickCountdown,1000)}
  if(keepScroll)window.scrollTo(0,y0);
}

/* ====================== actions ====================== */
function shiftMonth(dm){
  var m=st.cur.m+dm,y=st.cur.y;
  if(m<1){m=12;y--}else if(m>12){m=1;y++}
  st.cur={y:y,m:m};st.dir=dm>0?'r':'l';render();
}
function download(name,text,type){
  try{
    var blob=new Blob([text],{type:type+';charset=utf-8'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;
    document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500);
    toast('فایل ذخیره شد.');
  }catch(e){toast('ذخیره فایل انجام نشد.')}
}
function shareText(j){
  var es=evs(j),t=wdName(j)+' '+impStr(j)+'\n'+shStr(j)+'\n'+gStr(j)+(es.length?'\n'+es.map(function(e){return '• '+e.t}).join('\n'):'');
  if(navigator.share){navigator.share({text:t}).catch(function(){})}
  else if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){toast('کپی شد.')},function(){toast('کپی انجام نشد.')})}
}
function act(a,el,ev){
  var d=el?el.dataset:{};
  switch(a){
    case 'tab':st.tab=d.t;render();window.scrollTo(0,0);break;
    case 'prevm':shiftMonth(-1);break;
    case 'next':shiftMonth(1);break;
    case 'today':st.cur={y:tp.y,m:tp.m};render();break;
    case 'day':st.sel=+d.j;daySheet(+d.j);break;
    case 'close':closeSheet();break;
    case 'picker':pkY=st.cur.y;pickerSheet();break;
    case 'pk-y':pkY=(pkY||st.cur.y)+(+d.v);st.cur.y=pkY;$('#pk-year').textContent=num(impY(pkY));$('#pk-sub').textContent=num(pkY)+' شمسی';break;
    case 'pk-m':st.cur.m=+d.m;closeSheet();break;
    case 'pk-today':st.cur={y:tp.y,m:tp.m};closeSheet();break;
    case 'y-prev':st.yearV--;render();break;
    case 'y-next':st.yearV++;render();break;
    case 'y-today':st.yearV=tp.y;render();break;
    case 'open-month':st.cur={y:+d.y,m:+d.m};st.tab='month';render();window.scrollTo(0,0);break;
    case 'ev-mode':st.evMode=d.v;render();break;
    case 'ev-year':st.evYear+=(+d.v);render();break;
    case 'tr':st.tr=d.v;render(true);break;
    case 'tc':st.tc[d.k]=(st.tc[d.k]===false);render(true);break;
    case 'cat':S.cats[d.k]=!S.cats[d.k];saveS();render(true);break;
    case 'tools':st.tools=d.v;render();break;
    case 'conv-cal':{
      var old=st.conv.cal,j;
      if(st.tools==='dist'){var ja=readGroup('a',old),jb=readGroup('b',old);st.dist.a=ja||st.dist.a;st.dist.b=jb||st.dist.b}
      else{j=readGroup('c',old);if(j)st.conv.j=j}
      st.conv.cal=d.v;render(true);break}
    case 'conv-go':{var j2=readGroup('c',st.conv.cal);if(!j2){toast('تاریخ واردشده معتبر نیست.');break}st.conv.j=j2;$('#cres').innerHTML=resCards(j2);break}
    case 'conv-today':st.conv.j=today;render(true);break;
    case 'conv-this':st.conv.j=+d.j;st.tools='convert';st.tab='tools';closeSheet(true);render();window.scrollTo(0,0);break;
    case 'dist-go':{var a1=readGroup('a',st.conv.cal),b1=readGroup('b',st.conv.cal);if(!a1||!b1){toast('تاریخ واردشده معتبر نیست.');break}st.dist.a=a1;st.dist.b=b1;$('#dres').innerHTML=distHTML(a1,b1,st.conv.cal);break}
    case 'astro-y':st.astroY+=(+d.v);render(true);break;
    case 'theme':S.theme=d.v;saveS();applyTheme();render(true);break;
    case 'digits':S.digits=d.v;saveS();render(true);break;
    case 'wstart':S.weekStart=+d.v;saveS();render(true);break;
    case 'tz':S.tz=d.v;saveS();render(true);break;
    case 'set':S[d.k]=el.checked?1:0;saveS();Ev.clearCache();render(true);break;
    case 'install':if(installEv){installEv.prompt();installEv=null;render(true)}break;
    case 'share-day':shareText(+d.j);break;
    case 'add-p':personalSheet({j:d.j?+d.j:(st.sel||today),task:!!d.task});break;
    case 'tdone':{var nv=el.getAttribute('aria-pressed')!=='true';Ev.setDone(d.id,+d.j,nv);document.querySelectorAll('.chk[data-id="'+d.id+'"][data-j="'+d.j+'"]').forEach(function(b){b.setAttribute('aria-pressed',nv)});if(!sheetOpen)render(true);break}
    case 'edit-p':{var item=Ev.listPersonal().filter(function(x){return x.id===d.id})[0];if(item){personalSheet({p:item})}break}
    case 'p-cal':{var oldc=st.pcal;st.pcal=d.v;if((oldc==='i'&&d.v==='p')||(oldc==='p'&&d.v==='i')){var dl=d.v==='p'?-1180:1180;['py','ey'].forEach(function(id){var f=$('#'+id);if(f&&f.value)f.value=(+f.value)+dl})}var seg=el.parentNode.querySelectorAll('button');seg.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.v===d.v)});
      var names=d.v==='g'?GM:PM,sel=$('#pm'),cur=sel.value;sel.innerHTML=names.map(function(n,i){return '<option value="'+(i+1)+'"'+(String(i+1)===cur?' selected':'')+'>'+n+'</option>'}).join('');break}
    case 'p-save':savePersonalFromSheet(d.id);break;
    case 'p-del':Ev.removePersonal(d.id);closeSheet();toast('حذف شد.');break;
    case 'notify':askNotify();toast(window.Notification?(Notification.permission==='granted'?'اعلان‌ها روشن است.':'اجازهٔ اعلان را در پنجرهٔ مرورگر بدهید.'):'این مرورگر اعلان را پشتیبانی نمی‌کند.');render(true);break;
    case 'ics-rem':{
      var t2=Ev.buildICS(tp.y-1,tp.y+5,{personal:true},function(j){return impStr(j)+' · '+shStr(j)});
      download('taghvim-reminders.ics',t2,'text/calendar');break}
    case 'ics':{
      var txt=Ev.buildICS(tp.y-1,tp.y+3,S.cats,function(j){return impStr(j)+' · '+shStr(j)});
      download('taghvim-shahanshahi.ics',txt,'text/calendar');break}
    case 'bk-export':download('taghvim-backup-'+today+'.json',JSON.stringify({v:1,settings:S,personal:Ev.listPersonal(),done:Ev.getDone()}),'application/json');break;
  }
}
function savePersonalFromSheet(id){
  var t=$('#pt').value.trim();if(!t){toast('عنوان را بنویسید.');return}
  var cal=st.pcal||'p',m=+$('#pm').value,d=+$('#pd').value,yv=parseInt($('#py').value,10),rec=$('#prec').value,note=$('#pn').value.trim(),eyv=parseInt($('#ey').value,10);
  if(cal==='i'){cal='p';if(yv)yv-=1180;if(eyv)eyv-=1180}
  if(!(d>=1&&d<=31)){toast('روز معتبر نیست.');return}
  var o;
  function toJ(y,mm,dd){var jj=cal==='g'?Cal.g2j(y,mm,dd):Cal.p2j(y,mm,dd);var c=cal==='g'?Cal.j2g(jj):pd(jj);return (c.m===mm&&c.d===dd)?jj:null}
  if(rec==='year'){
    if(cal==='p'&&d>30&&m>6){toast('روز معتبر نیست.');return}
    o={t:t,note:note,rec:'year',c:cal,m:m,d:d};
  }else{
    if(!yv){toast('سال شروع را بنویسید.');return}
    var j=toJ(yv,m,d);if(!j){toast('این تاریخ وجود ندارد.');return}
    o={t:t,note:note,rec:rec,j:j,cal:cal};
    var ey=eyv;
    if(rec!=='once'&&ey){var ej=toJ(ey,+$('#em').value,+$('#ed').value);if(!ej){toast('تاریخ پایان معتبر نیست.');return}if(ej<j){toast('پایان باید بعد از شروع باشد.');return}o.ej=ej}
  }
  o.task=$('#ptask').checked?1:0;
  o.rm=+$('#prm').value;o.rt=$('#prt').value||'09:00';
  if(id)Ev.updatePersonal(id,o);else Ev.addPersonal(o);
  if(o.rm>=0)askNotify();
  S.cats.personal=true;saveS();closeSheet();toast('ذخیره شد.');
}

/* ====================== events wiring ====================== */
document.addEventListener('click',function(ev){
  var b=ev.target.closest('[data-a]');if(!b)return;
  if(b.tagName==='INPUT'&&b.type==='checkbox')return;
  act(b.dataset.a,b,ev);
});
document.addEventListener('change',function(ev){
  var el=ev.target;
  if(el.matches&&el.matches('input[type=checkbox][data-a="set"]'))act('set',el);
  else if(el.id==='bk-file'){
    var f=el.files&&el.files[0];if(!f)return;
    var r=new FileReader();r.onload=function(){
      try{var o=JSON.parse(r.result);if(o.personal)Ev.replacePersonal(o.personal);if(o.done)Ev.putDone(o.done);
        if(o.settings){for(var k in o.settings){if(k==='cats'){for(var c in o.settings.cats)S.cats[c]=!!o.settings.cats[c]}else S[k]=o.settings[k]}saveS();applyTheme()}
        render();toast('بازیابی شد.')}catch(e){toast('فایل پشتیبان معتبر نیست.')}
    };r.readAsText(f);
  }
});
document.addEventListener('input',function(ev){
  if(ev.target.id==='q'){st.q=ev.target.value;var l=$('#evlist');if(l)l.innerHTML=evList()}
});
(function(){var x0=null,y0=null;
  document.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  document.addEventListener('touchend',function(e){
    if(x0===null||st.tab!=='month'||sheetOpen)return;
    var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
    if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6)shiftMonth(dx>0?-1:1);
  },{passive:true});
})();
document.addEventListener('keydown',function(e){
  if(st.tab!=='month'||sheetOpen||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  if(e.key==='ArrowLeft')shiftMonth(1);else if(e.key==='ArrowRight')shiftMonth(-1);
});
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();installEv=e;if(st.tab==='settings')render(true)});
document.addEventListener('visibilitychange',function(){
  if(!document.hidden){var nt=Cal.todayJ();if(nt!==today){today=nt;tp=Cal.j2p(today)}if(!sheetOpen)render(true)}
});

/* ====================== boot ====================== */
applyTheme();
render();
(function(){var sp=$('#splash');if(!sp)return;
  var seen=false;try{seen=sessionStorage.getItem('tq-splash')==='1';sessionStorage.setItem('tq-splash','1')}catch(e){}
  function hide(){sp.classList.add('out');setTimeout(function(){sp.remove()},600)}
  if(seen)sp.remove();else{setTimeout(hide,1700);sp.addEventListener('click',hide)}
})();
if('serviceWorker' in navigator&&location.protocol!=='file:'){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
setTimeout(checkReminders,2200);setInterval(function(){if(!document.hidden){var nt=Cal.todayJ();if(nt!==today){today=nt;tp=Cal.j2p(today)}checkReminders()}},60000);
window.__tq={Cal:Cal,Ev:Ev,Astro:Astro,S:S,st:st};
})();
