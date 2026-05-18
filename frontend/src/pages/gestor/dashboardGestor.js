import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardGestor = () => {
  const navigate = useNavigate();
  
  // Dados fictícios iniciais para conseguires testar o visual já!
  const [clientes, setClientes] = useState([
    { id: 1, nome: 'TechCorp Solutions', responsavel: 'Ana Silva', email: 'seguranca@techcorp.pt', status: 'Ativo' },
    { id: 2, nome: 'DigitalInnovations Lda', responsavel: 'Carlos Santos', email: 'carlos@digitalin.pt', status: 'Ativo' },
    { id: 3, nome: 'Global Security SA', responsavel: 'Maria Fonte', email: 'maria.fonte@globalsec.com', status: 'Pendente' }
  ]);

  // Quando o backend estiver 100% integrado com os utilizadores do Kuka, 
  // descomentas este bloco para ir buscar os clientes reais da Base de Dados:
  /*
  useEffect(() => {
    axios.get('http://localhost:5000/api/clientes') // Rota fictícia de exemplo
      .then(response => setClientes(response.data))
      .catch(error => console.error('Erro ao procurar clientes:', error));
  }, []);
  */

  return (
    <div className="container my-5">
      {/* Cabeçalho */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="display-6 fw-bold text-dark">Painel do Gestor</h1>
          <p className="text-muted">Selecione uma empresa cliente para analisar os ativos e documentação.</p>
        </div>
      </div>

      {/* Tabela de Clientes em Bootstrap */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary">
                <tr>
                  <th className="ps-4 py-3">Empresa Cliente</th>
                  <th className="py-3">Responsável de Segurança</th>
                  <th className="py-3">Email de Contacto</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3 text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="ps-4 fw-semibold text-dark">{cliente.nome}</td>
                    <td>{cliente.responsavel}</td>
                    <td>{cliente.email}</td>
                    <td>
                      <span className={`badge ${cliente.status === 'Ativo' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} border px-2 py-1`}>
                        {cliente.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {/* Ao clicar, navega para a tua página de detalhes passando o ID do cliente */}
                      <button 
                        onClick={() => navigate(`/gestor/cliente/${cliente.id}`)}
                        className="btn btn-primary btn-sm px-3 shadow-sm text-white"
                        style={{ backgroundColor: '#0a0c14', borderColor: '#0a0c14' }}
                      >
                        Analisar Cliente
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGestor;