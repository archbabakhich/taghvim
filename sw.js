/* Bump VERSION whenever any file changes so phones pick up the update. */
const VERSION='taghvim-B26.2';
const ASSETS=["./", "index.html", "logo.png", "logo-bg.png", "manifest.webmanifest", "css/app.css", "js/app.js", "js/astro.js", "js/core.js", "js/data.js", "js/events.js", "js/tables.js", "js/tunnel.js", "js/people.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "fonts/aref-ruqaa-arabic-700-normal.woff2", "fonts/aref-ruqaa-latin-700-normal.woff2", "fonts/vazirmatn-arabic-400-normal.woff2", "fonts/vazirmatn-arabic-500-normal.woff2", "fonts/vazirmatn-arabic-700-normal.woff2", "fonts/vazirmatn-latin-400-normal.woff2", "fonts/vazirmatn-latin-500-normal.woff2", "fonts/vazirmatn-latin-700-normal.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION&&x!=='taghvim-news-state').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(new URL(r.url).pathname.endsWith('/news.json')){
    e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r,{ignoreSearch:true})));
    return;
  }
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put(r,c));return res})));
});

const NEWS_STATE='taghvim-news-state';
async function checkNews(){
  let res;try{res=await fetch('news.json?t='+Date.now(),{cache:'no-store'})}catch(_){return}
  if(!res.ok)return;
  let d;try{d=await res.json()}catch(_){return}
  const items=((d&&d.items)||[]).filter(i=>i&&i.id&&i.title).map(i=>({...i,id:String(i.id)}));
  const c=await caches.open(NEWS_STATE),sr=await c.match('seen');
  let seen=null;try{seen=sr?await sr.json():null}catch(_){}
  if(!seen){await c.put('seen',new Response(JSON.stringify(items.map(i=>i.id))));return}
  const fresh=items.filter(i=>!seen.includes(i.id));
  if(!fresh.length)return;
  await c.put('seen',new Response(JSON.stringify(seen.concat(fresh.map(i=>i.id)).slice(-200))));
  for(const i of fresh.slice(0,5)){
    try{await self.registration.showNotification(String(i.title),{body:String(i.body||''),icon:'icons/icon-192.png',badge:'icons/icon-192.png',tag:'taghvim-news-'+i.id,lang:'fa',dir:'rtl',data:{url:'./?tab=news'}})}catch(_){}
  }
}
self.addEventListener('periodicsync',e=>{if(e.tag==='taghvim-news')e.waitUntil(checkNews())});
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(_){}
  e.waitUntil(self.registration.showNotification(d.title||'تقویم شاهنشاهی',{body:d.body||'',icon:'icons/icon-192.png',badge:'icons/icon-192.png',lang:'fa',dir:'rtl',data:{url:'./?tab=news'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(self.clients.matchAll({type:'window'}).then(l=>{
    for(const c of l){if('focus' in c){c.postMessage({type:'open-news'});return c.focus()}}
    return self.clients.openWindow(url);
  }));
});
