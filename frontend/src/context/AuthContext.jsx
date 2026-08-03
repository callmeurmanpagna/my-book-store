import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function persistSession(token, userData) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data.token, data.user);
    return data.user;
  }

  async function register(name, email, password, confirmPassword) {
    const { data } = await api.post('/auth/register', { name, email, password, confirmPassword });
    persistSession(data.token, data.user);
    return data.user;
  }

  // Google Sign-In via Firebase, then exchange the Firebase ID token
  // for our own backend JWT so the rest of the app works the same way.
  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const { data } = await api.post('/auth/google', { idToken });
    persistSession(data.token, data.user);
    return data.user;
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch {
      // user may not have signed in via Firebase — safe to ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  function updateStoredUser(partialUser) {
    const updated = { ...user, ...partialUser };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    loginWithGoogle,
    logout,
    updateStoredUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
