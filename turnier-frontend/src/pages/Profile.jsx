import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth(); // 🔥 refreshUser!
  const navigate = useNavigate();
  
  // 🔥 BESCHRÄNTE FIELDS NUR!
  const [editMode, setEditMode] = useState(false);
  const [localFormData, setLocalFormData] = useState({
    displayname: '',
    email: '',
    discord_name: '',
    tiktok_name: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 BEIM EDIT MODE → DATEN KOPIEREN
  const enterEditMode = () => {
    if (user) {
      setLocalFormData({
        displayname: user.displayname || '',
        email: user.email || '',
        discord_name: user.discord_name || '',
        tiktok_name: user.tiktok_name || '',
        mobile: user.mobile || ''
      });
    }
    setEditMode(true);
    setError('');
  };

  const handleInputChange = (field, value) => {
    console.log(`🔄 ${field}:`, value);
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('💾 Save:', localFormData);
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(localFormData)
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        
        // 🔥 useAuth refreshen!
        refreshUser(updatedUserData.user);
        
        // 🔥 localFormData syncen
        setLocalFormData({
          displayname: updatedUserData.user.displayname || '',
          email: updatedUserData.user.email || '',
          discord_name: updatedUserData.user.discord_name || '',
          tiktok_name: updatedUserData.user.tiktok_name || '',
          mobile: updatedUserData.user.mobile || ''
        });
        
        setEditMode(false);
        alert('✅ Profil gespeichert!');
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server Fehler');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Speichern fehlgeschlagen');
    }
    
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Account wirklich LÖSCHEN?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/users/profile', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      logout();
    } catch (err) {
      alert('Löschen fehlgeschlagen');
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '200px 20px', textAlign: 'center', color: 'white', background: '#0f172a' }}>
        <h1>Login erforderlich</h1>
        <Link to="/login" style={{ color: '#10b981', fontSize: '18px', textDecoration: 'none' }}>→ Login</Link>
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* 👤 PROFIL HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '60px', padding: '40px 20px' }}>
          <div style={{
            width: '140px', height: '140px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%', margin: '0 auto 30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '64px', boxShadow: '0 20px 40px rgba(59,130,246,0.4)'
          }}>
            👤
          </div>
          <h1 style={{
            fontSize: '48px', fontWeight: '900', marginBottom: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            {user.displayname || user.username}
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.8 }}>
            {user.role === 'ADMIN' ? '👑 Admin' : 'Spieler'}
          </p>
        </div>

        {/* 📝 EDIT / VIEW */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px' 
          }}>
            <h2 style={{
              fontSize: '32px', fontWeight: '800',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {editMode ? '✏️ Profil bearbeiten' : '👁️ Profilübersicht'}
            </h2>
            <button
              onClick={editMode ? () => setEditMode(false) : enterEditMode}
              style={{
                padding: '14px 32px',
                background: editMode ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', border: 'none', borderRadius: '20px',
                fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(16,185,129,0.3)'
              }}
            >
              {editMode ? '❌ Abbrechen' : '✏️ Bearbeiten'}
            </button>
          </div>

          {editMode ? (
            /* 🔥 EDIT FORM - 5 ERlaubte Felder */
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
              {error && (
                <div style={{
                  padding: '20px', background: 'rgba(239,68,68,0.2)',
                  border: '1px solid #ef4444', borderRadius: '16px', color: '#fecaca'
                }}>
                  {error}
                </div>
              )}

              {/* DISPLAYNAME */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', fontSize: '16px' }}>
                  💎 Anzeigename
                </label>
                <input
                  type="text"
                  value={localFormData.displayname}
                  onChange={(e) => handleInputChange('displayname', e.target.value)}
                  style={{
                    width: '100%', padding: '20px 24px',
                    background: 'rgba(255,255,255,0.25)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '16px', color: 'white',
                    fontSize: '18px', fontWeight: '500'
                  }}
                  placeholder="Dein Anzeigename"
                  maxLength={50}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', fontSize: '16px' }}>
                  📧 Email
                </label>
                <input
                  type="email"
                  value={localFormData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%', padding: '20px 24px',
                    background: 'rgba(255,255,255,0.25)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '16px', color: 'white',
                    fontSize: '18px', fontWeight: '500'
                  }}
                  placeholder="email@example.com"
                />
              </div>

              {/* DISCORD */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', fontSize: '16px' }}>
                  💬 Discord
                </label>
                <input
                  type="text"
                  value={localFormData.discord_name}
                  onChange={(e) => handleInputChange('discord_name', e.target.value)}
                  style={{
                    width: '100%', padding: '20px 24px',
                    background: 'rgba(255,255,255,0.25)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '16px', color: 'white',
                    fontSize: '18px', fontWeight: '500'
                  }}
                  placeholder="username#1234"
                />
              </div>

              {/* TIKTOK */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', fontSize: '16px' }}>
                  📱 TikTok
                </label>
                <input
                  type="text"
                  value={localFormData.tiktok_name}
                  onChange={(e) => handleInputChange('tiktok_name', e.target.value)}
                  style={{
                    width: '100%', padding: '20px 24px',
                    background: 'rgba(255,255,255,0.25)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '16px', color: 'white',
                    fontSize: '18px', fontWeight: '500'
                  }}
                  placeholder="@username"
                />
              </div>

              {/* MOBILE */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', fontSize: '16px' }}>
                  📞 Mobilnummer
                </label>
                <input
                  type="tel"
                  value={localFormData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  style={{
                    width: '100%', padding: '20px 24px',
                    background: 'rgba(255,255,255,0.25)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '16px', color: 'white',
                    fontSize: '18px', fontWeight: '500'
                  }}
                  placeholder="+49 123 456789"
                />
              </div>

              {/* BUTTONS */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1, padding: '22px', background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white', border: 'none', borderRadius: '20px',
                    fontWeight: 'bold', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? '⏳ Speichern...' : '💾 Speichern'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  style={{
                    flex: 1, padding: '22px', background: 'rgba(55,65,81,0.8)',
                    color: 'white', border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '20px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer'
                  }}
                >
                  ❌ Abbrechen
                </button>
              </div>
            </form>
          ) : (
            /* 👁️ VIEW MODE - KORREKTE FELDER */
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Benutzername:</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px', opacity: 0.7 }}>{user.username || '—'}</span>
              </div>
              
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Anzeigename:</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{user.displayname || '—'}</span>
              </div>
              
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Email:</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{user.email || '—'}</span>
              </div>
              
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Discord:</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{user.discord_name || '—'}</span>
              </div>
              
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>TikTok:</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{user.tiktok_name || '—'}</span>
              </div>
              
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Mobil:</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{user.mobile || '—'}</span>
              </div>
              
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Rolle:</span>
                <span style={{
                  padding: '10px 24px', background: user.role === 'ADMIN' ? '#a855f7' : '#10b981',
                  color: 'white', borderRadius: '20px', fontWeight: 'bold'
                }}>
                  {user.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 🗑️ DELETE */}
        <div style={{
          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '24px', padding: '40px', textAlign: 'center', marginTop: '40px'
        }}>
          <h3 style={{ fontSize: '28px', color: '#fecaca', marginBottom: '20px' }}>⚠️ Danger Zone</h3>
          <button onClick={handleDeleteAccount} style={{
            padding: '16px 40px', background: '#ef4444', color: 'white',
            border: 'none', borderRadius: '20px', fontWeight: 'bold', fontSize: '16px',
            cursor: 'pointer', boxShadow: '0 10px 25px rgba(239,68,68,0.4)'
          }}>
            🗑️ Account löschen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
