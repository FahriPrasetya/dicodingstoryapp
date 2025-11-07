import { getData } from '../../data/api.js';
import { isServiceWorkerAvailable } from '../../utils/index.js';
import { subscribe, unsubscribe } from '../../utils/notification.js';
import { saveStory } from '../../data/idb.js';

export default class HomePage {
  async render() {
    return `
      <section class="home-page-container">
        <h1 class="home-page-title">Dicoding Story Card List</h1>
        <div class="home-page-buttons">
          <button id="add-story-btn">+ Add Story</button>
          <button id="list-story-map-btn" class="different-visual-btn">Lihat Peta Story</button>
        </div>
        <div class="notification-buttons">
          <button id="subscribe-button">Subscribe</button>
          <button id="unsubscribe-button">Unsubscribe</button>
        </div>
        <button id="saved-stories-btn">Saved Stories</button>
         <div id="stories-container" class="stories-grid"></div>
      </section>
    `;
  }

  async afterRender() {
    const addStoryBtn = document.getElementById('add-story-btn');
    addStoryBtn.addEventListener('click', () => {
      window.location.hash = '#/add-story';
    });

    const mapButton = document.getElementById('list-story-map-btn');
    mapButton.addEventListener('click', () => {
      window.location.hash = '/map';
    });

    if (isServiceWorkerAvailable()) {
      const subscribeButton = document.getElementById('subscribe-button');
      subscribeButton.addEventListener('click', () => {
        subscribe();
      })

      const unsubscribeButton = document.getElementById('unsubscribe-button');
      unsubscribeButton.addEventListener('click', () => {
        unsubscribe();
      })
    }

    const savedBtn = document.getElementById('saved-stories-btn');
    savedBtn.addEventListener('click', () => {
      window.location.hash = '#/saved-stories';
    });

    const storiesContainer = document.getElementById('stories-container');
    const token = localStorage.getItem('token');

    if (!token) {
      storiesContainer.innerHTML = `
        <p>Silakan <a href="#/login">login</a> terlebih dahulu untuk melihat story.</p>
      `;
      return;
    }

    try {
      const stories = await getData();

      if (stories.length === 0) {
        storiesContainer.innerHTML = '<p>Tidak ada story tersedia.</p>';
        return;
      }

      storiesContainer.innerHTML = stories
        .map(
          (story) => `
          <div class="story-card">
            <img src="${story.photoUrl}" alt="${story.description}" class="story-img" />
            <h2>${story.name}</h2>
            <p>${story.description}</p>
            <button><a href="#/detail/${story.id}" class="detail-link">Lihat Detail</a></button>
            <button class="save-story-btn" data-id="${story.id}">Simpan</button>
            <small>${new Date(story.createdAt).toLocaleString()}</small>
          </div>
        `
        )
        .join('');

      document.querySelectorAll('.save-story-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const storyId = btn.dataset.id;
          const storyData = stories.find(s => s.id === storyId);
          if (storyData) {
            await saveStory(storyData);
            alert(`Story "${storyData.name}" berhasil disimpan!`);
          }
        });
      });

    } catch (error) {
      container.innerHTML = `<p class="error">Gagal memuat story: ${error.message}</p>`;
    }
  }

}
