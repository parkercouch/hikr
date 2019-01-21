/* eslint-disable no-use-before-define */
/* global io, senderId, conversationId, msgStyles, autosize */

msgStyles.message = msgStyles.message.split(' ');
msgStyles.sent = msgStyles.sent.split(' ');
msgStyles.received = msgStyles.received.split(' ');
msgStyles.padding = msgStyles.padding.split(' ');


document.addEventListener('DOMContentLoaded', (event) => {
  const INPUT = document.getElementById('input-msg');
  const MESSAGES = document.getElementById('messages');
  const MESSAGE_CONTAINER = document.querySelector('.messageWrapper');

  scrollToBottom(MESSAGE_CONTAINER);
  autosize(INPUT);

  // Open new socket.io connection for this conversation
  const socket = io('/chat');
  socket.emit('join conversation', conversationId);

  // Grab input and send to socket.io to deal with
  document.querySelector('#chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('chat message', {
      senderId,
      content: INPUT.value,
      conversationId,
    });
    INPUT.value = '';
    autosize.update(INPUT);
    return false;
  });

  // Submit from textarea
  INPUT.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      socket.emit('chat message', {
        senderId,
        content: INPUT.value,
        conversationId,
      });
      INPUT.value = '';
      autosize.update(INPUT);
    }
    return false;
  });

  // Grab message from socket.io broadcast and format/add to list
  socket.addEventListener('chat message', (msg) => {
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

    MESSAGES.appendChild(newMessage);
    scrollToBottom(MESSAGE_CONTAINER);
  });
});

function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}
