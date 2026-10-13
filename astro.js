/* Astronomy: equinox/solstice instants (port of the MIT-licensed "equinox" library by Persian Calendar,
   VSOP87 + IAU2000B, sub-second accuracy 1800–2200) and Meeus-style moon phases (minutes accuracy). */
var Astro=(function(){
'use strict';
var PI=Math.PI,J2000=2451545.0,UNIX_EPOCH_JD=2440587.5,ASEC2RAD=PI/(180*3600),ABERRATION=20.4898,MEAN_MOTION=360/365.2422;
var C0=-1.81364,C1=-6.79273,C2=-0.29944;
var floor=Math.floor;
function mod(a,n){return ((a%n)+n)%n}
function sumTerms(arr,T){
  var s=0;
  for(var i=0;i<arr.length;i+=4)s+=arr[i]*Math.pow(T,arr[i+3])*Math.cos(arr[i+1]+arr[i+2]*T);
  return s;
}
function nutationLongitude(jdTT){
  var t=(jdTT-J2000)/36525,s=0;
  for(var i=0;i<T_NUT.length;i+=5){
    var a=T_NUT[i]+T_NUT[i+1]*t,sn=Math.sin(a);
    s+=T_NUT[i+2]*sn+T_NUT[i+3]*sn*t+T_NUT[i+4]*Math.cos(a);
  }
  return (s-0.000135e7)*ASEC2RAD/1e7;
}
function apparentLongitude(jdTT){
  var T=(jdTT-J2000)/365250,L=sumTerms(T_EARTH_L,T),R=sumTerms(T_EARTH_R,T);
  var lon=(L+PI)*180/PI;
  lon-=ABERRATION/R/3600;
  lon+=nutationLongitude(jdTT)*180/PI;
  return mod(lon,360);
}
function taiMinusUtc(year,month){
  for(var i=0;i<T_LEAPSEC.length;i++){var e=T_LEAPSEC[i];if(year>e[0]||(year===e[0]&&month>=e[1]))return e[2]}
  return 10;
}
function gregorianToJd(y,m,d){return Cal.g2j(y,m,d)}
function findEvent(year,target,month,day){
  var t=gregorianToJd(year,month,day);
  for(var i=0;i<10;i++){
    var diff=mod(apparentLongitude(t)-target+180,360)-180;
    t-=diff/MEAN_MOTION;
  }
  return t;
}
var SEASONS={spring:[0,3,20],summer:[90,6,21],autumn:[180,9,22],winter:[270,12,21]};
/* returns epoch milliseconds (UTC) of the season start in the given Gregorian year */
function season(name,year){
  var s=SEASONS[name],jdTT=findEvent(year,s[0],s[1],s[2]);
  var t=(jdTT-J2000)/36525,corr=C0+t*(C1+t*C2);
  var jdPosix=jdTT-(corr+32.184+taiMinusUtc(year,s[1]))/86400;
  return Math.round((jdPosix-UNIX_EPOCH_JD)*86400000);
}

/* ---------- Moon phases (Meeus, Astronomical Algorithms ch. 49) ---------- */
function rad(d){return d*PI/180}
/* phase: 0 new, 1 first quarter, 2 full, 3 last quarter; returns epoch ms (UTC) */
function moonPhase(k0,phase){
  var k=k0+phase/4,T=k/1236.85,T2=T*T,T3=T2*T,T4=T3*T;
  var jde=2451550.09766+29.530588861*k+0.00015437*T2-0.00000015*T3+0.00000000073*T4;
  var E=1-0.002516*T-0.0000074*T2;
  var M=rad(mod(2.5534+29.1053567*k-0.0000014*T2-0.00000011*T3,360));
  var Mp=rad(mod(201.5643+385.81693528*k+0.0107582*T2+0.00001238*T3-0.000000058*T4,360));
  var F=rad(mod(160.7108+390.67050284*k-0.0016118*T2-0.00000227*T3+0.000000011*T4,360));
  var Om=rad(mod(124.7746-1.56375588*k+0.0020672*T2+0.00000215*T3,360));
  var s=Math.sin,c=Math.cos,corr;
  if(phase===0){
    corr=-0.4072*s(Mp)+0.17241*E*s(M)+0.01608*s(2*Mp)+0.01039*s(2*F)+0.00739*E*s(Mp-M)-0.00514*E*s(Mp+M)+0.00208*E*E*s(2*M)
      -0.00111*s(Mp-2*F)-0.00057*s(Mp+2*F)+0.00056*E*s(2*Mp+M)-0.00042*s(3*Mp)+0.00042*E*s(M+2*F)+0.00038*E*s(M-2*F)
      -0.00024*E*s(2*Mp-M)-0.00017*s(Om);
  }else if(phase===2){
    corr=-0.40614*s(Mp)+0.17302*E*s(M)+0.01614*s(2*Mp)+0.01043*s(2*F)+0.00734*E*s(Mp-M)-0.00515*E*s(Mp+M)+0.00209*E*E*s(2*M)
      -0.00111*s(Mp-2*F)-0.00057*s(Mp+2*F)+0.00056*E*s(2*Mp+M)-0.00042*s(3*Mp)+0.00042*E*s(M+2*F)+0.00038*E*s(M-2*F)
      -0.00024*E*s(2*Mp-M)-0.00017*s(Om);
  }else{
    corr=-0.62801*s(Mp)+0.17172*E*s(M)-0.01183*E*s(Mp+M)+0.00862*s(2*Mp)+0.00804*s(2*F)+0.00454*E*s(Mp-M)+0.00204*E*E*s(2*M)
      -0.0018*s(Mp-2*F)-0.0007*s(Mp+2*F)-0.0004*s(3*Mp)-0.00034*E*s(2*Mp-M)+0.00032*E*s(M+2*F)+0.00032*E*s(M-2*F)
      -0.00028*E*E*s(Mp+2*M)+0.00027*E*s(2*Mp+M)-0.00017*s(Om);
    var W=0.00306-0.00038*E*c(M)+0.00026*c(Mp)-0.00002*c(Mp-M)+0.00002*c(Mp+M)+0.00002*c(2*F);
    corr+=phase===1?W:-W;
  }
  var dtSec=69; /* ΔT ≈ 69 s around 2020s */
  return Math.round((jde+corr-UNIX_EPOCH_JD)*86400000-dtSec*1000);
}
function kForEpoch(ms){return floor(((ms/86400000+UNIX_EPOCH_JD)-2451550.09766)/29.530588861)}
/* all phases between two epoch-ms instants */
function phasesBetween(fromMs,toMs){
  var out=[],k=kForEpoch(fromMs)-1,kEnd=kForEpoch(toMs)+1;
  for(;k<=kEnd;k++)for(var p=0;p<4;p++){
    var t=moonPhase(k,p);
    if(t>=fromMs&&t<toMs)out.push({t:t,p:p});
  }
  out.sort(function(a,b){return a.t-b.t});
  return out;
}
/* illumination and age at a given instant, from the surrounding new moons */
function moonState(ms){
  var k=kForEpoch(ms),a=moonPhase(k,0),b;
  if(a>ms){k--;a=moonPhase(k,0)}
  b=moonPhase(k+1,0);
  var frac=(ms-a)/(b-a);
  return {age:(ms-a)/86400000,frac:frac,illum:(1-Math.cos(2*PI*frac))/2,waxing:frac<0.5,len:(b-a)/86400000};
}
var PHASE_NAMES=['ماه نو','تربیع اول','ماه کامل','تربیع آخر'];
return {season:season,moonPhase:moonPhase,phasesBetween:phasesBetween,moonState:moonState,PHASE_NAMES:PHASE_NAMES};
})();
