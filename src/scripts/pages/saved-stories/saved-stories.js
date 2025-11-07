import { getSavedStories,deleteSavedStory } from "../../data/idb";

export default class SavedStoriesPage {
  async render() {
    return `
      <section class="saved-stories-container">
        <h1>Saved Stories</h1>
        <div id="saved-stories-list" class="stories-grid"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('saved-stories-list');
    const stories = await getSavedStories();

    if (!stories || stories.length === 0) {
      container.innerHTML = '<p>Tidak ada story tersimpan.</p>';
      return;
    }

    container.innerHTML = stories
      .map(
        story => `
        <div class="story-card">
          <img src="${story.photoUrl}" alt="${story.description}" class="story-img" />
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <button class="delete-saved-btn" data-id="${story.id}">Hapus</button>
          <small>${new Date(story.createdAt).toLocaleString()}</small>
        </div>
      `
      )
      .join('');

    document.querySelectorAll('.delete-saved-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await deleteSavedStory(id);
        alert('Story berhasil dihapus!');
        this.afterRender(); // refresh list
      });
    });
  }
}
