import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  username: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  username: null,
  loading: true,
  signOut: async () => { },
  deleteAccount: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserData = (session: Session | null) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    if (currentUser?.email) {
      const name = currentUser.user_metadata?.username || currentUser.email.split('@')[0];
      setUsername(name);
    } else {
      setUsername(null);
    }
  };

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserData(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserData(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const deleteAccount = async () => {
    if (!session?.access_token) return;
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      let msg = 'Failed to delete account';
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error) msg = parsed.error;
      } catch {
        if (errText) msg = errText;
      }
      throw new Error(msg);
    }

    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, username, loading, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
