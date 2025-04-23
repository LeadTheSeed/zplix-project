// Simple online user counter using localStorage and BroadcastChannel
// This does NOT require a backend and works for users on the same domain/tab set.
(function(){
  const KEY = 'ZPLIX_ONLINE_USERS';
  const CHANNEL = 'zplix_online_users';
  const bc = window.BroadcastChannel ? new BroadcastChannel(CHANNEL) : null;
  function updateCount() {
    let users = JSON.parse(localStorage.getItem(KEY) || '[]');
    const now = Date.now();
    // Remove users inactive for 20 seconds
    users = users.filter(u => now - u.ts < 20000);
    // Mark/update this tab
    const id = window.name || (window.name = Math.random().toString(36).slice(2));
    const idx = users.findIndex(u => u.id === id);
    if(idx === -1) users.push({id, ts: now});
    else users[idx].ts = now;
    localStorage.setItem(KEY, JSON.stringify(users));
    if(bc) bc.postMessage('update');
    return users.length;
  }
  function poll() {
    const count = updateCount();
    document.querySelectorAll('.zplix-online-users').forEach(e => e.textContent = count);
    setTimeout(poll, 5000);
  }
  if(bc) bc.onmessage = poll;
  window.addEventListener('storage', poll);
  window.addEventListener('focus', poll);
  // Expose for manual update
  window.updateZplixOnlineUsers = poll;
  setTimeout(poll, 500);
})();
