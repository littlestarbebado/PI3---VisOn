import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileMenu from './components/ProfileMenu';

import './App.css';

/* PÚBLICO */
import Home from './pages/public/Home';
import Sobre from './pages/public/Sobre';
import Servicos from './pages/public/Servicos';
import Artigos from './pages/public/Artigos';
import ArtigoDetalhe from './pages/public/ArtigoDetalhe';
import Contactos from './pages/public/Contactos';
import Login from './pages/public/Login';

/* ADMIN */
import AdminLayout from './layouts/AdminLayout';
import ContactosAdmin from './pages/adm/Contactos';
import Dashboard from './pages/adm/Dashboard';
import Conteudos from './pages/adm/Conteudos';
import Utilizadores from './pages/adm/Utilizadores';
import Documentos from './pages/adm/Documentos';
import Atividade from './pages/adm/Atividade';
import SuporteGeral from './pages/adm/SuporteGeral';

/* GESTOR */
import DashboardGestor from './pages/gestor/dashboardGestor';
import DetalhesCliente from './pages/gestor/DetalhesCliente';

/* CLIENTE */
import DashboardCliente from './pages/cliente/DashboardCliente';
import SubmissoesCliente from './pages/cliente/SubmissoesCliente';
import PedidosChat from './pages/cliente/PedidosChat';
import DadosConta from './pages/conta/DadosConta';

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
          <Route path="/artigos/:slug" element={<ArtigoDetalhe />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
<Route element={<ProfileMenu />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="conta" element={<DadosConta />} />
    <Route path="contactos" element={<ContactosAdmin />} />
    <Route path="conteudos" element={<Conteudos />} />
    <Route path="utilizadores" element={<Utilizadores />} />
    <Route path="documentos" element={<Documentos />} />
    <Route path="atividade" element={<Atividade />} />
    <Route path="suporte" element={<SuporteGeral />} />
  </Route>
</Route>
          </Route>

          {/* Gestor */}
          <Route element={<ProtectedRoute allowedRoles={['Gestor']} />}>
            <Route element={<ProfileMenu />}>
              <Route path="/gestor" element={<DashboardGestor />} />
              <Route path="/gestor/conta" element={<DadosConta />} />
              <Route path="/gestor/cliente/:id" element={<DetalhesCliente />} />
            </Route>
          </Route>

          {/* Cliente */}
          <Route element={<ProtectedRoute allowedRoles={['Cliente']} />}>
            <Route element={<ProfileMenu />}>
              <Route path="/cliente" element={<DashboardCliente />} />
              <Route path="/cliente/conta" element={<DadosConta />} />
              <Route path="/cliente/submissoes" element={<SubmissoesCliente />} />
              <Route path="/cliente/chat" element={<PedidosChat />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
