// Register the ServiceWorker
navigator.serviceWorker.register('sw.js', {
    scope: './'
}).then(function(reg) {
    console.log(reg.scope, 'registered');
    console.log('Service worker change, registered the service worker');
});
