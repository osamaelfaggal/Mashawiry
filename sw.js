const C='m6';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json'])));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isAppShell=e.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/');
  if(isAppShell){
    e.respondWith(fetch(e.request).then(response=>{
      if(response&&response.ok){const copy=response.clone();caches.open(C).then(c=>c.put(e.request,copy));}
      return response;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(response=>{
    if(response&&response.ok){const copy=response.clone();caches.open(C).then(c=>c.put(e.request,copy));}
    return response;
  })));
});
