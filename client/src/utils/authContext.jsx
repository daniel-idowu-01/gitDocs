import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check-auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        console.log('check-auth response', response)
        response.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Error checking auth status:", err));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
