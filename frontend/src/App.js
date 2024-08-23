import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './components/Lobby';
import Room from './components/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/room/:id" element={<Room />} />
        <Route path="/" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;
