const C='m2';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json'])));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.delete('m1').then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.open(C).then(c=>c.match(e.request)).then(r=>r||fetch(e.request)));
});
