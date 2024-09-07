const dbPromise = idb.openDB('AITuberChat', 1, {
  upgrade(db) {
    db.createObjectStore('chats', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('users', { keyPath: 'username' });
  },
});

async function saveChat(username, message, isAI) {
  const db = await dbPromise;
  const tx = db.transaction('chats', 'readwrite');
  const store = tx.objectStore('chats');
  await store.add({
    username,
    message,
    isAI,
    timestamp: new Date().toISOString(),
  });
  await tx.done;
}

async function getChats(username) {
  const db = await dbPromise;
  const tx = db.transaction('chats', 'readonly');
  const store = tx.objectStore('chats');
  return await store.index('username').getAll(username);
}

async function saveUser(username) {
  const db = await dbPromise;
  const tx = db.transaction('users', 'readwrite');
  const store = tx.objectStore('users');
  await store.put({ username, lastLogin: new Date().toISOString() });
  await tx.done;
}

async function getUser(username) {
  const db = await dbPromise;
  const tx = db.transaction('users', 'readonly');
  const store = tx.objectStore('users');
  return await store.get(username);
}
