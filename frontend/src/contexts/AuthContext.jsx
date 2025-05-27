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
        const res = await fetch(`http://localhost:5000/usuarios`);
        const allUsers = await res.json();
        const matched = allUsers.find(
          (u) => u.firebase_uid === currentUser.uid
        );
        setUserData(matched);
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
