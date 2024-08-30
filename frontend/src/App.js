import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './components/Lobby';
import Room from './components/Room';
import AuthPage from './components/AuthPage';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <Routes>
        {/* Redirect to AuthPage if not authenticated */}
        <Route
          path="/room/:id"
          element={isAuthenticated ? <Room /> : <AuthPage />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Lobby /> : <AuthPage />}
        />
        {/* Add a direct route to the AuthPage */}
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
