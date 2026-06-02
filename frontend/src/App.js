import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import './App.css';

/* PÚBLICO */
import Home from './pages/public/Home';
import Sobre from './pages/public/Sobre';
import Servicos from './pages/public/Servicos';
import Artigos from './pages/public/Artigos';
import Contactos from './pages/public/Contactos';
import Login from './pages/public/Login';

/* ADMIN */
import AdminLayout from './layouts/AdminLayout';

import Dashboard from './pages/adm/Dashboard';
import Empresa from './pages/adm/Empresa';
import ServicosAdmin from './pages/adm/ServicosAdmin';
import ArtigosAdmin from './pages/adm/ArtigosAdmin';
import Utilizadores from './pages/adm/Utilizadores';
import Documentos from './pages/adm/Documentos';
import Atividade from './pages/adm/Atividade';
import Empresa from './pages/adm/Empresa';
import ServicosAdmin from './pages/adm/ServicosAdmin';
import SuporteGeral from './pages/adm/SuporteGeral';

// Páginas do gestor
import DashboardGestor from './pages/gestor/dashboardGestor';
import DetalhesCliente from './pages/gestor/DetalhesCliente';

//Páginas do cliente
import DashboardCliente from './pages/cliente/DashboardCliente';
import SubmissoesCliente from './pages/cliente/SubmissoesCliente';
import PedidosChat from './pages/cliente/PedidosChat';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/login" element={<Login />} />

          {/* Admin — AdminLayout usa <Outlet /> para renderizar as páginas filhas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="artigos" element={<ArtigosAdmin />} />
            <Route path="conteudos" element={<Empresa />} />
            <Route path="servicos" element={<ServicosAdmin />} />
            <Route path="utilizadores" element={<Utilizadores />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="atividade" element={<Atividade />} />
            <Route path="suporte" element={<SuporteGeral />} />
          </Route>

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}