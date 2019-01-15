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

// TESTING SOCKETS

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('chat message', (msg) => {
    console.log(`Message: ${msg}`);
    if (socket.handshake.session.passport) {
      console.log(socket.handshake.session);
      db.user.findOne({
        where: {
          id: socket.handshake.session.passport.user,
        },
        include: [db.profile],
      }).then((foundUser) => {
        socket.broadcast.emit('chat message', `${foundUser.profile.displayName}: ${socket.id}: ${msg}`);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      socket.broadcast.emit('chat message', `${socket.id}: ${msg}`);
    }
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


// CONTROLLERS
app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));
app.use('/conversation', require('./controllers/conversation'));
app.use('/user', require('./controllers/user'));
app.use('/search', require('./controllers/search'));


// LISTEN
// app.listen(PORT);
// server listen so that sockets can also work on same server
server.listen(3000, () => {
  console.log('listening on 3000');
});
