import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Register from "./RegisterForm";
import styles from "../styles/Auth.module.css";

export default function Login({ visible, onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenRegister = () => {
    setShowRegister(true);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  if (!visible && !showRegister) return null;

  return showRegister ? (
    <Register visible={true} onClose={handleCloseRegister} />
  ) : (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles["close-button"]}
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p onClick={handleOpenRegister} className={styles["toggle"]}>
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}
