import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Container, Typography, TextField, Button, Box, Card,
  Select, MenuItem, FormControl, InputLabel, Dialog,
  CircularProgress
} from '@mui/material';

const AdminTournaments = () => {
  const { user, token } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mode: 'KO',
    max_players: 16,
    start_date: ''
  });
  const [open, setOpen] = useState(false);

  // fetchTournaments als Callback mit deps
  const fetchTournaments = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/tournaments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTournaments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Turniere laden Fehler:', error);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // useEffect mit korrekten deps
  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    fetchTournaments();
  }, [user?.role, fetchTournaments]);  // ✅ deps gefixt!

  const handleCreateTournament = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/tournaments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setOpen(false);
        setFormData({ 
          title: '', 
          description: '', 
          mode: 'KO', 
          max_players: 16, 
          start_date: '' 
        });
        fetchTournaments();  // ✅ Refresh nach Create
      } else {
        const errorData = await res.json();
        alert(`Fehler: ${errorData.error || 'Turnieranlage fehlgeschlagen'}`);
      }
    } catch (error) {
      console.error('Turnieranlage Fehler:', error);
      alert('Netzwerkfehler');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          🔒 Admin-Rechte erforderlich
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom color="white">
        ⚙️ Admin Panel - Turniere
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)} 
        sx={{ mb: 4 }}
        startIcon="➕"
      >
        Neues Turnier anlegen
      </Button>

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} color="white">
            Turniere laden...
          </Typography>
        </Box>
      )}

      {/* Turnierliste */}
      {!loading && tournaments.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" color="white" gutterBottom>
            Deine Turniere ({tournaments.length})
          </Typography>
          <Grid container spacing={2}>
            {tournaments.map(tournament => (
              <Grid item xs={12} sm={6} md={4} key={tournament.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{tournament.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tournament.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Neues Turnier anlegen
          </Typography>
          
          <TextField
            fullWidth
            label="Titel *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Beschreibung"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Modus</InputLabel>
            <Select
              value={formData.mode}
              label="Modus"
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
            >
              <MenuItem value="KO">K.O.-System</MenuItem>
              <MenuItem value="ROUND_ROBIN">Round Robin</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Max Spieler"
            type="number"
            value={formData.max_players}
            onChange={(e) => setFormData({ ...formData, max_players: Number(e.target.value) })}
            sx={{ mb: 2 }}
            inputProps={{ min: 2, max: 128 }}
          />
          
          <TextField
            fullWidth
            label="Startdatum (optional)"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={handleCreateTournament}
              disabled={!formData.title.trim()}
            >
              Turnier anlegen
            </Button>
            <Button 
              fullWidth 
              onClick={() => setOpen(false)}
              color="inherit"
            >
              Abbrechen
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default AdminTournaments;
