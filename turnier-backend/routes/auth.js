const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

// User Model DIREKT in Route definieren (funktioniert garantiert!)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mariadb'
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  displayname: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('ADMIN', 'PLAYER'), defaultValue: 'PLAYER' },
  discord_name: DataTypes.STRING(100),
  tiktok_name: DataTypes.STRING(100),
  mobile: DataTypes.STRING(20)
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password_hash = await bcrypt.hash(user.password_hash, 12);
    }
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register attempt:', req.body);
    
    const { displayname, email, password, username, discord_name, tiktok_name } = req.body;
    
    const user = await User.create({
      displayname,
      email,
      password_hash: password,  // Hook hashiert automatisch
      username,
      discord_name,
      tiktok_name
    });

    console.log('✅ User created:', user.id, user.displayname);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
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

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Falsche Anmeldedaten' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
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
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
});

module.exports = router;
