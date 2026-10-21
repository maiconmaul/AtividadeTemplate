import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from '../api/client';

const AuthContext = createContext(null);
const SESSION_KEY = 'atividade-template-session';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(SESSION_KEY)
      .then(async value => {
        if (!value) return;
        const stored = JSON.parse(value);
        const { user } = await request('/auth/me', { token: stored.token });
        if (active) setSession({ ...stored, user });
      })
      .catch(() => AsyncStorage.removeItem(SESSION_KEY))
      .finally(() => active && setReady(true));
    return () => { active = false; };
  }, []);

  const saveSession = async value => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(value));
    setSession(value);
  };

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    token: session?.token || null,
    ready,
    async login(email, password) {
      const result = await request('/auth/login', { method: 'POST', body: { email, password } });
      await saveSession(result);
      return result;
    },
    async register(name, email, password) {
      const result = await request('/auth/register', { method: 'POST', body: { name, email, password } });
      await saveSession(result);
      return result;
    },
    async logout() {
      await AsyncStorage.removeItem(SESSION_KEY);
      setSession(null);
    },
  }), [session, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
