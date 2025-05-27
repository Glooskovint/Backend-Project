import { useEffect, useState, useMemo, createContext } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../firebase/config";

// Crear el contexto de autenticación
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Limpieza del listener
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  // Memorizar el value del contexto para evitar renders innecesarios
  const authContextValue = useMemo(() => ({
    user,
    login,
    register,
    logout,
  }), [user]);

  if (loading) return null; // No renderiza nada mientras se carga

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
