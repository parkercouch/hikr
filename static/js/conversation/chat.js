/* eslint-env jquery */
/* global io, senderId, conversationId */
console.log('sockets loaded');

$(() => {
  const socket = io('/chat');
  socket.emit('join private', conversationId);
  $('#chat-form').submit((e) => {
    e.preventDefault();
    const message = {
      senderId,
      content: $('#input-msg').val(),
      conversationId,
    };
    // socket.emit('chat message', message);
    // socket.to(`conversation#{convId}`).emit('chat message', message);
    socket.emit('chat message', message);
    // $('#messages').append($('<li class="red">').text(`You: ${message}`));
    $('#input-msg').val('');
    return false;
  });
  socket.on('chat message', (msg) => {
    // add classes for formatting here
    console.log(msg);
    $('#messages').append($('<li>').text(msg.content));
  });
});
