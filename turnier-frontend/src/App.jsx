import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import TournamentList from './pages/TournamentList';
import AdminTournaments from './pages/AdminTournaments'; // 🟢 NEU!
import Navbar from './components/Navbar'; // 🟢 Navbar
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Tournament from './pages/Tournament'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Lädt...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* 🟢 Navbar (ersetzt alte Nav) */}
        <Navbar />
        
        {/* 🟢 Main Content */}
        <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tournaments" element={<TournamentList />} />
            
            {/* 🟢 Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            
            {/* 🟢 ADMIN PANEL */}
            <Route path="/admin/tournaments" element={
              <ProtectedRoute>
                <AdminTournaments />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={<Profile />} />

            <Route path="/tournament/:id" element={<Tournament />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
