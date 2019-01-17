/* eslint-disable prefer-arrow-callback */
/* global io, senderId, conversationId */

document.addEventListener('DOMContentLoaded', (event) => {
  // Open new socket.io connection for this conversation
  const socket = io('/match');
  let waiting = false;
  // socket.emit('join conversation', conversationId);

  // Grab input and send to socket.io to deal with
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

  // Grab message from socket.io broadcast and format/add to list
  socket.addEventListener('yep', (msg) => {
    waiting = false;
    console.log(msg);
  });

  socket.addEventListener('nope', (msg) => {
    waiting = false;
    console.log(msg);
  });

});
