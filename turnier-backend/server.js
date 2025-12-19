require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { Sequelize, Op } = require('sequelize');

// Sequelize Instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { 
    host: process.env.DB_HOST || 'localhost', 
    port: process.env.DB_PORT || 3306, 
    dialect: 'mariadb',
    logging: false
  }
);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🟢 FALLBACK Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server läuft perfekt! 🏆', 
    timestamp: new Date().toISOString(),
    dbConnected: !!global.sequelize,
    tournamentAvailable: !!global.Tournament
  });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Socket.IO Client connected');
  socket.on('join:channel', (channelId) => socket.join(channelId));
  socket.on('message:channel', (data) => io.to(data.channelId).emit('message', data));
});

// 🟢 SERVER START
server.listen(3001, async () => {
  console.log('🚀 Server: http://localhost:3001 LIVE!');
  
  try {
    await sequelize.authenticate();
    console.log('✅ DB Connected!');
    
    // 🟢 Tournament Model mit created_at (DB Schema)
    const Tournament = require('./models/Tournament')(sequelize, Sequelize.DataTypes);
    global.Tournament = Tournament;
    global.Op = Op;
    global.sequelize = sequelize;
    console.log('✅ Tournament Model geladen!');
    
    // 🟢 Routes laden
    try {
      app.use('/api/auth', require('./routes/auth'));
      console.log('✅ Auth routes geladen');
    } catch (e) {
      console.log('⚠️ Auth routes übersprungen');
    }
    
    try {
      app.use('/api/tournaments', require('./routes/tournaments'));
      console.log('✅ Tournament routes geladen!');
    } catch (e) {
      console.error('❌ Tournament routes Fehler:', e.message);
    }
    
    console.log('✅ Server komplett bereit!');
    
  } catch (error) {
    console.error('❌ Startup Error:', error.message);
  }
});
