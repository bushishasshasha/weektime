const CACHE_NAME = "weekly-timetable-v48";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./timetable.html",
  "./timetable.css",
  "./timetable-app.js",
  "./data.js",
  "./utils.js",
  "./manifest.webmanifest",
  "./icon.png",
  "./icon.svg"
];
const RUNTIME_ASSET_PREFIXES = [
  "./assets/dongxuelian/page-backgrounds/blossom-profile.jpg",
  "./assets/dongxuelian/page-backgrounds/blue-city-garden.jpg",
  "./assets/dongxuelian/page-backgrounds/listener-desk.jpg",
  "./assets/dongxuelian/page-backgrounds/pale-lotus-garden.jpg",
  "./assets/dongxuelian/page-backgrounds/sunset-birds.jpg",
  "./assets/dongxuelian/page-backgrounds/throne-stage.jpg",
  "./assets/dongxuelian/table-backgrounds/blue-collage.jpg",
  "./assets/dongxuelian/table-backgrounds/chibi-pattern.jpg",
  "./assets/dongxuelian/table-backgrounds/hourglass-garden.jpg",
  "./assets/dongxuelian/table-backgrounds/rainy-umbrella.jpg",
  "./assets/taffy/page-backgrounds/110762787_p0.jpg",
  "./assets/taffy/page-backgrounds/115570927_p0.png",
  "./assets/taffy/page-backgrounds/131274076_p0.png",
  "./assets/taffy/page-backgrounds/96972053_p0.jpg",
  "./assets/taffy/table-backgrounds/110762787_p0.jpg",
  "./assets/taffy/table-backgrounds/115570927_p0.png",
  "./assets/taffy/table-backgrounds/131274076_p0.png",
  "./assets/taffy/table-backgrounds/96972053_p0.jpg",
  "./assets/jiaran/page-backgrounds/strawberry-diana.png",
  "./assets/jiaran/page-backgrounds/sunset-car.png",
  "./assets/jiaran/page-backgrounds/poolside-portrait.jpg",
  "./assets/jiaran/table-backgrounds/friday-drum.jpg",
  "./assets/jiaran/table-backgrounds/deadline-grave.jpg",
  "./assets/jiaran/table-backgrounds/half-life.jpg",
  "./assets/jiaran/table-backgrounds/overtime-flames.jpg",
  "./assets/jiaran/table-backgrounds/head-seven.jpg",
  "./assets/jiaran/table-backgrounds/big-fish-meat.jpg",
  "./assets/jiaran/table-backgrounds/meteor-goodbye.jpg",
  "./assets/jiaran/table-backgrounds/new-year-chibi.jpg",
  "./assets/jiaran/table-backgrounds/pink-birthday-card.jpeg",
  "./assets/jiaran/table-backgrounds/spotted-dog-cafe.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isRuntimeAsset = RUNTIME_ASSET_PREFIXES.some((asset) => (
    url.pathname.endsWith(asset.replace("./", "/"))
  ));
  event.respondWith(
    caches.match(event.request).then((cached) => (
      cached || fetch(event.request).then((response) => {
        if (isRuntimeAsset || CORE_ASSETS.some((asset) => url.pathname.endsWith(asset.replace("./", "/")))) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
    ))
  );
});
