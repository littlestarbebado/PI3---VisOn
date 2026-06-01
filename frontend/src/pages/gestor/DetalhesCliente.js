import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DetalhesCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [ativos, setAtivos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('ativos');

  const [nomeDoc, setNomeDoc] = useState('');
  const [descDoc, setDescDoc] = useState('');
  const [ficheiro, setFicheiro] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErro, setUploadErro] = useState(null);
  const [uploadSucesso, setUploadSucesso] = useState(false);

  const carregarDetalhes = () => {
    api.get(`/clientes/${id}`)
      .then(response => {
        setCliente(response.data.cliente);
        setAtivos(response.data.ativos || []);
        setDocumentos(response.data.documentos || []);
        setErro(null);
      })
      .catch(error => {
        console.error('Erro ao carregar detalhes:', error);
        setErro('Nao foi possivel carregar as informacoes deste cliente.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const handleUpload = () => {
    setUploadErro(null);
    setUploadSucesso(false);

    if (!nomeDoc || !ficheiro) {
      setUploadErro('O nome do documento e o ficheiro PDF sao obrigatorios.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('pdf', ficheiro);
    formData.append('nome', nomeDoc);
    formData.append('descricao', descDoc);

    api.post(`/clientes/${id}/documentos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        setUploadSucesso(true);
        setNomeDoc('');
        setDescDoc('');
        setFicheiro(null);
        carregarDetalhes();
      })
      .catch(err => {
        setUploadErro(err.response?.data?.erro || 'Erro ao enviar o ficheiro.');
      })
      .finally(() => setUploading(false));
  };

  if (loading) return <div className="text-center text-white my-5">A carregar dados do cliente...</div>;
  if (erro) return <div className="alert alert-danger m-5 text-center">{erro}</div>;
  if (!cliente) return <div className="alert alert-warning m-5 text-center">Cliente nao encontrado.</div>;

  return (
    <div className="container-fluid min-vh-100 p-4 text-white" style={{ backgroundColor: '#0a0c14' }}>
      <button onClick={() => navigate('/gestor')} className="btn btn-outline-light btn-sm mb-4">
        Voltar ao Painel
      </button>

      <div className="mb-5">
        <h1 className="display-5 fw-bold">{cliente.nome}</h1>
        <p className="text-muted">
          Responsavel: <strong className="text-white">{cliente.respSegurancaNome || 'Nao definido'}</strong> |{' '}
          Email: <strong className="text-white">{cliente.email || 'Sem contacto'}</strong>
        </p>
      </div>

      <ul className="nav nav-tabs border-secondary mb-4">
        <li className="nav-item">
          <button
            className={`nav-link text-white border-0 ${abaAtiva === 'ativos' ? 'active bg-secondary fw-bold' : ''}`}
            onClick={() => setAbaAtiva('ativos')}
          >
            Ativos Tecnologicos ({ativos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white border-0 ${abaAtiva === 'documentos' ? 'active bg-secondary fw-bold' : ''}`}
            onClick={() => setAbaAtiva('documentos')}
          >
            Documentacao Tecnica ({documentos.length})
          </button>
        </li>
      </ul>

      {abaAtiva === 'ativos' && (
        <div className="card bg-dark border-secondary">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0 align-middle">
                <thead>
                  <tr className="text-secondary border-secondary">
                    <th className="ps-4">Nome</th>
                    <th>Tipo</th>
                    <th>Criticidade</th>
                    <th className="pe-4">Descricao</th>
                  </tr>
                </thead>
                <tbody>
                  {ativos.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        Nenhum ativo tecnologico registado para esta empresa.
                      </td>
                    </tr>
                  ) : (
                    ativos.map(ativo => (
                      <tr key={ativo.id} className="border-secondary">
                        <td className="ps-4 fw-semibold text-info">{ativo.nome}</td>
                        <td>{ativo.tipo || 'Nao definido'}</td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            {ativo.criticidade || 'Media'}
                          </span>
                        </td>
                        <td className="text-muted pe-4">{ativo.descricao || 'Sem descricao detalhada.'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {abaAtiva === 'documentos' && (
        <div>
          <div className="card bg-dark border-secondary mb-4 shadow-sm">
            <div className="card-header border-secondary text-info fw-bold small">
              Upload de Novo Relatorio / Documento
            </div>
            <div className="card-body row g-2">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control form-control-sm bg-secondary text-white border-0"
                  placeholder="Nome do Documento *"
                  value={nomeDoc}
                  onChange={e => setNomeDoc(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control form-control-sm bg-secondary text-white border-0"
                  placeholder="Breve descricao do ficheiro..."
                  value={descDoc}
                  onChange={e => setDescDoc(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <input
                  type="file"
                  accept=".pdf"
                  className="form-control form-control-sm bg-secondary text-white border-0"
                  onChange={e => setFicheiro(e.target.files[0] || null)}
                />
              </div>

              <div className="col-md-2">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn btn-sm btn-info text-dark fw-bold w-100"
                >
                  {uploading ? 'A enviar...' : 'Enviar PDF'}
                </button>
              </div>

              {uploadErro && (
                <div className="col-12">
                  <div className="alert alert-danger py-2 small mb-0">{uploadErro}</div>
                </div>
              )}

              {uploadSucesso && (
                <div className="col-12">
                  <div className="alert alert-success py-2 small mb-0">PDF enviado com sucesso!</div>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-dark border-secondary">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr className="text-secondary border-secondary">
                      <th className="ps-4">Nome do Documento</th>
                      <th>Tipo</th>
                      <th>Descricao</th>
                      <th className="text-end pe-4">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          Nenhum PDF ou relatorio associado a este cliente.
                        </td>
                      </tr>
                    ) : (
                      documentos.map(doc => (
                        <tr key={doc.id} className="border-secondary">
                          <td className="ps-4 fw-semibold">{doc.nome}</td>
                          <td><span className="badge bg-danger text-white">{doc.tipo || 'PDF'}</span></td>
                          <td className="text-muted">{doc.descricao || 'Sem descricao fornecida.'}</td>
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
