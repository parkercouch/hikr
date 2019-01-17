// ENV
require('dotenv').config();

// MODULE REQUIRES
const express = require('express');
const flash = require('connect-flash');
const parser = require('body-parser');
const session = require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
});
const sharedsession = require('express-socket.io-session');

// APP SETUP
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// CUSTOM FILE REQUIRES
const passport = require('./config/passportConfig');

// DATABASE
const db = require('./models');

// CONSTANTS
const PORT = 3000;

// SETTINGS
app.set('view engine', 'pug');

// MIDDLEWARE
app.use(express.static(`${__dirname}/static`));
app.use(parser.urlencoded({ extended: false }));
app.use(session);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.user = req.user;
  next();
});

// SOCKET.IO
io.use(sharedsession(session, {
  autoSave: true,
}));

// ROUTES
app.get('/', (req, res) => {
  res.render('home');
  // res.send('Home');
});


// SOCKETS.IO / NAMESPACE
io.on('connection', (socket) => {
  socket.on('login', (data) => {
    console.log(data);
    // Need to add some sort of record to allow
    // push style notifications to user
  });
});

// SOCKET.IO /CHAT NAMESPACE
const privateChat = io.of('/chat');
privateChat.on('connection', (socket) => {
  socket.on('join conversation', (conversationId) => {
    socket.join(`conversation${conversationId}`);
  });
  socket.on('chat message', (message) => {
    db.message.build(message)
      .save(['senderId', 'conversationId', 'content'])
      .then((newMessage) => {
        console.log(newMessage);
      }).catch((err) => {
        console.log(err);
      });
    console.log(message);
    privateChat.to(`conversation${message.conversationId}`).emit('chat message', message);
  });
});

// SOCKET.IO /MATCH NAMESPACE
const match = io.of('/match');
match.on('connection', (socket) => {
  // socket.on('match session', (user) => {
  //   socket.join(`conversation${conversationId}`);
  // });

  socket.on('nope', (data) => {
    console.log(data);
    console.log('Nope!');
  });

  socket.on('yep', (matchingUserId) => {
    console.log(matchingUserId);
    match.to(socket.id).emit('yep', `You matched ${matchingUserId}`);
  });
});


// CONTROLLERS
app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));
app.use('/conversation', require('./controllers/conversation'));
app.use('/user', require('./controllers/user'));
app.use('/search', require('./controllers/search'));


// LISTEN
server.listen(3000, () => {
  console.log('listening on 3000');
});
