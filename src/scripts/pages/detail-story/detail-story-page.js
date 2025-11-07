import { getStoryDetail } from '../../data/api.js';

export default class DetailStoryPage {
  async render() {
    return `
      <section class="container">
      <h1 class="story-detail-title">Detail Story</h1>
        <div id="story-detail"></div>
      </section>
    `;
  }

  async afterRender() {
    const url = window.location.hash.slice(1); 
    const storyId = url.split('/')[2]; 

    try {
      const story = await getStoryDetail(storyId);
      const storyContainer = document.querySelector('#story-detail');
      storyContainer.innerHTML = `
        <div class="story-detail-card">
          <img src="${story.photoUrl}" alt="${story.name}" />
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <small>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</small>
        </div>
      `;
    } catch (error) {
      console.error(error);
      document.querySelector('#story-detail').innerHTML = `<p>Gagal memuat detail story.</p>`;
    }
  }
}
