import { useState, useCallback, useEffect } from 'react'; // 🔥 useEffect!
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// 🔥 HELPER FUNCTIONS - OBEN!
const getStatusColor = (status) => {
  const colors = {
    'DRAFT': '#6b7280',
    'ACTIVE': '#10b981',
    'FINISHED': '#f59e0b'
  };
  return colors[status] || '#6b7280';
};

const getStatusText = (status) => {
  const texts = {
    'DRAFT': 'Entwurf',
    'OPENED': 'Offen',
    'ACTIVE': 'Laufend',
    'FINISHED': 'Abgeschlossen'
  };
  return texts[status] || status;
};

const AdminTournaments = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false); // 🔥 false!
  const [error, setError] = useState(null); // 🔥 ERROR STATE!
  const [newTournament, setNewTournament] = useState({
    title: '',
    mode: 'KO',
    max_players: 16,
    description: ''
  });

  // 🔥 1. fetchTournaments - ADMIN ENDPOINT
  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        console.warn('❌ Kein Token/User');
        setTournaments([]);
        return;
      }
      
      const res = await fetch('http://localhost:3001/api/tournaments/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📡 Status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        setTournaments(Array.isArray(data) ? data : []);
      } else {
        const text = await res.text();
        console.error('❌', res.status, text);
        setError(`API Error ${res.status}`);
        setTournaments([]);
      }
    } catch (err) {
      console.error('💥', err);
      setError('Netzwerkfehler');
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 🔥 2. AUTO LOAD bei Mount!
  useEffect(() => {
    if (user) {
      fetchTournaments();
    }
  }, [user, fetchTournaments]);

  // 🔥 3. createTournament
  const createTournament = useCallback(async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/tournaments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTournament)
      });
      
      if (res.ok) {
        setNewTournament({ title: '', mode: 'KO', max_players: 16, description: '' });
        fetchTournaments();
      } else {
        alert('Fehler beim Erstellen');
      }
    } catch (err) {
      alert('Fehler beim Erstellen', {err});
    }
  }, [newTournament, fetchTournaments]);

  // 🔥 4. updateStatus
  const updateStatus = useCallback(async (tournamentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/tournaments/${tournamentId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchTournaments();
    } catch (err) {
      alert('Fehler beim Status-Update', {err});
    }
  }, [fetchTournaments]);

  // 🔥 Early return wenn kein User
  if (!user) {
    return (
      <div style={{ 
        padding: '200px 20px', 
        textAlign: 'center', 
        color: 'white',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Login erforderlich</h1>
        <Link to="/login" style={{ 
          color: '#10b981', 
          fontSize: '18px', 
          textDecoration: 'none',
          padding: '12px 24px',
          background: 'rgba(16,185,129,0.2)',
          borderRadius: '20px'
        }}>
          → Zum Login
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 40px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 🔥 USER INFO */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '20px', 
          fontSize: '18px', 
          opacity: 0.8 
        }}>
          👋 Hallo, {user.displayname || user.username} ({user.role})
        </div>

        {/* 🔥 ERROR DISPLAY */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            color: '#fecaca'
          }}>
            ❌ {error}
            <button 
              onClick={fetchTournaments}
              style={{
                marginLeft: '12px',
                padding: '4px 12px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Retry
            </button>
          </div>
        )}

        <h1 style={{ 
          fontSize: '48px', 
          textAlign: 'center', 
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent'
        }}>
          🏆 Meine Turniere
        </h1>

        {/* 🔥 LOAD BUTTON */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button 
            onClick={fetchTournaments}
            disabled={loading}
            style={{
              padding: '16px 32px',
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Laden...' : '🔄 Turniere aktualisieren'}
          </button>
        </div>

        {/* 🔥 NEUES TURNier FORM */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>➕ Neues Turnier erstellen</h2>
          <form onSubmit={createTournament} style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
            <input
              value={newTournament.title}
              onChange={(e) => setNewTournament({...newTournament, title: e.target.value})}
              placeholder="Turniername (z.B. 'Winter Cup 2025')"
              style={{
                padding: '20px', 
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)', 
                borderRadius: '16px',
                color: 'white', 
                fontSize: '18px'
              }}
              required
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <select
                value={newTournament.mode}
                onChange={(e) => setNewTournament({...newTournament, mode: e.target.value})}
                style={{
                  padding: '20px', 
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderRadius: '16px',
                  color: 'white', 
                  fontSize: '18px'
                }}
              >
                <option value="KO">⚔️ K.O.-System</option>
                <option value="ROUND_ROBIN">🔄 Round Robin</option>
              </select>
              
              <input
                type="number"
                value={newTournament.max_players}
                onChange={(e) => setNewTournament({...newTournament, max_players: parseInt(e.target.value) || 16})}
                placeholder="Max Spieler"
                min="2" max="128"
                style={{
                  padding: '20px', 
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderRadius: '16px',
                  color: 'white', 
                  fontSize: '18px'
                }}
              />
            </div>

            <textarea
              value={newTournament.description}
              onChange={(e) => setNewTournament({...newTournament, description: e.target.value})}
              placeholder="Beschreibung (optional)"
              rows="3"
              style={{
                padding: '20px', 
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)', 
                borderRadius: '16px',
                color: 'white', 
                fontSize: '18px', 
                resize: 'vertical'
              }}
            />

            <button type="submit" disabled={loading} style={{
              padding: '24px', 
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', 
              border: 'none', 
              borderRadius: '20px',
              fontSize: '20px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              🏆 Turnier erstellen
            </button>
          </form>
        </div>

        {/* 📋 TURNiere LISTE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          {tournaments.map(t => (
            <div key={t.id} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '32px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>{t.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
                {t.description || 'Keine Beschreibung'}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', fontSize: '18px', flexWrap: 'wrap' }}>
                <span style={{ 
                  padding: '8px 16px', 
                  background: t.mode === 'KO' ? '#ef4444' : '#3b82f6', 
                  borderRadius: '20px' 
                }}>
                  {t.mode === 'KO' ? '⚔️ K.O.' : '🔄 Round Robin'}
                </span>
                <span style={{ 
                  padding: '8px 16px', 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '20px' 
                }}>
                  {t.max_players} Spieler max
                </span>
                <span style={{ 
                  padding: '8px 20px', 
                  background: getStatusColor(t.status),
                  color: 'white',
                  borderRadius: '20px', 
                  fontWeight: 'bold'
                }}>
                  {getStatusText(t.status)}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link 
                  to={`/tournament/${t.id}`} 
                  style={{
                    flex: 1, 
                    padding: '16px', 
                    background: '#3b82f6',
                    color: 'white', 
                    textAlign: 'center', 
                    textDecoration: 'none',
                    borderRadius: '16px', 
                    fontWeight: 'bold'
                  }}
                >
                  📋 Details
                </Link>
                {t.status === 'DRAFT' && (
                  <button 
                    onClick={() => updateStatus(t.id, 'OPENED')}
                    disabled={loading}
                    style={{
                      flex: 1, 
                      padding: '16px', 
                      background: loading ? '#6b7280' : '#10b981',
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '16px',
                      fontWeight: 'bold', 
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    🚀 Veröffentlichen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {tournaments.length === 0 && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px', 
            color: 'rgba(255,255,255,0.6)',
            fontSize: '20px'
          }}>
            Noch keine Turniere erstellt. 🎉 Erstelle dein erstes Turnier oben!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTournaments;
