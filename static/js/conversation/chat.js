/* eslint-disable no-use-before-define */
/* global io, senderId, conversationId, msgStyles */

msgStyles.message = msgStyles.message.split(' ');
msgStyles.sent = msgStyles.sent.split(' ');
msgStyles.received = msgStyles.received.split(' ');
msgStyles.padding = msgStyles.padding.split(' ');

const MESSAGE_CONTAINER = document.querySelector('.messageWrapper');

document.addEventListener('DOMContentLoaded', (event) => {
  scrollToBottom();

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
    // need to create li-div+div structure
    const newMessage = document.createElement('li');
    const messageContent = document.createElement('div');
    const messagePadding = document.createElement('div');

    newMessage.classList.add(...msgStyles.message);
    messagePadding.classList.add(...msgStyles.padding);

    messageContent.textContent = msg.content;
    if (msg.senderId === senderId) {
      messageContent.classList.add(...msgStyles.sent);
    } else {
      messageContent.classList.add(...msgStyles.received);
    }
    newMessage.appendChild(messageContent);
    newMessage.appendChild(messagePadding);

    document.getElementById('messages').appendChild(newMessage);
    scrollToBottom();
  });
});


function scrollToBottom() {
  MESSAGE_CONTAINER.scrollTop = MESSAGE_CONTAINER.scrollHeight;
}
