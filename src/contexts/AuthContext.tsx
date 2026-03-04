import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email?: string;
  name: string;
  nameBn: string;
  role: 'citizen' | 'admin' | 'agent';
  isVerified: boolean;
  nid?: string;
  birthRegNumber?: string;
  phone?: string;
  photo?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('porichoy_user');
    const storedToken = localStorage.getItem('porichoy_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('porichoy_user');
        localStorage.removeItem('porichoy_token');
      }
    }
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('porichoy_user', JSON.stringify(userData));
    localStorage.setItem('porichoy_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('porichoy_user');
    localStorage.removeItem('porichoy_token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
