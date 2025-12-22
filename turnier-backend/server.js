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
const io = new Server(server, { 
  cors: { origin: "http://localhost:5173" } 
});
const userRoutes = require('./routes/users');

// 🟢 1. MIDDLEWARE ZUERST
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// 🟢 2. API TEST ROUTE ZUERST (BEVOR NAMESPACE ROUTES!)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server läuft perfekt! 🏆', timestamp: new Date().toISOString() });
});

// 🟢 3. NAMESPACE ROUTES DANACH
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/users', userRoutes);

// 🟢 4. 404 CATCH-ALL ZULETZT
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} nicht gefunden` });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Socket.IO Client connected');
});

// 🟢 SERVER START
server.listen(3001, async () => {
  console.log('🚀 Server: http://localhost:3001 LIVE!');
  
  try {
    await sequelize.authenticate();
    console.log('✅ DB Connected!');
    
    const Tournament = require('./models/Tournament')(sequelize, Sequelize.DataTypes);
    global.Tournament = Tournament;
    global.Op = Op;
    global.sequelize = sequelize;
    console.log('✅ Tournament Model geladen!');
    
    console.log('✅ /api/test Route geladen');
    console.log('✅ /api/auth/* Routes geladen');
    console.log('✅ /api/tournaments/* Routes geladen');
    console.log('✅ Server komplett bereit!');
    
  } catch (error) {
    console.error('❌ Startup Error:', error.message);
  }
});
