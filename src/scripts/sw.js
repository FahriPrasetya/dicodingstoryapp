import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import CONFIG from './config';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com';
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);
registerRoute(
  ({ url }) => {
    return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome');
  },
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'dicoding-api',
    networkTimeoutSeconds: 3, // fallback ke cache kalau network lambat
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'story-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);


self.addEventListener('push', async event => {
  console.log('Push event diterima:', event);

  let data = {
    title: 'Story berhasil dibuat',
    options: {
      body: 'Anda telah membuat story baru dengan deskripsi default.',
    },
  };

  if (event.data) {
    try {
      data = await event.data.json();
    } catch (e) {
      const text = await event.data.text();
      data = {
        title: 'Notifikasi Baru',
        options: {
          body: text || 'Anda menerima notifikasi baru.',
        },
      };
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.options.body,
    })
  );
});
