const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { User } = require('../models'); // Sequelize Model
const bcrypt = require('bcryptjs');

const router = express.Router();

// 🔥 PROFIL UPDATE - SEQUELIZE FIX
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { displayname, email, discord_name, tiktok_name, mobile } = req.body;

    // ✅ NUR ERlaubte Felder sammeln
    const updateData = {};
    if (displayname !== undefined) updateData.displayname = displayname.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (discord_name !== undefined) updateData.discord_name = discord_name.trim();
    if (tiktok_name !== undefined) updateData.tiktok_name = tiktok_name.trim();
    if (mobile !== undefined) updateData.mobile = mobile.trim();

    // ✅ Email Unique Check
    if (updateData.email) {
      const existingEmail = await User.findOne({
        where: { 
          email: updateData.email, 
          id: { $ne: userId } 
        }
      });
      if (existingEmail) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email bereits vergeben' 
        });
      }
    }

    // 🔥 FIX: ZWEITER FIND für updated data
    const updatedCount = await User.update(updateData, {
      where: { id: userId }
    });

    if (!updatedCount[0]) {
      return res.status(404).json({ error: 'User nicht gefunden' });
    }

    // 🔥 AKTUALISIERTE DATEN HOLEN
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });

    res.json({
      success: true,
      message: '✅ Profil aktualisiert!',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ 
      success: false, 
      error: 'Fehler beim Speichern: ' + error.message 
    });
  }
});


// 🔥 ACCOUNT DELETE - SEQUELIZE
router.delete('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedCount = await User.destroy({
      where: { id: userId }
    });

    if (!deletedCount) {
      return res.status(404).json({ error: 'User nicht gefunden' });
    }

    res.json({
      success: true,
      message: '✅ Account gelöscht!'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(400).json({ 
      success: false, 
      error: 'Löschen fehlgeschlagen: ' + error.message 
    });
  }
});


module.exports = router;
