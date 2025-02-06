import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import SearchPage from './components/SearchPage/SearchPage';  // Import SearchPage
import DetailsPage from './components/DetailsPage/DetailsPage';  // Import DetailsPage
import AddGiftPage from './components/AddGiftPage/AddGiftPage';
import UpdateGiftPage from './components/UpdateGiftPage/UpdateGiftPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        
        {/* Add these routes for search and product details */}
        <Route path="/app/search" element={<SearchPage />} />
        <Route path="/app/product/:productId" element={<DetailsPage />} />
        <Route path="/app/add-gift" element={<AddGiftPage />} />
        <Route path="/app/update/:id" element={<UpdateGiftPage />} />
      </Routes>
    </>
  );
}

export default App;

