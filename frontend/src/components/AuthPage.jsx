import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './AuthPage.css'; // Import the CSS file

const AuthPage = () => {
  const { loginWithRedirect } = useAuth0();
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Log In to CodeSync' : 'Sign Up for CodeSync'}</h2>
        <button onClick={() => loginWithRedirect({ screen_hint: isLogin ? '' : 'signup' })} className="auth-button">
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
        <button onClick={handleToggle} className="auth-toggle-button">
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
