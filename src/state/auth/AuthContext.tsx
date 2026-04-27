import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { api, setAuthToken } from '../../lib/api';

type AuthUser = { id: string; email: string; username: string; };

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'animeflask_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const initialMountRef = useRef(true);

  useEffect(() => {
    setAuthToken(token);
    if (!token) {
      setUser(null);
      setIsAuthReady(true);
      initialMountRef.current = false;
      return;
    }
    api
      .get('/user/profile')
      .then((r) => {
        setUser(r.data);
        setIsAuthReady(true);
        if (!initialMountRef.current) {
          toast.success('Welcome back, ' + r.data.username + '!');
        }
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setIsAuthReady(true);
        toast.error('Session expired, please log in again.');
      })
      .finally(() => {
        initialMountRef.current = false;
      });
  }, [token]);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      isAuthReady,
      async login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem(STORAGE_KEY, data.token);
        setToken(data.token);
      },
      async register(email, username, password) {
        const { data } = await api.post('/auth/register', { email, username, password });
        localStorage.setItem(STORAGE_KEY, data.token);
        setToken(data.token);
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
        setIsAuthReady(false);
        setAuthToken(null);
        toast('Session closed');
      },
    }),
    [token, user, isAuthReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };

