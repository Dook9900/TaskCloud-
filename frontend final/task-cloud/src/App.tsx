import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './screens/login/LoginPage';
import DashboardPage from './screens/dashboard/DashboardPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/dashboard" element={<DashboardPage />} />  
      </Routes>
    </BrowserRouter>
);
}


export default App;
