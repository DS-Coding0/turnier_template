import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 loadUser - Helper Funktion
  const loadUser = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // 🟢 DEBUG LOGS
    console.log('🔍 useAuth loadUser:', { 
      hasToken: !!token, 
      userRole: userData ? JSON.parse(userData).role : null 
    });
    
    if (!token || !userData) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      
      if (!parsedUser.id || !parsedUser.role) {
        console.log('❌ Invalid user data, clearing...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        return;
      }
      
      console.log('✅ Auth OK:', parsedUser.role, parsedUser.displayname);
      setUser(parsedUser);
    } catch (error) {
      console.error('❌ JSON Parse Error:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  // 🔥 Initial load
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // 🔥 LOGIN Funktion
  const login = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // 🔥 LOGOUT Funktion
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();
    setUser(null);
    window.location.href = '/';
  }, []);

  // 🔥 REFRESH USER - FÜR PROFIL UPDATES!
  const refreshUser = useCallback((updatedUser) => {
    console.log('🔄 refreshUser:', updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  // 🟢 DEBUG LOGS
  console.log('🔍 useAuth render:', { 
    user: user?.username, 
    role: user?.role, 
    loading 
  });

  return { 
    user, 
    loading,
    login,
    logout,
    refreshUser  // 🔥 NEU!
  };
};
