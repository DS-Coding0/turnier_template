import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TournamentList from './pages/TournamentList';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Lädt...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 0'
      }}>
        <nav style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '20px 20px 0',
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
            textDecoration: 'none',
            marginRight: '20px'
          }}>Turniere</Link>
        </nav>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/tournaments" element={<TournamentList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
