// Instalación del Service Worker y precaching de los recursos
self.addEventListener('install', event => {
    console.log('Service Worker ya estoy instalado');
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                './index.html',
                '/css/styles.css',
                '/scripts/semana.js',
                '/images/fondo.jpg',                
                './manifest.json'
            ]);
        })
    );
});
// Activación del Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker activado');
    event.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== 'v1';
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
// Interceptar y manejar las solicitudes de red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
    console.log('estoy aca');
});