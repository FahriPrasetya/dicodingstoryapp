import { getData } from '../../data/api.js';

export default class MapPage {
    async render() {
        return `
      <section class="map-page-container">
        <h2 class="map-page-title">Dicoding Story Map</h2>
        <div class="map-page-buttons">
        <button id="add-story-btn">+ Add Story</button>
        <button id="list-story-card-btn" class="different-visual-btn">Lihat Story Card</button>
        </div>
        <div id="map" style="height: 500px; margin-top: 1rem; border-radius: 12px;"></div>
      </section>
    `;
    }

    async afterRender() {
        const addStoryBtn = document.getElementById('add-story-btn');
        const cardButton = document.getElementById('list-story-card-btn');

        addStoryBtn.addEventListener('click', () => {
            window.location.hash = '#/add-story'
        })

        cardButton.addEventListener('click', () => {
            window.location.hash = '/'
        })





        const map = L.map('map').setView([-2.5, 118], 5); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        try {
            const stories = await getData();
            const markers = [];

            let activeMarker = null;

            stories.forEach((story) => {
                if (story.lat && story.lon) { 
                    const normalIcon = L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
                        iconSize: [30, 30],
                    });

                    const highlightIcon = L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
                        iconSize: [45, 45],
                    });

                    const marker = L.marker([story.lat, story.lon], { icon: normalIcon })
                        .addTo(map)
                        .bindPopup(`<b>${story.name}</b><br>${story.description}`);

                    marker.on('click', () => {
                        if (activeMarker && activeMarker !== marker) {
                            activeMarker.setIcon(normalIcon);
                        }
                        marker.setIcon(highlightIcon);
                        activeMarker = marker;
                        map.flyTo(marker.getLatLng(), 8, { duration: 1.2 });
                    });
                }
            });

        } catch (error) {
            console.error(error);
            alert('Gagal memuat data peta');
        }
    }
}