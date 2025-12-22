const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

// 🟢 GLOBALE DB CONNECTION
let sequelize;
let User;

const initDb = async () => {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'turnierpro',
      process.env.DB_USER || 'root',
      process.env.DB_PASS || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mariadb',
        logging: false
      }
    );

    User = sequelize.define('User', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(50), unique: true, allowNull: true },
      displayname: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
      password_hash: { type: DataTypes.STRING(255), allowNull: false, field: 'password_hash' },
      role: { type: DataTypes.ENUM('ADMIN', 'PLAYER'), defaultValue: 'PLAYER' },
      discord_name: DataTypes.STRING(100),
      tiktok_name: DataTypes.STRING(100),
      mobile: DataTypes.STRING(20)
    }, {
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 12);
          }
        }
      }
    });

    await sequelize.authenticate();
    console.log('✅ Sequelize DB Connected!');
  }
  return User;
};

// 🟢 REGISTER
router.post('/register', async (req, res) => {
  try {
    const UserModel = await initDb();
    console.log('📝 Register attempt:', req.body);
    
    const { displayname, email, password, username, discord_name, tiktok_name, mobile } = req.body;

    if (!displayname || !email || !password) {
      return res.status(400).json({ error: 'Displayname, Email und Password erforderlich' });
    }

    const user = await UserModel.create({
      displayname,
      email: email.toLowerCase(),
      password_hash: password,
      username: username || null,
      discord_name: discord_name || null,
      tiktok_name: tiktok_name || null,
      mobile: mobile || null,
      role: 'PLAYER'
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'supersecretfallback-turnierpro-2025',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayname: user.displayname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Register Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 🟢 LOGIN
router.post('/login', async (req, res) => {
  try {
    const UserModel = await initDb();
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Password erforderlich' });
    }

    const user = await UserModel.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Falsche Anmeldedaten' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'supersecretfallback-turnierpro-2025',
      { expiresIn: '7d' }
    );

    console.log('✅ Login success:', user.displayname, user.role);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayname: user.displayname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
});

// 🟢 ME - JWT VALIDIEREN + USER FETCH
router.get('/me', async (req, res) => {
  try {
    console.log('🔍 /me called - Auth Header:', req.headers.authorization);
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Kein Token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretfallback-turnierpro-2025');
    const UserModel = await initDb();
    
    const user = await UserModel.findByPk(decoded.id, {
      attributes: ['id', 'username', 'displayname', 'email', 'role']
    });

    if (!user) {
      return res.status(401).json({ error: 'User nicht gefunden' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayname: user.displayname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ /me Error:', error.message);
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

// 🟢 TEST
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API läuft perfekt! 🏆' });
});

module.exports = router;
