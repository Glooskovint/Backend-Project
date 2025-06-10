import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from './LoginForm';

export default function AuthButton() {
  const { user, userData, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (user) {
    return (
      <button onClick={() => logout()}>
        Logout ({userData?.nombre || user.email})
      </button>
    );
  }
  return (
    <>
      <button onClick={() => setShowLogin(true)}>Login</button>
      <Login visible={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}