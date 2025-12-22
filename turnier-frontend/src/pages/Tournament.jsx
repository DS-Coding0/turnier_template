import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Tournament = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(false); // 🔥 false!
  const [error, setError] = useState(null);

  // 🔥 1. fetchTournament
  const fetchTournament = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setTournament(null);
        return;
      }
      
      const res = await fetch(`http://localhost:3001/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📡 Tournament Status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        setTournament(data);
      } else {
        const text = await res.text();
        console.error('❌', res.status, text);
        setError(`Error ${res.status}`);
        setTournament(null);
      }
    } catch (err) {
      console.error('💥', err);
      setError('Netzwerkfehler');
      setTournament(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 🔥 2. AUTO LOAD bei Mount!
  useEffect(() => {
    fetchTournament();
  }, [fetchTournament]);

  // 🔥 3. joinTournament
  const joinTournament = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/tournaments/${id}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchTournament();
        alert('✅ Angemeldet!');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Anmeldung fehlgeschlagen');
      }
    } catch (err) {
      alert('Anmeldung fehlgeschlagen', {err});
    }
  }, [id, fetchTournament]);

  // 🔥 4. generateBracket
  const generateBracket = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/tournaments/${id}/generate-bracket`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchTournament();
        alert('✅ Turnierbaum erstellt!');
      } else {
        alert('Bracket Fehler');
      }
    } catch (err) {
      alert('Bracket Fehler', {err});
    }
  }, [id, fetchTournament]);

  // 🔥 5. updateMatch
  const updateMatch = useCallback(async (matchId, score1, score2) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/tournaments/${id}/match/${matchId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ score1, score2 })
      });
      fetchTournament();
    } catch (err) {
      alert('Ergebnis Fehler', {err});
    }
  }, [id, fetchTournament]);

  // 🔥 Loading
  if (loading) {
    return (
      <div style={{ 
        padding: '200px 20px', 
        textAlign: 'center', 
        color: 'white',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        minHeight: '100vh'
      }}>
        <div style={{ fontSize: '24px' }}>🏆 Turnier laden...</div>
      </div>
    );
  }

  // 🔥 Error
  if (error) {
    return (
      <div style={{ 
        padding: '200px 20px', 
        textAlign: 'center', 
        color: 'white',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#ef4444' }}>
          ❌ {error}
        </h1>
        <button 
          onClick={fetchTournament}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          🔄 Erneut laden
        </button>
      </div>
    );
  }

  // 🔥 No tournament
  if (!tournament) {
    return (
      <div style={{ 
        padding: '200px 20px', 
        textAlign: 'center', 
        color: 'white',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Turnier nicht gefunden</h1>
        <Link 
          to="/admin/tournaments" 
          style={{ 
            color: '#10b981', 
            fontSize: '18px', 
            textDecoration: 'none',
            padding: '12px 24px',
            background: 'rgba(16,185,129,0.2)',
            borderRadius: '20px'
          }}
        >
          ← Zurück zu meinen Turnieren
        </Link>
      </div>
    );
  }

  // 🔥 Computed values
  const isJoined = tournament.players?.some(p => p.userId === user?.id);
  const canGenerate = tournament.players?.length >= 2 && !tournament.matches?.length;
  const isCreator = tournament.created_by === user?.id;

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Link 
          to="/admin/tournaments" 
          style={{ 
            color: '#3b82f6', 
            fontSize: '18px', 
            marginBottom: '40px', 
            display: 'inline-block',
            padding: '8px 16px',
            background: 'rgba(59,130,246,0.2)',
            borderRadius: '12px'
          }}
        >
          ← Zurück
        </Link>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent'
          }}>
            {tournament.title}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '12px 24px', 
              background: tournament.mode === 'KO' ? '#ef4444' : '#3b82f6', 
              borderRadius: '30px', 
              fontWeight: 'bold' 
            }}>
              {tournament.mode === 'KO' ? '⚔️ K.O.-System' : '🔄 Round Robin'}
            </span>
            <span style={{ 
              padding: '12px 24px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '30px' 
            }}>
              {tournament.players?.length || 0} / {tournament.max_players} Spieler
            </span>
          </div>
        </div>

        {/* 🔥 REFRESH BUTTON */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button 
            onClick={fetchTournament}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            🔄 Aktualisieren
          </button>
        </div>

        {/* 🔥 ANMELDUNG / ACTIONS */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          marginBottom: '60px', 
          flexWrap: 'wrap' 
        }}>
          {!isJoined && user && (
            <button 
              onClick={joinTournament} 
              disabled={loading}
              style={{
                padding: '20px 40px', 
                background: loading ? '#6b7280' : '#10b981', 
                color: 'white',
                border: 'none', 
                borderRadius: '24px', 
                fontSize: '18px', 
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              👋 Ich melde mich an!
            </button>
          )}
          {isCreator && canGenerate && (
            <button 
              onClick={generateBracket} 
              disabled={loading}
              style={{
                padding: '20px 40px', 
                background: loading ? '#6b7280' : '#f59e0b', 
                color: 'white',
                border: 'none', 
                borderRadius: '24px', 
                fontSize: '18px', 
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              🎯 Turnierbaum erstellen
            </button>
          )}
        </div>

        {/* 📋 SPIELER LISTE */}
        {tournament.players && tournament.players.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>👥 Angemeldete Spieler</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '16px' 
            }}>
              {tournament.players.map((p, i) => (
                <div key={p.id} style={{
                  padding: '24px', 
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px'
                }}>
                  <div style={{ fontSize: '24px' }}>{i + 1}.</div>
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{p.name}</span>
                  {p.userId === user?.id && <span style={{ color: '#10b981' }}>⭐ Du</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 KO TURNierBAUM */}
        {tournament.mode === 'KO' && tournament.matches && tournament.matches.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: '32px', 
              marginBottom: '40px', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent'
            }}>
              ⚔️ Turnierbaum
            </h2>
            <div style={{ display: 'grid', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
              {tournament.matches.map(match => (
                <div key={match.matchId} style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '40px', 
                  padding: '24px',
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '24px',
                  borderLeft: `4px solid ${match.winner ? '#10b981' : '#6b7280'}`
                }}>
                  <div style={{ fontWeight: 'bold', minWidth: '60px' }}>
                    Match {match.matchId}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px', 
                    minWidth: '200px' 
                  }}>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '12px', 
                      background: 'rgba(255,255,255,0.2)', 
                      borderRadius: '12px' 
                    }}>
                      {tournament.players?.find(p => p.id === match.player1)?.name || '—'}
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '24px' 
                    }}>
                      {match.score1 !== null ? `${match.score1} - ${match.score2}` : 'vs'}
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '12px', 
                      background: 'rgba(255,255,255,0.2)', 
                      borderRadius: '12px' 
                    }}>
                      {tournament.players?.find(p => p.id === match.player2)?.name || '—'}
                    </div>
                  </div>
                  {!match.score1 ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        placeholder="Score1" 
                        min="0" 
                        defaultValue={match.score1 || ''} 
                        onBlur={(e) => {
                          updateMatch(match.matchId, parseInt(e.target.value) || 0, match.score2 || 0);
                        }}
                        style={{ 
                          width: '80px', 
                          padding: '12px', 
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.2)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          color: 'white',
                          textAlign: 'center'
                        }} 
                      />
                      <span style={{ fontSize: '24px', fontWeight: 'bold' }}>vs</span>
                      <input 
                        type="number" 
                        placeholder="Score2" 
                        min="0" 
                        defaultValue={match.score2 || ''} 
                        onBlur={(e) => {
                          updateMatch(match.matchId, match.score1 || 0, parseInt(e.target.value) || 0);
                        }}
                        style={{ 
                          width: '80px', 
                          padding: '12px', 
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.2)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          color: 'white',
                          textAlign: 'center'
                        }} 
                      />
                    </div>
                  ) : (
                    <span style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      color: match.winner ? '#10b981' : 'white' 
                    }}>
                      {match.winner ? '✅ Gewonnen' : '⏳ Abgeschlossen'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournament;
