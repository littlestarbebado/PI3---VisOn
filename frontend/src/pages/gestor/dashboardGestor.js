import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DashboardGestor = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Estado do formulário de novo cliente
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');

  // Estado para o primeiro ativo opcional
  const [nomeAtivo, setNomeAtivo] = useState('');
  const [tipoAtivo, setTipoAtivo] = useState('');
  const [criticidadeAtivo, setCriticidadeAtivo] = useState('Média');

  // Carregar lista de clientes da API
  const carregarClientes = () => {
    setLoading(true);
    api.get('/clientes')
      .then(res => {
        setClientes(res.data);
        setErro(null);
      })
      .catch(err => {
        console.error('Erro ao carregar clientes:', err);
        setErro('Não foi possível carregar a lista de empresas.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  // Criar novo cliente
  const handleCriarCliente = () => {
    if (!nome) {
      setErro('O nome da empresa é obrigatório.');
      return;
    }

    const dados = { nome, responsavel, email, nomeAtivo, tipoAtivo, criticidadeAtivo };

    api.post('/clientes', dados)
      .then(() => {
        // Limpar os campos do formulário
        setNome('');
        setResponsavel('');
        setEmail('');
        setNomeAtivo('');
        setTipoAtivo('');
        setCriticidadeAtivo('Média');
        setMostrarForm(false);
        setErro(null);
        // Atualizar a lista de imediato sem reload
        carregarClientes();
      })
      .catch(err => {
        setErro(err.response?.data?.erro || 'Erro ao criar cliente.');
      });
  };

  if (loading) return <div className="text-center text-white my-5">A ligar ao servidor...</div>;

  return (
    <div className="container p-4 text-white min-vh-100" style={{ backgroundColor: '#0a0c14' }}>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">Painel do Gestor</h1>
          <p className="text-muted">Gestão de clientes, ativos e documentação em tempo real.</p>
        </div>
        <button
          onClick={() => { setMostrarForm(!mostrarForm); setErro(null); }}
          className={`btn ${mostrarForm ? 'btn-danger' : 'btn-success'} fw-bold`}
        >
          {mostrarForm ? 'Cancelar' : '+ Adicionar Cliente'}
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {/* FORMULÁRIO DE INSERÇÃO */}
      {mostrarForm && (
        <div className="card bg-dark border-secondary mb-4 shadow">
          <div className="card-header border-secondary text-info fw-bold">
            Registar Nova Empresa Cliente
          </div>
          <div className="card-body row g-3">

            <div className="col-md-4">
              <label className="form-label text-muted small">Nome da Empresa *</label>
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: TechCorp"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted small">Gestor / Responsável</label>
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                value={responsavel}
                onChange={e => setResponsavel(e.target.value)}
                placeholder="Ex: Daniel Silva"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted small">Email de Contacto</label>
              <input
                type="email"
                className="form-control bg-secondary text-white border-0"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="cliente@empresa.com"
              />
            </div>

            <hr className="border-secondary my-3" />
            <p className="text-info small mb-1">Adicionar Primeiro Ativo Tecnológico (Opcional)</p>

            <div className="col-md-4">
              <label className="form-label text-muted small">Nome do Ativo</label>
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                value={nomeAtivo}
                onChange={e => setNomeAtivo(e.target.value)}
                placeholder="Ex: Servidor de Base de Dados"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted small">Tipo de Ativo</label>
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                value={tipoAtivo}
                onChange={e => setTipoAtivo(e.target.value)}
                placeholder="Ex: Cloud / Web Server"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted small">Criticidade</label>
              <select
                className="form-select bg-secondary text-white border-0"
                value={criticidadeAtivo}
                onChange={e => setCriticidadeAtivo(e.target.value)}
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>

            <div className="col-12 text-end mt-4">
              <button
                onClick={handleCriarCliente}
                className="btn btn-info text-dark fw-bold px-4"
              >
                Guardar Cliente
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TABELA DE CLIENTES */}
      <div className="card bg-dark border-secondary">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr className="text-secondary border-secondary">
                <th className="ps-4">Empresa</th>
                <th>Responsável</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th className="text-end pe-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Nenhuma empresa registada. Crie a primeira!
                  </td>
                </tr>
              ) : (
                // key usa o id real da base de dados
                clientes.map(c => (
                  <tr key={c.id} className="border-secondary">
                    <td className="ps-4 fw-bold text-info">{c.nome}</td>
                    <td>{c.responsavel || 'Não alocado'}</td>
                    <td>{c.email || 'N/D'}</td>
                    <td><span className="badge bg-success">{c.status}</span></td>
                    <td className="text-end pe-4">
                      <button
                        onClick={() => navigate(`cliente/${c.id}`)}
                        className="btn btn-sm btn-outline-light"
                      >
                        Analisar Cliente →
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
  );
};

export default DashboardGestor;