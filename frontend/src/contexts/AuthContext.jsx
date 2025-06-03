import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // 1) Intentamos obtenerlo de nuestra BD
        let response = await fetch(
          `http://localhost:5000/usuarios?firebase_uid=${currentUser.uid}`
        );
        let usuarioEnDB = null;

        if (response.status === 200) {
          const data = await response.json();
          // Si el backend devuelve un array vacío o un 404, no existe aún
          if (Array.isArray(data) ? data.length === 0 : data.error) {
            usuarioEnDB = null;
          } else {
            usuarioEnDB = Array.isArray(data) ? data[0] : data;
          }
        }

        // 2) Si no existe, lo creamos
        if (!usuarioEnDB) {
          await fetch("http://localhost:5000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firebase_uid: currentUser.uid,
              email: currentUser.email,
              nombre: currentUser.displayName || "",
            }),
          });
          // Volvemos a obtenerlo de la BD
          response = await fetch(
            `http://localhost:5000/usuarios?firebase_uid=${currentUser.uid}`
          );
          const newData = await response.json();
          usuarioEnDB = Array.isArray(newData) ? newData[0] : newData;
        }

        setUserData(usuarioEnDB);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, nombre) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await fetch("http://localhost:5000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebase_uid: userCredential.user.uid,
        email,
        nombre: nombre || "",
      }),
    });
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, login, register, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
