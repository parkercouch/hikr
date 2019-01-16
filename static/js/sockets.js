/* global io */

document.addEventListener('DOMContentLoaded', (event) => {
  const socket = io();
  // Need to send data to register user
  const data = null;
  socket.emit('login', data);

  // Will deal with push notifications
  socket.addEventListener('notification', (msg) => {
    const newNotification = document.createElement('li');
    newNotification.textContent = msg.content;
    document.getElementById('alerts').appendChild(newNotification);
  });
});
