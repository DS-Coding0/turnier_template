import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Paper, TextField, Button, Typography, Box, Alert, Tabs, Tab,
  Divider, CircularProgress 
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';  // 🟢 AKTIVIERT!

const Login = () => {
  const [tab, setTab] = useState(0); // 0=Login, 1=Register
  const [formData, setFormData] = useState({
    email: '', password: '', displayname: '', username: '', discord_name: '',
    tiktok_name: '', mobile: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth(); // 🟢 useAuth!
  const navigate = useNavigate();

  // 🟢 AUTO-REDIRECT wenn bereits eingeloggt!
  useEffect(() => {
    if (!authLoading && user) {
      console.log('🚀 Auto-redirect zu /tournaments - User:', user.role);
      navigate('/tournaments');
    }
  }, [user, authLoading, navigate]);

  // 🟢 Ladebildschirm während Auth Check
  if (authLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  // 🟢 Bereits eingeloggt → Nichts rendern (Redirect läuft)
  if (user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🚀 Login attempt:', { email: formData.email, tab }); // 🟢 DEBUG

    const url = tab === 0 ? '/api/auth/login' : '/api/auth/register';
    const body = tab === 0 
      ? { email: formData.email, password: formData.password }
      : {
          displayname: formData.displayname,
          email: formData.email,
          password: formData.password,
          username: formData.username,
          discord_name: formData.discord_name,
          tiktok_name: formData.tiktok_name || '',
          mobile: formData.mobile || ''
        };

    try {
      console.log('📡 Fetching:', `http://localhost:3001${url}`); // 🟢 DEBUG
      const res = await fetch(`http://localhost:3001${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      console.log('📥 Response:', data); // 🟢 DEBUG
      
      if (!res.ok) throw new Error(data.error || 'Server Error');

      // 🟢 localStorage FORCE SAVE (mit DEBUG!)
      console.log('💾 SAVING TOKEN:', data.token?.substring(0, 20) + '...');
      console.log('💾 SAVING USER:', data.user);
      
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 🟢 VERIFIZIEREN!
        console.log('✅ VERIFIED TOKEN:', localStorage.getItem('token')?.substring(0, 20));
        console.log('✅ VERIFIED USER:', JSON.parse(localStorage.getItem('user')));
        
        alert('✅ Erfolg!');
        navigate('/', { replace: true });
      } else {
        throw new Error('Kein Token/User in Response');
      }
    } catch (err) {
      console.error('❌ CATCH ERROR:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 5 }}>
        <Typography variant="h3" gutterBottom align="center" color="primary">
          🎮 TurnierManager
        </Typography>
        
        <Tabs value={tab} onChange={(e, v) => setTab(v)} centered sx={{ mb: 4 }}>
          <Tab label="Login" />
          <Tab label="Registrieren" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="E-Mail"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Passwort"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            required
          />
          <Divider sx={{ my: 2 }} />
          
          {tab === 1 && (
            <>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Displayname"
                value={formData.displayname}
                onChange={(e) => setFormData({ ...formData, displayname: e.target.value })}
                margin="normal"
                placeholder="Spielername"
                required
              />
              <TextField
                fullWidth
                label="Discord"
                value={formData.discord_name}
                onChange={(e) => setFormData({ ...formData, discord_name: e.target.value })}
                margin="normal"
                placeholder="player#1234"
              />
              <TextField
                fullWidth
                label="Tiktok"
                value={formData.tiktok_name}
                onChange={(e) => setFormData({ ...formData, tiktok_name: e.target.value })}
                margin="normal"
                placeholder="@username"
              />
              <TextField
                fullWidth
                label="Mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                margin="normal"
                placeholder="+49123456789"
              />
            </>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (tab === 0 ? 'Login' : 'Registrieren')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
