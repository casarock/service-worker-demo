var CACHE_NAME_STATIC = 'code.talks-v1';

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

    event.respondWith(
        caches.match(event.request)
        .then(function(response) {

            // we have a copy of the response in our cache, so return it
            if (response) {
                console.log("Response from cache");
                return response; //no network request necessary
            }

            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                function(response) {
                    // Chache what ever we need.
                    if (response.type === "basic" && response.status === 200) {
                        console.log("New valid request. New cache: " + CACHE_NAME_STATIC);

                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME_STATIC)
                            .then(function(cache) {
                                var cacheRequest = event.request.clone();
                                cache.put(cacheRequest, responseToCache);
                            });
                    }
                    // response...
                    return response;
                }
            ).catch(function(error) {
                console.log("error");
                return caches.open(CACHE_NAME_STATIC).then(function(cache) {
                    return cache.match('offline.html');
                });
            });
        })
    );
});
