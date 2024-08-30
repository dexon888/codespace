import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthPage = () => {
  const { loginWithRedirect } = useAuth0();
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>{isLogin ? 'Log In to CodeSync' : 'Sign Up for CodeSync'}</h2>
      <button onClick={() => loginWithRedirect({ screen_hint: isLogin ? '' : 'signup' })}>
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>
      <button onClick={handleToggle} style={{ marginTop: '20px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
      </button>
    </div>
  );
};

export default AuthPage;
