import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Register from './RegisterForm';

export default function Login({ visible, onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  if (!visible) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
        <p onClick={() => setShowRegister(true)} className="toggle">
          Don't have an account? Register
        </p>
        <Register visible={showRegister} onClose={() => setShowRegister(false)} />
      </div>
    </div>
  );
}
