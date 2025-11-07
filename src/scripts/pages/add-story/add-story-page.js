import { addStory, addStoryGuest } from '../../data/api.js'; 

export default class AddStoryPage {
  async render() {
    return `
    <section class="add-story-container">
      <h1 class="add-story-title">Tambah Story Baru</h1>
      <form id="addStoryForm">
        <div class="form-group">
        <label for="description">Deskripsi:</label>
        <textarea id="description" required></textarea>
        </div>

        <div class="form-group">
        <label for="photo">Foto:</label>
        <input type="file" id="photo" accept="image/*" required />
        </div>

        <div class="form-group">
        <label for="map">Pilih lokasi di peta:</label>
        <div id="map" style="height: 300px; margin-bottom: 10px; border-radius:12px;"></div>
        </div>
        
        <div class="form-group">
        <label for="lat">Latitude</label>
        <input type="text" id="lat" readonly required />
        </div>

        <div class="form-group">
        <label for="lon">Longtitude</label>
        <input type="text" id="lon" readonly required />
        </div>

        <button type="submit">Tambah Story</button>
      </form>
    </section>
  `;
  }


  async afterRender() {
    const map = L.map('map').setView([-6.2, 106.816666], 10); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let marker;

    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker([lat, lng]).addTo(map);
      document.getElementById('lat').value = lat.toFixed(5);
      document.getElementById('lon').value = lng.toFixed(5);
    });

    const form = document.querySelector('#addStoryForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.getElementById('description').value;
      const photo = document.getElementById('photo').files[0];
      const lat = parseFloat(document.getElementById('lat').value);
      const lon = parseFloat(document.getElementById('lon').value);

      if (!photo || !description || isNaN(lat) || isNaN(lon)) {
        alert('Semua field harus diisi dan lokasi harus dipilih di peta!');
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      formData.append('lat', lat);
      formData.append('lon', lon);

      const token = localStorage.getItem('token');

      try {
        let response;
        if (token) {
          response = await addStory(formData); 
          alert('Story berhasil ditambahkan!');
        } else {
          response = await addStoryGuest(formData); 
          alert('Story berhasil ditambahkan sebagai guest!');
        }
        window.location.hash = '/';
      } catch (error) {
        alert('Gagal menambahkan story: ' + error.message);
      }
    });

  }

}
