import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TournamentList from './pages/TournamentList';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Lädt...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Navigation */}
        <nav style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Link to="/" style={{ 
            color: 'white', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            textDecoration: 'none',
            marginRight: '30px'
          }}>🏆 TurnierManager</Link>
          <Link to="/tournaments" style={{ 
            color: 'white', 
            fontSize: '18px', 
            textDecoration: 'none'
          }}>Turniere</Link>
        </nav>

        {/* Main Content */}
        <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tournaments" element={<TournamentList />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <h1>Dashboard (Bald!)</h1>
                  <p>Willkommen zurück!</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
