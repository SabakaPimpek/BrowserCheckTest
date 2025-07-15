const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/style.css",
      "/index.js",
      "/pan-tadeusz.pdf",
      "/SampleAudio.mp3",
      "/SampleVideo.mp4",
      "/test-file.dat",
      "/iframe.html"
    ]),
  );
});
