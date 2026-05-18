import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardGestor = () => {
  const navigate = useNavigate();
  
  // Começamos com uma lista vazia, porque os dados vão vir do Postgres
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // EFETUAR A CHAMADA REAL À BASE DE DADOS
  useEffect(() => {
    axios.get('http://localhost:5000/api/clientes') 
      .then(response => {
        setClientes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao procurar clientes reais:', error);
        setErro('Não foi possível carregar a lista de empresas.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container my-5">
      {/* Cabeçalho */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="display-6 fw-bold text-dark">Painel do Gestor</h1>
          <p className="text-muted">Selecione uma empresa cliente para analisar os ativos e documentação real.</p>
        </div>
      </div>

      {/* Estados de Carregamento e Erro */}
      {loading && <div className="text-center my-4">A ligar ao PostgreSQL...</div>}
      {erro && <div className="alert alert-danger text-center">{erro}</div>}

      {/* Tabela de Clientes em Bootstrap */}
      {!loading && !erro && (
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
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        Nenhuma empresa encontrada na tabela "Clientes" do pgAdmin.
                      </td>
                    </tr>
                  ) : (
                    clientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <td className="ps-4 fw-semibold text-dark">{cliente.nome}</td>
                        <td>{cliente.responsavel || 'Não definido'}</td>
                        <td>{cliente.email || 'Sem email'}</td>
                        <td>
                          {/* Mapeia o estado ou mete 'Ativo' por padrão caso não exista na vossa tabela */}
                          <span className={`badge ${cliente.status === 'Pendente' ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'} border px-2 py-1`}>
                            {cliente.status || 'Ativo'}
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          {/* Envia dinamicamente o ID real da BD para a página de detalhes */}
                          <button 
                            onClick={() => navigate(`/gestor/cliente/${cliente.id}`)}
                            className="btn btn-primary btn-sm px-3 shadow-sm text-white"
                            style={{ backgroundColor: '#0a0c14', borderColor: '#0a0c14' }}
                          >
                            Analisar Cliente
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardGestor;