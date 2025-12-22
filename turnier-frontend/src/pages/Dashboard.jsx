import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '120px 20px 40px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        overflowX: 'hidden'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          textAlign: 'center' 
        }}>
          {/* HERO */}
          <div style={{
            marginBottom: '120px',
            animation: 'fadeInUp 1s ease-out'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              margin: '0 auto 40px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)'
            }}>
              🏆
            </div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: '900',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              TurnierPro
            </h1>
            <p style={{ 
              fontSize: '1.5rem', 
              opacity: 0.9, 
              maxWidth: '600px', 
              margin: '0 auto 50px',
              lineHeight: '1.6'
            }}>
              Organisiere epische Turniere mit K.O.-System oder Round Robin. 
              Perfekt für Gaming, Sport und Events.
            </p>
            
            {/* CTAs */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px', 
              alignItems: 'center',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <Link 
                to="/login" 
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '20px 50px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  textDecoration: 'none',
                  boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
                  display: 'inline-block',
                  transition: 'all 0.3s',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 25px 50px rgba(16, 185, 129, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)';
                }}
              >
                🔐 Jetzt anmelden
              </Link>
              <Link 
                to="/tournaments" 
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  padding: '18px 40px',
                  borderRadius: '18px',
                  fontWeight: '600',
                  fontSize: '16px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.25)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                👀 Turniere entdecken
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EINGELOGGT
  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 40px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        textAlign: 'center' 
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '900',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          👋 Willkommen zurück
        </h1>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '60px',
          opacity: 0.9
        }}>
          {user.displayname || user.username || 'Teammitglied'}
        </h2>
        
        {user.role === 'ADMIN' ? <Link 
          to="/admin/tournaments" 
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '24px 60px',
            borderRadius: '24px',
            fontWeight: 'bold',
            fontSize: '20px',
            textDecoration: 'none',
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)',
            display: 'inline-block',
            border: 'none'
          }}
        >
          ➕ Turniere verwalten
        </Link>: ''}
        
        <p style={{ 
          marginTop: '40px', 
          fontSize: '1.2rem', 
          opacity: 0.7 
        }}>
          {user.role === 'ADMIN' ? '👑 Admin-Zugriff aktiviert' : 'Verwalte deine Turniere'}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
