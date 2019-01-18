/* eslint-disable prefer-arrow-callback */
/* global io, senderId, conversationId */

document.addEventListener('DOMContentLoaded', (event) => {
  const alerts = document.getElementById('alerts');
  const socket = io('/match');
  let waiting = false;

  document.getElementById('yep').addEventListener('click', function handle(e) {
    e.preventDefault();
    // e.target.removeEventListener('click', handle);
    if (!waiting) {
      const id = document.getElementById('userId').dataset.userid;
      waiting = true;
      socket.emit('yep', id);
    }
    return false;
  });

  document.getElementById('nope').addEventListener('click', function handle(e) {
    e.preventDefault();
    // e.target.removeEventListener('click', handle);
    if (!waiting) {
      const id = document.getElementById('userId').dataset.userid;
      waiting = true;
      socket.emit('nope', id);
      // ANIMATION HERE
      setTimeout(() => { waiting = false; }, 1000);
    }
    return false;
  });

  socket.addEventListener('yep', (msg) => {
    waiting = false;
    console.log(msg);
    const notification = document.createElement('li');
    notification.textContent = msg;
    alerts.appendChild(notification);

    // window.location.reload();
  });

  socket.addEventListener('waiting', (msg) => {
    waiting = false;
    console.log(msg);
    
    window.location.reload();
  });

});
