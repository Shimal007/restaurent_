// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RestaurantProvider } from './contexts/RestaurantContext';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import AuthPage from './pages/AuthPage';
import './App.css';

function App() {
  return (
    <RestaurantProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </RestaurantProvider>
  );
}

export default App;
