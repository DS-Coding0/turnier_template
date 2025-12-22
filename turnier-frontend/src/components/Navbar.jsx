import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.clear();
    }
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* 🔥 BLAUE GRADIENT NAVBAR - INLINE! */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #7c3aed 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: 1000,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* LOGO */}
          <Link 
            to="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: 'white',
              fontSize: '28px',
              fontWeight: 'bold',
              textDecoration: 'none',
              padding: '12px'
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              🏆
            </div>
            <span style={{ display: window.innerWidth >= 768 ? 'block' : 'none' }}>TurnierPro</span>
          </Link>

          {/* DESKTOP LINKS */}
          <div style={{ 
            display: window.innerWidth >= 768 ? 'flex' : 'none', 
            gap: '12px', 
            alignItems: 'center' 
          }}>
            <Link 
              to="/" 
              style={{
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                background: location.pathname === '/' ? 'rgba(255,255,255,0.25)' : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              🏠 Home
            </Link>
            <Link 
              to="/tournaments" 
              style={{
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                background: location.pathname === '/tournaments' ? 'rgba(255,255,255,0.25)' : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              🏆 Turniere
            </Link>
          </div>

          {/* USER SECTION */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <>
                <Link 
                  to="/profile"
                  style={{
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.2)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  👤 Profil
                </Link>
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin/tournaments"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                    }}
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <Link
                to="/"
                button
                  onClick={handleLogout}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  🚪 Logout
                </Link>
              </>
            ) : (
              <Link 
                to="/login"
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
              >
                🔐 Login
              </Link>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          {window.innerWidth < 768 && (
            <button 
              onClick={toggleMobileMenu}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ☰
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && window.innerWidth < 768 && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          padding: '20px',
          zIndex: 999
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link 
              to="/" 
              style={{
                display: 'block',
                padding: '16px',
                background: location.pathname === '/' ? 'rgba(255,255,255,0.3)' : 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link 
              to="/tournaments"
              style={{
                display: 'block',
                padding: '16px',
                background: location.pathname === '/tournaments' ? 'rgba(255,255,255,0.3)' : 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              🏆 Turniere
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile"
                  style={{
                    display: 'block',
                    padding: '16px',
                    background: location.pathname === '/profile' ? '#a855f7' : 'transparent',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Profil
                </Link>
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin/tournaments"
                    style={{
                      display: 'block',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                style={{
                  display: 'block',
                  padding: '16px',
                  background: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                🔐 Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* PADDING FÜR FIXED NAVBAR */}
      <div style={{ height: '80px' }}></div>
    </>
  );
};

export default Navbar;
