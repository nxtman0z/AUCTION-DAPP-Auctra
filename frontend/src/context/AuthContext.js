import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('auctionUser');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.body.setAttribute('data-theme', storedTheme);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email, password, isAdmin = false) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        isAdmin,
        isVerified: isAdmin ? true : false, // Admin is auto-verified
        walletAddress: ''
      };
      
      setUser(userData);
      localStorage.setItem('auctionUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name, walletAddress, isAdmin = false) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        email,
        name,
        isAdmin,
        isVerified: false, // All users need admin verification
        walletAddress
      };
      
      setUser(userData);
      localStorage.setItem('auctionUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auctionUser');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const verifyUser = () => {
    if (user) {
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      localStorage.setItem('auctionUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isLoading,
    theme,
    login,
    signup,
    logout,
    toggleTheme,
    verifyUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
