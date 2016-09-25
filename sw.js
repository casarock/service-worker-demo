self.addEventListener('install', function(event) {
    // Put 'offline.html' page into cache
    var offline = new Request('offline.html');
    event.waitUntil(
        fetch(offline).then(function(response) {
            return caches.open('offline').then(function(cache) {
                return cache.put(offline, response);
            });
        })
    );
});

self.addEventListener('fetch', function(event) {
    var request = event.request;

    if (request.method === 'GET') {
        event.respondWith(

            // `fetch()` throws exception when unreachable
            // not for valid requests.
            fetch(request).catch(function(error) {
                console.log('Fetch returned: ' + error);

                // Error! We need to serve offline.html (when already cached)!
                return caches.open('offline').then(function(cache) {
                    return cache.match('offline.html');
                });
            })
        );
    }
});
