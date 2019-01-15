/* eslint-env jquery */
/* global io */
console.log('sockets loaded');

$(() => {
  const socket = io();
  $('#chat-form').submit((e) => {
    e.preventDefault();
    const message = $('#input-msg').val();
    socket.emit('chat message', message);
    $('#messages').append($('<li class="red">').text(`You: ${message}`));
    $('#input-msg').val('');
    return false;
  });
  socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });
});
