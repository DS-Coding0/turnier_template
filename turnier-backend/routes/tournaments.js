const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!global.Tournament) {
      console.log('⚠️ Tournament Model lädt noch...');
      return res.json([]);
    }
    
    console.log('📋 Lade Turniere aus DB...');
    
    // 🟢 ALLE Turniere (kein Filter erstmal)
    const tournaments = await global.Tournament.findAll({
      order: [['created_at', 'DESC']]  // 🟢 created_at!
    });
    
    console.log(`✅ ${tournaments.length} Turniere gefunden!`);
    res.json(tournaments);
  } catch (error) {
    console.error('❌ DB Error:', error.message);
    res.status(500).json({ error: 'DB Fehler' });
  }
});

module.exports = router;
