import React, { createContext, useContext, useState } from 'react';

// Creating the context
const AuthContext = createContext();

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};

//component that wraps app and makes auth object available to any child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock function to simulate login/logout
  
  const logIn = () => setIsLoggedIn(true);
  const logOut = () => setIsLoggedIn(false);


  // The value that will be given to the context
  const value = {
    isLoggedIn,
    logIn,
    logOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
