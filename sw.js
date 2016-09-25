var CACHE_NAME_STATIC = 'code.talker-v1';

self.addEventListener('install', function(event) {
    event.waitUntil(
        // Cache static
        caches.open(CACHE_NAME_STATIC).then(function(cache) {

            return cache.addAll([
                '/webpage.html',
                '/css/',
                '/css/layouts/',
                '/img/',
                '/js/app.js',
                'offline.html'
            ]);
        })
    )
});



self.addEventListener('activate', function(event) {
    var cacheWhitelist = [CACHE_NAME_STATIC];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log("Found: ", cacheName);
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    var requestURL = new URL(event.request.url);

    event.respondWith(returnFromCacheOrFetch(event.request));
});

function returnFromCacheOrFetch(request) {
    const cachePromise = caches.open(CACHE_NAME_STATIC);
    const matchPromise = cachePromise.then(function(cache) {
        return cache.match(request);
    });

    return Promise.all([cachePromise, matchPromise]).then(function([cache, cacheResponse]) {
        // Kick off the update request
        const fetchPromise = fetch(request).then(function(fetchResponse) {
            // Cache the updated file and then return the response
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
        });
            // return the cached response if we have it, otherwise the result of the fetch.
        return cacheResponse || fetchPromise;
    }).catch(function(error) {
        console.log("error");
        return caches.open(CACHE_NAME_STATIC).then(function(cache) {
            return cache.match('offline.html');
        });
    });
}
