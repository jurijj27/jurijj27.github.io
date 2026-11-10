const CACHE = 'nq-static-v1';
const ASSETS = ['./', './index.html', './styles.css', './app.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => { if (r.ok) { const cl = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, cl)); } return r; }).catch(() => c)));
});
