import React, { createContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api, setAuthToken } from '../../lib/api';

type AuthUser = { id: string; email: string; username: string; };

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'animeflask_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setAuthToken(token);
    if (!token) {
      setUser(null);
      return;
    }
    api
      .get('/user/profile')
      .then((r) => setUser(r.data))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        toast.error('Sesión caducada, inicia sesión de nuevo.');
      });
  }, [token]);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      async login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem(STORAGE_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        console.log("USER", user)
        toast.success('Bienvenido/a');
      },
      async register(email, username, password) {
        const { data } = await api.post('/auth/register', { email, username, password });
        localStorage.setItem(STORAGE_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success('Cuenta creada');
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
        setAuthToken(null);
        toast('Sesión cerrada');
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };

