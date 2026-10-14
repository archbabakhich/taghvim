/* Bump VERSION whenever any file changes so phones pick up the update. */
const VERSION='taghvim-B25.10';
const ASSETS=["./", "index.html", "logo.png", "logo-bg.png", "manifest.webmanifest", "css/app.css", "js/app.js", "js/astro.js", "js/core.js", "js/data.js", "js/events.js", "js/tables.js", "js/tunnel.js", "js/people.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "fonts/aref-ruqaa-arabic-700-normal.woff2", "fonts/aref-ruqaa-latin-700-normal.woff2", "fonts/vazirmatn-arabic-400-normal.woff2", "fonts/vazirmatn-arabic-500-normal.woff2", "fonts/vazirmatn-arabic-700-normal.woff2", "fonts/vazirmatn-latin-400-normal.woff2", "fonts/vazirmatn-latin-500-normal.woff2", "fonts/vazirmatn-latin-700-normal.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put(r,c));return res})));
});

self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}return self.clients.openWindow('./')}))});
