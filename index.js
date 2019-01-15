// ENV
require('dotenv').config();

// REQUIRES
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const parser = require('body-parser');

// APP
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const passport = require('./config/passportConfig');

// DATABASE
// const db = require('./models');

// CONSTANTS
const PORT = 3000;

// SETTINGS
app.set('view engine', 'pug');

// MIDDLEWARE
app.use(express.static(`${__dirname}/static`));
app.use(parser.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.user = req.user;
  next();
});

// ROUTES
app.get('/', (req, res) => {
  res.render('home');
  // res.send('Home');
});

// TESTING SOCKETS

app.get('/message', (req, res) => {
  res.render('message');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('chat message', (msg) => {
    console.log(`Message: ${msg}`);
    console.log(`User: ${socket.id}`);
    socket.broadcast.emit('chat message', `${socket.id}: ${msg}`);
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
