import React, { createContext, useContext, useState } from 'react';

// Creating the context
const AuthContext = createContext({
    isLoggedIn: false,
    UUID: null,
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

  const logIn = (uuid) => {
    setUUID(uuid);
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setUUID(null);
    setIsLoggedIn(false);
  };

  const value = { isLoggedIn, UUID, logIn, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};