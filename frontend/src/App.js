import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Páginas Públicas
import Home from './pages/public/Home';
import Sobre from './pages/public/Sobre';
import Servicos from './pages/public/Servicos';
import Artigos from './pages/public/Artigos';
import Contactos from './pages/public/Contactos';
import Login from './pages/public/Login';

// Layout e Páginas do Admin (Corrigido o import do Dashboard)
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/adm/Dashboard'; 

// Páginas do Gestor
import DashboardGestor from './pages/gestor/dashboardGestor';
import DetalhesCliente from './pages/gestor/DetalhesCliente';   

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/login" element={<Login />} />

          {/* 2. Rotas do Admin Aninhadas (O segredo está aqui! 🚀) */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Quando entrares em /admin, carrega o Dashboard por defeito */}
            <Route index element={<Dashboard />} />
            
            {/* Futuras páginas internas que vão carregar dentro do espaço branco */}
            <Route path="conteudos" element={<div>Página de Conteúdos (Em desenvolvimento)</div>} />
            <Route path="utilizadores" element={<div>Página de Utilizadores (Em desenvolvimento)</div>} />
            <Route path="documentos" element={<div>Página de Documentos (Em desenvolvimento)</div>} />
            <Route path="atividade" element={<div>Página de Atividade (Em desenvolvimento)</div>} />
          </Route>

          {/* 3. Rotas do Gestor */}
          <Route path="/gestor" element={<DashboardGestor />} />
          <Route path="/gestor/cliente/:id" element={<DetalhesCliente />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}