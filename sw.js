
// Instalación
self.addEventListener('install', event => {
    console.log('Service Worker instalado');
    event.waitUntil(
        caches.open('v2').then(cache => {
            return cache.addAll([
                '/awp/pwa_estetica/index.html',
                '/awp/pwa_estetica/css/styles.css',
                '/awp/pwa_estetica/js/semana.js',
                '/awp/pwa_estetica/images/fondo_de_pwa.jpg',
                '/awp/pwa_estetica/manifest.json'
            ]);
        })
    );
});

// Activación
self.addEventListener('activate', event => {
    console.log('Service Worker activado');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== 'v2')
                          .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Intercepción de solicitudes
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
