import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password) => {
    try {
      console.log('AuthContext: Attempting signup with:', { email });
      const response = await api.post('/auth/register', { email, password });
      const { user, token } = response.data;
      
      console.log('AuthContext: Signup successful, setting token and user');
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      throw error.response?.data?.message || 'Failed to create account';
    }
  };

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login with:', { email });
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      console.log('AuthContext: Login successful, setting token and user');
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error.response?.data?.message || 'Failed to login';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me')
        .then(response => setUser(response.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 