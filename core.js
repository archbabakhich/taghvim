/* Calendar core: Gregorian, Persian (solar hijri, official leap table + old-era table), Hijri (Iran table),
   Imperial era (solar hijri + 1180). All functions work on Julian Day Numbers (integers). */
var Cal=(function(){
'use strict';
var floor=Math.floor;
var IMPERIAL_OFFSET=1180;

/* ---------- Gregorian ---------- */
function g2j(y,m,d){
  var a=floor((14-m)/12),yy=y+4800-a,mm=m+12*a-3;
  return d+floor((153*mm+2)/5)+365*yy+floor(yy/4)-floor(yy/100)+floor(yy/400)-32045;
}
function j2g(j){
  var a=j+32044,b=floor((4*a+3)/146097),c=a-floor(146097*b/4),
      d=floor((4*c+3)/1461),e=c-floor(1461*d/4),m=floor((5*e+2)/153);
  return {y:100*b+d-4800+floor(m/10),m:m+3-12*floor(m/10),d:e-floor((153*m+2)/5)+1};
}

/* ---------- Persian ----------
   1304–1498: official leap-year table (Tehran University Geophysics Institute).
   Other years: the retroactive 33-year arithmetic rule, which is how historical dates such as
   "4 Aban 1298" or "14 Mordad 1285" are conventionally stated. */
var CUM=[0,31,62,93,124,155,186,216,246,276,306,336,366];
var NEW_START=1304,NEW_END=1498;
var yearStart={};
(function(){
  var leap={};T_LEAPS.forEach(function(y){leap[y]=1});
  var j=2424231; /* 1304/1/1 = 1925-03-21 */
  for(var y=NEW_START;y<=NEW_END+1;y++){yearStart[y]=j;j+=leap[y]?366:365}
})();
function leap33(y){return ((y*8+29)%33+33)%33<8}
var astroCache={};
/* Nowruz day by the official rule: the day on which the vernal equinox falls before noon at Tehran's
   meridian (UTC+3:30), otherwise the next day. Accurate for 1179–1578 SH; used outside the official table. */
function astroYearStart(y){
  if(astroCache[y]!==undefined)return astroCache[y];
  var gy=y+621,ms=Astro.season('spring',gy)+3.5*3600000,dt=new Date(ms);
  var j=g2j(dt.getUTCFullYear(),dt.getUTCMonth()+1,dt.getUTCDate());
  if(dt.getUTCHours()>=12)j++;
  return (astroCache[y]=j);
}
function pYearStart(y){
  if(y>=NEW_START&&y<=NEW_END+1)return yearStart[y];
  if(y>=1180&&y<=1570&&typeof Astro!=='undefined')return astroYearStart(y);
  if(y>NEW_END+1){var j=yearStart[NEW_END+1],yy=NEW_END+1;while(yy<y){j+=leap33(yy)?366:365;yy++}return j}
  var j2=yearStart[NEW_START],y3=NEW_START;while(y3>y){y3--;j2-=leap33(y3)?366:365}return j2;
}
function pMonthLen(y,m){
  if(m<=6)return 31; if(m<=11)return 30;
  return pYearStart(y+1)-pYearStart(y)-336;
}
function pYearLen(y){return pYearStart(y+1)-pYearStart(y)}
function p2j(y,m,d){return pYearStart(y)+CUM[m-1]+d-1}
function j2p(j){
  var y=floor((j-pYearStart(1400))/365.2425)+1400;
  while(pYearStart(y)>j)y--;
  while(pYearStart(y+1)<=j)y++;
  var doy=j-pYearStart(y),m=1;
  while(m<12&&doy>=CUM[m])m++;
  return {y:y,m:m,d:doy-CUM[m-1]+1};
}
function isLeapPersian(y){return pYearLen(y)===366}

/* ---------- Hijri (Iran table 1264–1449, tabular fallback) ---------- */
var H_JD0=2396005,hStarts=[];
(function(){
  var jd=H_JD0;
  T_HIJRI.forEach(function(bits){for(var i=0;i<12;i++){hStarts.push(jd);jd+=bits[i]==='1'?30:29}});
  hStarts.push(jd);
})();
function h2j(y,m,d){
  var i=(y-T_HIJRI_START)*12+m-1;
  if(i>=0&&i<hStarts.length-1)return hStarts[i]+d-1;
  return d+Math.ceil(29.5*(m-1))+(y-1)*354+floor((3+11*y)/30)+1948440-1;
}
function j2h(j){
  if(j>=hStarts[0]&&j<hStarts[hStarts.length-1]){
    var lo=0,hi=hStarts.length-1;
    while(hi-lo>1){var mid=(lo+hi)>>1;if(hStarts[mid]<=j)lo=mid;else hi=mid}
    return {y:T_HIJRI_START+floor(lo/12),m:lo%12+1,d:j-hStarts[lo]+1};
  }
  var y=floor((30*(j-1948440)+10646)/10631),m=Math.min(12,Math.ceil((j-(29+h2j(y,1,1)))/29.5)+1);
  return {y:y,m:m,d:j-h2j(y,m,1)+1};
}

/* ---------- helpers ---------- */
function weekday(j){return ((j+2)%7+7)%7} /* 0 = Saturday … 6 = Friday */
function todayJ(){var n=new Date();return g2j(n.getFullYear(),n.getMonth()+1,n.getDate())}
function jOfDate(dt){return g2j(dt.getFullYear(),dt.getMonth()+1,dt.getDate())}
function pToImperial(y){return y+IMPERIAL_OFFSET}
function dayOfYear(j){var p=j2p(j);return j-pYearStart(p.y)+1}
function weekOfYear(j,weekStart){ /* week containing Farvardin 1 is week 1; weeks start on Saturday */
  var p=j2p(j),s=pYearStart(p.y),off=(weekday(s)-weekStart+7)%7;
  return floor((j-s+off)/7)+1;
}
return {g2j:g2j,j2g:j2g,p2j:p2j,j2p:j2p,h2j:h2j,j2h:j2h,pMonthLen:pMonthLen,pYearLen:pYearLen,isLeapPersian:isLeapPersian,
  weekday:weekday,todayJ:todayJ,jOfDate:jOfDate,pToImperial:pToImperial,IMPERIAL_OFFSET:IMPERIAL_OFFSET,
  dayOfYear:dayOfYear,weekOfYear:weekOfYear,pYearStart:pYearStart,
  gMonthLen:function(y,m){return g2j(m===12?y+1:y,m===12?1:m+1,1)-g2j(y,m,1)}};
})();
