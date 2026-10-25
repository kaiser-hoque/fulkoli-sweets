var V="fulkoli-v1";
var FILES=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png",
"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){
    return Promise.all(FILES.map(function(u){return c.add(u).catch(function(){})}));
  }));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}));
  }));
  self.clients.claim();
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(
    fetch(e.request).then(function(r){
      if(r&&r.status===200){var cp=r.clone();caches.open(V).then(function(c){c.put(e.request,cp)})}
      return r;
    }).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match("./index.html")})})
  );
});
