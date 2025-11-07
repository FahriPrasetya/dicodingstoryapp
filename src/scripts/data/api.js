import CONFIG from '../config';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/your/endpoint/here`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORIES_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
};

export async function getData() {
  const token = localStorage.getItem('token');

  const response = await fetch(ENDPOINTS.STORIES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.listStory;
}

export async function addStory(formData) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Anda harus login terlebih dahulu.');

  const response = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, 
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);

  return result;
}

export async function addStoryGuest(formData) {
  const response = await fetch(ENDPOINTS.STORIES_GUEST, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function getStoryDetail(id) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.story;
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const token = localStorage.getItem('token');
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });
 
  const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });
  const json = await response.json();
 
  return {
    ...json,
    ok: response.ok,
  };
}
 
export async function unsubscribePushNotification({ endpoint }) {
  const token = localStorage.getItem('token');
  const data = JSON.stringify({ endpoint });
 
  const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });
  const json = await response.json();
 
  return {
    ...json,
    ok: response.ok,
  };
}