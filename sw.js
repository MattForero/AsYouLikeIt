/* Offline copy of the notebook. The build writes the version (a hash of the files), so any change
   installs a fresh copy the next time the page is opened online, and the new copy shows on the open after that. */
const CACHE = 'ayli-24ed950ff921';
const FILES = ["./", "fonts.css", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "fonts/AtkinsonHyperlegible-italic-400-latin-ext.woff2", "fonts/AtkinsonHyperlegible-italic-400-latin.woff2", "fonts/AtkinsonHyperlegible-normal-400-latin-ext.woff2", "fonts/AtkinsonHyperlegible-normal-400-latin.woff2", "fonts/AtkinsonHyperlegible-normal-700-latin-ext.woff2", "fonts/AtkinsonHyperlegible-normal-700-latin.woff2", "fonts/Caveat-latin-ext.woff2", "fonts/Caveat-latin.woff2", "fonts/Fraunces-italic-400-latin-ext.woff2", "fonts/Fraunces-italic-400-latin.woff2", "fonts/Fraunces-normal-400-600-latin-ext.woff2", "fonts/Fraunces-normal-400-600-latin.woff2"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('ayli-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // dictionaries etc. go to the network
  e.respondWith(caches.match(e.request, { ignoreSearch: true })
    .then(r => r || (e.request.mode === 'navigate' ? caches.match('./') : null))
    .then(r => r || fetch(e.request)));
});
