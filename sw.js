// Cache do app para uso offline. As consultas de CNPJ/CEP sempre vão à rede.
const CACHE = 'orcamento-aco-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'data/produtos.json', 'assets/logo-aco.jpg',
  'assets/icon-192.png', 'assets/icon-512.png', 'vendor/jspdf.umd.min.js', 'vendor/jspdf.plugin.autotable.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // rede primeiro (pega atualizações da base), cache como reserva
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
