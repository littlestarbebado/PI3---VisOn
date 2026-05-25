import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetalhesCliente = () => {
  const { id } = useParams(); // Apanha o ID que veio do link do Dashboard
  const navigate = useNavigate();

  // Estados para guardar os dados reais do Postgres
  const [cliente, setCliente] = useState(null);
  const [ativos, setAtivos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  
  // Estado para controlar a aba ativa (Visual)
  const [abaAtiva, setAbaAtiva] = useState('ativos');

  useEffect(() => {
    // Chamada real à nova rota do Backend
    axios.get(`http://localhost:5000/api/clientes/${id}`)
      .then(response => {
        setCliente(response.data.cliente);
        setAtivos(response.data.ativos);
        setDocumentos(response.data.documentos);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar detalhes do cliente:', error);
        setErro('Não foi possível carregar as informações deste cliente.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center text-white my-5">A carregar dados do Postgres...</div>;
  if (erro) return <div className="alert alert-danger m-5 text-center">{erro}</div>;
  if (!cliente) return <div className="alert alert-warning m-5 text-center">Cliente não encontrado.</div>;

  return (
    <div className="container-fluid min-vh-100 p-4 text-white" style={{ backgroundColor: '#0a0c14' }}>
      {/* Botão de Voltar */}
      <button onClick={() => navigate('/gestor')} className="btn btn-outline-light btn-sm mb-4">
        ← Voltar ao Painel
      </button>

      {/* Cabeçalho do Cliente */}
      <div className="mb-5">
        <h1 className="display-5 fw-bold">{cliente.nome}</h1>
        <p className="text-muted">
          Responsável: <strong className="text-white">{cliente.responsavel || 'Não definido'}</strong> | 
          Email: <strong className="text-white">{cliente.email || 'Sem contacto'}</strong>
        </p>
      </div>

      {/* Navegação por Abas (Tabs) */}
      <ul className="nav nav-tabs border-secondary mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link text-white border-0 ${abaAtiva === 'ativos' ? 'active bg-secondary fw-bold' : ''}`}
            onClick={() => setAbaAtiva('ativos')}
          >
            Ativos Tecnológicos ({ativos.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link text-white border-0 ${abaAtiva === 'documentos' ? 'active bg-secondary fw-bold' : ''}`}
            onClick={() => setAbaAtiva('documentos')}
          >
            Documentação Técnica ({documentos.length})
          </button>
        </li>
      </ul>

      {/* Conteúdo da Aba Ativos */}
      {abaAtiva === 'ativos' && (
        <div className="row g-3">
          {ativos.length === 0 ? (
            <p className="text-muted ps-3">Nenhum ativo tecnológico registado para esta empresa no pgAdmin.</p>
          ) : (
            ativos.map(ativo => (
              <div key={ativo.id} className="col-md-4">
                <div className="card bg-dark text-white border-secondary h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-info">{ativo.nome}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{ativo.tipo || 'Hardware'}</h6>
                    <p className="card-text text-light">{ativo.descricao || 'Sem descrição detalhada.'}</p>
                    <span className="badge bg-warning text-dark">{ativo.criticidade || 'Média'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Conteúdo da Aba Documentos */}
{abaAtiva === 'documentos' && (
  <div>
    {/* FORMULÁRIO DE UPLOAD */}
    <div className="card bg-dark border-secondary mb-4 shadow-sm">
      <div className="card-header border-secondary text-info fw-bold small">📎 Upload de Novo Relatório / Documento</div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pdf', e.target.fileInput.files[0]);
        formData.append('nome', e.target.nomeDoc.value);
        formData.append('descricao', e.target.descDoc.value);

        axios.post(`http://localhost:5000/api/clientes/${id}/documentos`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(() => {
          alert('PDF guardado com sucesso no servidor!');
          window.location.reload(); // Recarrega a página para puxar o PDF novo do Postgres!
        })
        .catch(err => alert(err.response?.data?.erro || 'Erro no upload'));
      }} className="card-body row g-2">
        <div className="col-md-3">
          <input type="text" name="nomeDoc" className="form-control form-control-sm bg-secondary text-white border-0" placeholder="Nome do Documento *" required />
        </div>
        <div className="col-md-4">
          <input type="text" name="descDoc" className="form-control form-control-sm bg-secondary text-white border-0" placeholder="Breve descrição do ficheiro..." />
        </div>
        <div className="col-md-3">
          <input type="file" name="fileInput" accept=".pdf" className="form-control form-control-sm bg-secondary text-white border-0" required />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-sm btn-info text-dark fw-bold w-100">Enviar PDF</button>
        </div>
      </form>
    </div>

    {/* TABELA DE DOCUMENTOS */}
    <div className="card bg-dark border-secondary">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr className="text-secondary border-secondary">
                <th className="ps-4">Nome do Documento</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th className="text-end pe-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {documentos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    Nenhum PDF ou relatório associado a este cliente.
                  </td>
                </tr>
              ) : (
                documentos.map(doc => (
                  <tr key={doc.id} className="border-secondary">
                    <td className="ps-4 fw-semibold">{doc.nome}</td>
                    <td><span className="badge bg-danger text-white">{doc.tipo || 'PDF'}</span></td>
                    <td className="text-muted">{doc.descricao || 'Sem descrição fornecida.'}</td>
                    <td className="text-end pe-4">
                      <a 
                        href={`http://localhost:5000/${doc.caminho}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-sm btn-info text-dark fw-bold"
                      >
                        Visualizar PDF
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default DetalhesCliente;