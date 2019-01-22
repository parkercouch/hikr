/* eslint-disable prefer-arrow-callback */
/* global io, senderId, conversationId, alertify, animateCss,
removeAnimation, enterAnimation, exitAnimationNope, exitAnimationYep */


document.addEventListener('DOMContentLoaded', (event) => {
  const alerts = document.getElementById('alerts');
  const socket = io('/match');
  let waiting = false;
  removeAnimation('.user-card-container', enterAnimation);

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

      animateCss('.user-card-container', exitAnimationNope, (elem) => {
        elem.classList.add('hidden');
        window.location.reload();
      });
      setTimeout(() => { waiting = false; }, 1000);
    }
    return false;
  });

  socket.addEventListener('yep', (conversation) => {
    waiting = false;

    alertify.confirm()
      .setHeader('<em>You Matched!</em>')
      .setting({
        message: 'You made a new connection. Start a conversation to see what adventures you can go on together!',
        closable: false,
        labels: { ok: 'Start Conversation', cancel: 'Keep Searching' },
        onok: () => { window.location.replace(`/conversation/${conversation}`); },
        oncancel: () => { window.location.reload(); },
      }).show();
  });

  socket.addEventListener('waiting', (msg) => {
    waiting = false;
    animateCss('.user-card-container', exitAnimationYep, (elem) => {
      elem.classList.add('hidden');
      window.location.reload();
    });
  });
});
