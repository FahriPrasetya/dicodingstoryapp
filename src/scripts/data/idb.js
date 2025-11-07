import { openDB } from 'idb';

const DATABASE_NAME = 'saved-stories-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'savedStories';

export const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

export async function saveStory(story) {
  const db = await dbPromise;
  await db.put(OBJECT_STORE_NAME, story);
}

export async function getSavedStories() {
  const db = await dbPromise;
  return await db.getAll(OBJECT_STORE_NAME);
}

export async function deleteSavedStory(id) {
  const db = await dbPromise;
  await db.delete(OBJECT_STORE_NAME, id);
}
