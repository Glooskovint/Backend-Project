import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Login from './Login';

export default function AuthButton() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (user) {
    return (
      <button onClick={() => logout()}>
        Logout ({user.email})
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