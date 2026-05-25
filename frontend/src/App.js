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

<<<<<<< HEAD
// Layout admin com Outlet — importado do local correto
import AdminLayout from './layouts/AdminLayout';

// Páginas do painel admin
import Dashboard from './pages/adm/Dashboard';
import ArtigosAdmin from './pages/adm/ArtigosAdmin';
import Utilizadores from './pages/adm/Utilizadores';
import Documentos from './pages/adm/Documentos';
import Atividade from './pages/adm/Atividade';
import Empresa from './pages/adm/Empresa';
import ServicosAdmin from './pages/adm/ServicosAdmin';

// Páginas do gestor
import DashboardGestor from './pages/gestor/dashboardGestor';
import DetalhesCliente from './pages/gestor/DetalhesCliente';
=======
// Layout e Páginas do Admin (Corrigido o import do Dashboard)
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/adm/Dashboard'; 

// Páginas do Gestor
import DashboardGestor from './pages/gestor/dashboardGestor';
import DetalhesCliente from './pages/gestor/DetalhesCliente';   
>>>>>>> dced1f5d21a0c10f1494650dcba152ec8d985464

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
<<<<<<< HEAD

          {/* Público */}
=======
          {/* 1. Rotas Públicas */}
>>>>>>> dced1f5d21a0c10f1494650dcba152ec8d985464
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/login" element={<Login />} />

<<<<<<< HEAD
          {/* Admin — AdminLayout usa <Outlet /> para renderizar as páginas filhas */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="artigos" element={<ArtigosAdmin />} />
            <Route path="conteudos" element={<Empresa />} />
            <Route path="servicos" element={<ServicosAdmin />} />
            <Route path="utilizadores" element={<Utilizadores />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="atividade" element={<Atividade />} />
          </Route>

          {/* Gestor */}
=======
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
>>>>>>> dced1f5d21a0c10f1494650dcba152ec8d985464
          <Route path="/gestor" element={<DashboardGestor />} />
          <Route path="/gestor/cliente/:id" element={<DetalhesCliente />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}