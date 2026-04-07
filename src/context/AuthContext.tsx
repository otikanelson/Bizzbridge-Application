/**
 * AuthContext
 * Provides authentication state globally by wrapping the useAuth hook
 * Requirements: 2.6, 2.7
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, UseAuthReturn } from '../hooks/useAuth';

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider wraps the app and provides auth state to all children
 * via the useAuthContext hook.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

/**
 * useAuthContext hook - consume auth state from anywhere in the tree.
 * Must be used inside <AuthProvider>.
 */
export const useAuthContext = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
