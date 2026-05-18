import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import Home from './pages/public/Home';
import Sobre from './pages/public/Sobre';
import Servicos from './pages/public/Servicos';
import Artigos from './pages/public/Artigos';
import Contactos from './pages/public/Contactos';
import Login from './pages/public/Login';
import AdminLayout from './pages/adm/AdminLayout';
import DashboardGestor from './pages/gestor/dashboardGestor';
import DetalhesCliente from './pages/gestor/DetalhesCliente'; 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Público */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/admin/artigos" element={<AdminLayout />} />
          <Route path="/admin/conteudos" element={<AdminLayout />} />
          <Route path="/admin/mensagens" element={<AdminLayout />} />


          <Route path="/gestor" element={<DashboardGestor />} />
          <Route path="/gestor/cliente/:id" element={<DetalhesCliente />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
