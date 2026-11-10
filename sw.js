/* NEURO QUEST — сервис-воркер: офлайн-кэш + умные обновления */
const CACHE = 'nq-static-v4';
const ASSETS = ['index.html', 'styles.css', 'app.js', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  // каждый файл кэшируем отдельно — отсутствие одного не ломает установку
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => {})))));
  self.skipWaiting(); // новый воркер вступает в силу сразу, без ожидания вкладок
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // подхватываем уже открытые вкладки
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
