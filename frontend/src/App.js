import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa o componente que desenhámos
import DashboardGestor from './pages/gestor/DashboardGestor';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Se depois criares uma Sidebar global, ela pode ficar aqui em cima do Routes */}
        <Routes>
          {/* Por agora, definimos a Gestão de Conteúdos como a página inicial "/" */}
          <Route path="/gestor" element={<DashboardGestor />} />
          
          {/* Se quiseres que fique no caminho /gestao, usa este debaixo (descomentado) */}
          {/* <Route path="/gestao" element={<GestaoConteudo />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;