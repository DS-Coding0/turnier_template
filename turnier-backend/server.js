require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Sequelize } = require('sequelize');

// Sequelize Instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { host: process.env.DB_HOST || 'localhost', dialect: 'mariadb' }
);

// Models laden
const User = require('./models/User')(sequelize, Sequelize.DataTypes);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/messages', require('./routes/messages'));

// Socket.IO
io.on('connection', (socket) => {
  socket.on('join:channel', (channelId) => socket.join(channelId));
  socket.on('message:channel', (data) => io.to(data.channelId).emit('message', data));
});

// Start
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB Connected!');
    
    // sequelize.sync({ alter: true });  ← KOMMENTIERT / ENTFERNT!
    console.log('✅ Ready (Migration bereits ausgeführt)');
    
    server.listen(3001, () => console.log('🚀 Server: http://localhost:3001'));
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
