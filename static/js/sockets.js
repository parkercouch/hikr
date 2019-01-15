/* eslint-env jquery */
/* global io */
console.log('sockets loaded');

$(() => {
  const socket = io();
  $('#message-form').submit((e) => {
    e.preventDefault();
    const message = $('#m').val();
    socket.emit('chat message', message);
    $('#messages').append($('<li class="red">').text(message));
    $('#m').val('');
    return false;
  });
  socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });
});
