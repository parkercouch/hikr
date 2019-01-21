// ENV
require('dotenv').config();

// MODULE REQUIRES
const express = require('express');
const flash = require('connect-flash');
const parser = require('body-parser');
const Session = require('express-session');
const RedisStore = require('connect-redis')(Session);
const sharedsession = require('express-socket.io-session');
const cloudinary = require('cloudinary').v2;
const methodOverride = require('method-override');
const path = require('path');
const redis = require('redis');

let client;
let session;

// Use redis-mock in development
// Heroku redis in production
if (process.env.NODE_ENV === 'production') {
  const herokuRedis = require('url').parse(process.env.REDIS_URL);
  const redisDB = redis.createClient(herokuRedis.port, herokuRedis.hostname);
  redisDB.auth(herokuRedis.auth.split(':')[1]);

  session = Session({
    store: new RedisStore({ client: redisDB }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  });
} else {
  const mockRedis = require('redis-mock');
  client = mockRedis.createClient();

  session = Session({
    store: new RedisStore({ client }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  });
}


// APP SETUP
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CUSTOM FILE REQUIRES
const passport = require('./config/passportConfig');

// DATABASE
const db = require('./models');

// CONSTANTS
const PORT = process.env.PORT || 3000;

// SETTINGS
app.set('view engine', 'pug');

// MIDDLEWARE
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'static')));
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
io.of('/match').use(sharedsession(session, {
  autoSave: true,
}));

// ROUTES
app.get('/', (req, res) => {
  res.render('landing');
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
    // If a bad message is sent then abort!
    if (!message.senderId || !message.content || !message.conversationId) {
      return;
    }

    // db.message.create(message)
    db.message.build(message)
      .save(['senderId', 'conversationId', 'content'])
      .then().catch((err) => {
        console.log(err);
      });
    privateChat.to(`conversation${message.conversationId}`).emit('chat message', message);
  });
});

// SOCKET.IO /MATCH NAMESPACE
const match = io.of('/match');
match.on('connection', (socket) => {
  socket.on('nope', (data) => {
    console.log(data);
    console.log('Nope!');
    return match.to(socket.id).emit('nope', 'See ya!');
  });

  socket.on('yep', async (userToId) => {
    try {
      // Create a one way match
      await db.matching.create({
        userFromId: socket.handshake.session.passport.user,
        userToId,
      });

      // Check if the other user is matching back
      const twoWayMatch = await db.matching.findOne({
        where: {
          userFromId: userToId,
          userToId: socket.handshake.session.passport.user,
        },
      });

      if (!twoWayMatch) {
        return match.to(socket.id).emit('waiting', 'No word back');
      }

      const newConversation = await db.conversation.create({
        name: `Conversation between ${userToId} and ${socket.handshake.session.passport.user}`,
      });

      const newAssociations = [
        {
          userId: userToId,
          conversationId: newConversation.id,
        },
        {
          userId: socket.handshake.session.passport.user,
          conversationId: newConversation.id,
        },
      ];

      db.userConversation.bulkCreate(newAssociations);
    } catch (err) {
      console.log(err);
    }
    return match.to(socket.id).emit('yep', `You matched ${userToId}`);
  });
});


// CONTROLLERS
app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));
app.use('/conversation', require('./controllers/conversation'));
app.use('/user', require('./controllers/user'));
app.use('/search', require('./controllers/search'));


// LISTEN
server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
