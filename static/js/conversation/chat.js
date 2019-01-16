/* global io, senderId, conversationId */

document.addEventListener('DOMContentLoaded', (event) => {
  // Open new socket.io connection for this conversation
  const socket = io('/chat');
  socket.emit('join conversation', conversationId);

  // Grab input and send to socket.io to deal with
  document.querySelector('#chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('input-msg');
    socket.emit('chat message', {
      senderId,
      content: input.value,
      conversationId,
    });
    input.value = '';
    return false;
  });

  // Grab message from socket.io broadcast and format/add to list
  socket.addEventListener('chat message', (msg) => {
    const newMessage = document.createElement('li');
    newMessage.textContent = msg.content;
    if (msg.senderId === senderId) {
      newMessage.classList.add('sent');
    } else {
      newMessage.classList.add('received');
    }
    document.getElementById('messages').appendChild(newMessage);
  });
});
