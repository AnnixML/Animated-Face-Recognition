import React, { createContext, useContext, useState, useEffect } from 'react';

// Creating the context
const AuthContext = createContext({
    isLoggedIn: false,
    UUID: null,
    saveSearchHistory: true,
    changeSearchHistory: () => {},
    logIn: (uuid) => {},
    logOut: () => {},
});

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

// actual component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [UUID, setUUID] = useState(null);

  // Initialize state based on localStorage
  useEffect(() => {
    const storedUUID = localStorage.getItem('UUID');
    if (storedUUID) {
      setUUID(storedUUID);
      setIsLoggedIn(true);
    }
  }, []);

  const logIn = (newuuid) => {
    localStorage.setItem('UUID', newuuid); // Save UUID to localStorage
    setUUID(newuuid);
    setIsLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('UUID'); // Clear UUID from localStorage
    setUUID(null);
    setIsLoggedIn(false);
  };

  const changeSearchHistory = (newState) => {
    setSaveSearchHistory(newState);
  }

  const value = { isLoggedIn, UUID, logIn, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
