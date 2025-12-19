import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Container, Typography, Card, CardContent, CardActions,
  Button, Chip, Box, Grid, CircularProgress, Alert
} from '@mui/material';

const TournamentList = () => {
  const { user, token } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState({});
  const [error, setError] = useState(null);

  // fetchTournaments als useCallback mit deps
  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/tournaments');
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      
      const data = await res.json();  // ✅ AWAIT HIER!
      
      // Sicherstellen dass Array
      if (Array.isArray(data)) {
        setTournaments(data);
      } else {
        console.warn('Turniere keine Array:', data);
        setTournaments([]);
      }
    } catch (error) {
      console.error('Turniere Fehler:', error);
      setError(error.message);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect mit korrekten deps
  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const handleRegister = async (tournamentId) => {
    if (!token) {
      alert('Bitte zuerst einloggen');
      return;
    }

    setRegisterLoading(prev => ({ ...prev, [tournamentId]: true }));
    try {
      const res = await fetch(`http://localhost:3001/api/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        alert('✅ Registrierung erfolgreich!');
        fetchTournaments(); // Refresh Liste
      } else {
        const errorData = await res.json();
        alert(`❌ ${errorData.error || 'Registrierung fehlgeschlagen'}`);
      }
    } catch (error) {
      console.error('Register Fehler:', error);
      alert('❌ Netzwerkfehler bei Registrierung');
    } finally {
      setRegisterLoading(prev => ({ ...prev, [tournamentId]: false }));
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2, color: 'white' }} variant="h6">
          Turniere laden...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Fehler beim Laden der Turniere: {error}
        </Alert>
        <Button variant="contained" onClick={fetchTournaments}>
          Erneut versuchen
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" color="white" gutterBottom>
          🏆 Alle Turniere
        </Typography>
        {user?.role === 'ADMIN' && (
          <Button 
            variant="contained" 
            size="large" 
            href="/admin-tournaments"
            sx={{ mt: 2 }}
          >
            ➕ Neues Turnier anlegen
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {tournaments.map(tournament => (
          <Grid item xs={12} md={6} lg={4} key={tournament.id}>
            <Card sx={{ 
              height: '100%', 
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {tournament.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tournament.description || 'Keine Beschreibung'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={tournament.mode} 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  <Chip 
                    label={tournament.status} 
                    color={tournament.status === 'DRAFT' ? 'default' : 'success'} 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Max Spieler: {tournament.max_players}
                </Typography>
                {tournament.start_date && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Start: {new Date(tournament.start_date).toLocaleDateString('de-DE')}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button size="small" variant="outlined">
                  Details
                </Button>
                {user && (
                  <Button
                    size="small"
                    variant="contained"
                    disabled={registerLoading[tournament.id] || !token}
                    onClick={() => handleRegister(tournament.id)}
                  >
                    {registerLoading[tournament.id] ? 
                      <CircularProgress size={20} color="inherit" /> : 
                      'Anmelden'
                    }
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {tournaments.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="white">
            🏪 Noch keine Turniere verfügbar
          </Typography>
          {user?.role === 'ADMIN' && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              <Button href="/admin-tournaments" variant="contained" sx={{ mt: 1 }}>
                Erstes Turnier anlegen
              </Button>
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default TournamentList;
