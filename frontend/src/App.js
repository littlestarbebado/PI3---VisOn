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

/* LAYOUT ADMIN */
import AdminLayout from './layouts/AdminLayout';

/* PÁGINAS ADMIN */
import Dashboard from './pages/adm/Dashboard';
import Empresa from './pages/adm/Empresa';
import ServicosAdmin from './pages/adm/ServicosAdmin';
import ArtigosAdmin from './pages/adm/ArtigosAdmin';
import Utilizadores from './pages/adm/Utilizadores';
import Documentos from './pages/adm/Documentos';
import Atividade from './pages/adm/Atividade';

export default function App() {

  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* PÚBLICO */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/login" element={<Login />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>

            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="empresa"
              element={<Empresa />}
            />

            <Route
              path="servicos-admin"
              element={<ServicosAdmin />}
            />

            <Route
              path="artigos-admin"
              element={<ArtigosAdmin />}
            />

            <Route
              path="utilizadores"
              element={<Utilizadores />}
            />

            <Route
              path="documentos"
              element={<Documentos />}
            />

            <Route
              path="atividade"
              element={<Atividade />}
            />

          </Route>

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}