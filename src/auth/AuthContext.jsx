import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import './Auth.css';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

if (loading) {
  return <div className="auth-loading">Loading...</div>;
}

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
