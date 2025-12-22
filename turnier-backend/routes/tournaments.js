const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { Tournament } = require('../models');
const router = express.Router();
const { Op } = require('sequelize'); // 🔥 IMPORT!

router.get('/', async (req, res) => {
  try {
    console.log('🔍 GET /api/tournaments'); // DEBUG
    
    const tournaments = await Tournament.findAll({
      where: { 
        status: { [Op.notIn]: ['DRAFT'] }  // ✅ Op importiert!
      },
      order: [['created_at', 'DESC']]
    });
    
    console.log('✅ Tournaments gefunden:', tournaments.length); // DEBUG
    res.json(tournaments);
  } catch (error) {
    console.error('💥 Tournament Error:', error); // Backend Console!
    res.status(500).json({ error: error.message });
  }
});


// 🔥 ADMIN: MEINE TURNiere
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Admin Tournaments für User:', req.user.id);
    
    const tournaments = await Tournament.findAll({
      where: { created_by: req.user.id }, // 🔥 NUR EIGENE!
      order: [['created_at', 'DESC']]
    });
    
    console.log('✅ Admin Tournaments:', tournaments.length);
    res.json(tournaments);
  } catch (error) {
    console.error('💥 Admin Tournaments Error:', error);
    res.status(500).json({ error: error.message });
  }
});


// 🔥 NEUES Turnier (ADMIN)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, mode, max_players, description, prizes } = req.body;
    const tournament = await Tournament.create({
      title, mode, max_players: max_players || 16,
      description: description || '',
      prizes: prizes || '',
      created_by: req.user.id,
      status: 'DRAFT'
    });
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔥 Turnier Details
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Turnier nicht gefunden' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 ANMELDUNG
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament || tournament.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Anmeldung nicht möglich' });
    }
    
    const players = tournament.players || [];
    if (players.some(p => p.userId === req.user.id)) {
      return res.status(400).json({ error: 'Bereits angemeldet' });
    }
    
    if (players.length >= tournament.max_players) {
      return res.status(400).json({ error: 'Turnier voll' });
    }
    
    players.push({
      id: players.length + 1,
      userId: req.user.id,
      name: req.user.displayname || req.user.username
    });
    
    tournament.players = players;
    await tournament.save();
    
    res.json({ success: true, message: '✅ Angemeldet!', players });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔥 STATUS UPDATE - DRAFT → OPENED/ACTIVE
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`🔄 Status Update: ${id} → ${status} by ${req.user.id}`);
    
    // ✅ Valid Status prüfen
    const validStatuses = ['DRAFT', 'OPENED', 'ACTIVE', 'FINISHED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Ungültiger Status' });
    }
    
    // ✅ Tournament finden
    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Turnier nicht gefunden' });
    }
    
    // ✅ Nur Eigentümer darf ändern
    if (tournament.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Nicht autorisiert' });
    }
    
    // ✅ DRAFT → OPENED/ACTIVE erlauben
    if (tournament.status === 'DRAFT' && (status === 'OPENED' || status === 'ACTIVE')) {
      tournament.status = status;
      await tournament.save();
      
      console.log(`✅ Status geändert: ${tournament.title} → ${status}`);
      res.json({ 
        success: true, 
        tournament: {
          id: tournament.id,
          title: tournament.title,
          status: tournament.status
        }
      });
    } else {
      res.status(400).json({ error: 'Statusänderung nicht erlaubt' });
    }
  } catch (error) {
    console.error('💥 Status Update Error:', error);
    res.status(500).json({ error: 'Server Fehler' });
  }
});


module.exports = router;
