import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { exportReportToPdf } from '../../utils/pdfExport';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const ESTADOS_NIS2 = [
  ['Nao Iniciado', 'Não Iniciado'],
  ['Em Analise', 'Em Análise'],
  ['Conforme', 'Conforme'],
  ['Nao Conforme', 'Não Conforme']
];

function classificarRisco(score) {
  if (score <= 30) return { nivel: 'Alto', cor: 'text-danger' };
  if (score <= 70) return { nivel: 'Médio', cor: 'text-warning' };
  return { nivel: 'Baixo', cor: 'text-success' };
}

function categoriaDocumento(categoria) {
  if (categoria === 'Evidencia') return 'Evidência';
  if (categoria === 'Documentacao') return 'Documentação';
  return categoria || 'Documento';
}

function estadoNIS2Label(estado) {
  return ESTADOS_NIS2.find(([valor]) => valor === estado)?.[1] || estado || 'Nao Iniciado';
}

const DetalhesCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [ativos, setAtivos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [incidentes, setIncidentes] = useState([]);
  const [incidenteAtivoId, setIncidenteAtivoId] = useState(null);
  const [pedidoAtivoId, setPedidoAtivoId] = useState(null);
  const [mensagemPedido, setMensagemPedido] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('ativos');

  const [nomeDoc, setNomeDoc] = useState('');
  const [descDoc, setDescDoc] = useState('');
  const [categoriaDoc, setCategoriaDoc] = useState('Documentacao');
  const [ficheiro, setFicheiro] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErro, setUploadErro] = useState(null);
  const [uploadSucesso, setUploadSucesso] = useState(false);
  const [documentoFeedback, setDocumentoFeedback] = useState('');
  const [documentoErro, setDocumentoErro] = useState('');
  const [documentoEliminandoId, setDocumentoEliminandoId] = useState(null);
  const [nis2, setNis2] = useState({
    estado: 'Nao Iniciado',
    percentagem: 0,
    observacoes: '',
    evidenciasIds: []
  });
  const [nis2Feedback, setNis2Feedback] = useState('');

  const carregarDetalhes = useCallback(() => {
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
  }, [id]);

  const carregarPedidos = useCallback(() => {
    api.get(`/pedidos?clienteId=${id}`)
      .then(response => {
        const lista = response.data || [];
        setPedidos(lista);
        setPedidoAtivoId(prev => (
          lista.some(pedido => pedido.id === prev) ? prev : lista[0]?.id || null
        ));
      })
      .catch(error => {
        console.error('Erro ao carregar pedidos:', error);
      });
  }, [id]);

  const carregarIncidentes = useCallback(() => {
    api.get(`/incidentes?clienteId=${id}`)
      .then(response => {
        const lista = response.data || [];
        setIncidentes(lista);
        setIncidenteAtivoId(prev => (
          lista.some(incidente => incidente.id === prev) ? prev : lista[0]?.id || null
        ));
      })
      .catch(error => {
        console.error('Erro ao carregar incidentes:', error);
      });
  }, [id]);

  const carregarNIS2 = useCallback(() => {
    api.get(`/nis2?clienteId=${id}`)
      .then(response => {
        const avaliacao = response.data.avaliacao;
        setNis2(avaliacao ? {
          estado: avaliacao.estado,
          percentagem: avaliacao.percentagem,
          observacoes: avaliacao.observacoes || '',
          evidenciasIds: avaliacao.evidenciasIds || []
        } : {
          estado: 'Nao Iniciado', percentagem: 0, observacoes: '', evidenciasIds: []
        });
      })
      .catch(() => setErro('Nao foi possivel carregar a avaliacao NIS2.'));
  }, [id]);

  useEffect(() => {
    carregarDetalhes();
    carregarPedidos();
    carregarIncidentes();
    carregarNIS2();
  }, [carregarDetalhes, carregarPedidos, carregarIncidentes, carregarNIS2]);

  const pedidoAtivo = pedidos.find(pedido => pedido.id === pedidoAtivoId) || pedidos[0];
  const incidenteAtivo = incidentes.find(incidente => incidente.id === incidenteAtivoId) || incidentes[0];

  const estadoBadgeClass = (estado) => {
    if (estado === 'Pendente') return 'bg-danger';
    if (estado === 'Em Analise') return 'bg-primary';
    if (estado === 'Resolvido') return 'bg-success';
    if (estado === 'Em Análise') return 'bg-primary';
    if (estado === 'Concluído') return 'bg-success';
    return 'bg-secondary';
  };

  const formatarData = (valor) => {
    if (!valor) return 'Sem data';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return 'Sem data';
    return data.toLocaleString('pt-PT');
  };

  const responderPedido = (event) => {
    event.preventDefault();
    if (!pedidoAtivo || !mensagemPedido.trim()) return;

    api.post(`/pedidos/${pedidoAtivo.id}/mensagens`, { texto: mensagemPedido })
      .then(response => {
        setPedidos(prev => prev.map(pedido => (
          pedido.id === pedidoAtivo.id
            ? { ...pedido, mensagens: [...(pedido.mensagens || []), response.data] }
            : pedido
        )));
        setMensagemPedido('');
      })
      .catch(error => {
        setErro(error.response?.data?.erro || 'Nao foi possivel enviar a mensagem.');
      });
  };

  const alterarEstadoPedido = (estado) => {
    if (!pedidoAtivo) return;

    api.put(`/pedidos/${pedidoAtivo.id}/estado`, { estado })
      .then(response => {
        setPedidos(prev => prev.map(pedido => (
          pedido.id === pedidoAtivo.id ? { ...pedido, estado: response.data.estado } : pedido
        )));
      })
      .catch(error => {
        setErro(error.response?.data?.erro || 'Nao foi possivel alterar o estado do pedido.');
      });
  };

  const alterarEstadoIncidente = (estado) => {
    if (!incidenteAtivo) return;

    api.put(`/incidentes/${incidenteAtivo.id}/estado`, { estado })
      .then(response => {
        setIncidentes(prev => prev.map(incidente => (
          incidente.id === incidenteAtivo.id ? { ...incidente, estado: response.data.estado } : incidente
        )));
      })
      .catch(error => {
        setErro(error.response?.data?.erro || 'Nao foi possivel alterar o estado do incidente.');
      });
  };

  const alterarEstadoDocumento = (documentoId, estado) => {
    setDocumentoErro('');
    setDocumentoFeedback('');
    api.put(`/documentos/${documentoId}/estado`, { estado })
      .then(response => {
        setDocumentos(prev => prev.map(doc => (
          doc.id === documentoId ? { ...doc, estado: response.data.estado } : doc
        )));
        setDocumentoFeedback('Estado do documento atualizado.');
      })
      .catch(error => {
        setDocumentoErro(error.response?.data?.erro || 'Nao foi possivel alterar o estado da submissao.');
      });
  };

  const eliminarDocumento = async (documentoId) => {
    if (!window.confirm('Eliminar este documento?')) return;

    setDocumentoEliminandoId(documentoId);
    setDocumentoErro('');
    setDocumentoFeedback('');

    try {
      await api.delete(`/documentos/${documentoId}`);
      setDocumentos(prev => prev.filter(doc => doc.id !== documentoId));
      setDocumentoFeedback('Documento eliminado com sucesso.');
    } catch (error) {
      setDocumentoErro(error.response?.data?.erro || 'Nao foi possivel eliminar o documento.');
    } finally {
      setDocumentoEliminandoId(null);
    }
  };

  const guardarNIS2 = () => {
    setNis2Feedback('');
    api.put(`/nis2/${id}`, nis2)
      .then(response => {
        setNis2(response.data.avaliacao);
        setNis2Feedback('Avaliação NIS2 guardada.');
      })
      .catch(error => {
        setErro(error.response?.data?.erro || 'Nao foi possivel guardar a avaliacao NIS2.');
      });
  };

  const alternarEvidenciaNIS2 = (documentoId) => {
    setNis2(prev => ({
      ...prev,
      evidenciasIds: prev.evidenciasIds.includes(documentoId)
        ? prev.evidenciasIds.filter(idDocumento => idDocumento !== documentoId)
        : [...prev.evidenciasIds, documentoId]
    }));
  };

  const handleUpload = () => {
    setUploadErro(null);
    setUploadSucesso(false);
    setDocumentoErro('');
    setDocumentoFeedback('');

    if (!nomeDoc || !ficheiro) {
      setUploadErro('O nome do documento e o ficheiro PDF sao obrigatorios.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('ficheiro', ficheiro);
    formData.append('nome', nomeDoc);
    formData.append('descricao', descDoc);
    formData.append('categoria', categoriaDoc);
    formData.append('ClienteId', id);

    api.post('/documentos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        setUploadSucesso(true);
        setDocumentoFeedback('Documento carregado com sucesso.');
        setNomeDoc('');
        setDescDoc('');
        setCategoriaDoc('Documentacao');
        setFicheiro(null);
        carregarDetalhes();
      })
      .catch(err => {
        setUploadErro(err.response?.data?.erro || 'Erro ao enviar o ficheiro.');
      })
      .finally(() => setUploading(false));
  };

  const exportarAtivosPDF = () => {
    exportReportToPdf({
      title: 'Ativos Tecnologicos',
      clientName: cliente?.nome,
      sections: [{
        title: 'Inventario de ativos',
        description: 'Resumo dos ativos tecnologicos registados para o cliente.',
        table: {
          columns: [
            { key: 'nome', label: 'Nome' },
            { key: 'tipo', label: 'Tipo' },
            { key: 'criticidade', label: 'Criticidade' },
            { key: 'descricao', label: 'Descricao' }
          ],
          rows: ativos.map(ativo => ({
            nome: ativo.nome,
            tipo: ativo.tipo || 'Nao definido',
            criticidade: ativo.criticidade || 'Media',
            descricao: ativo.descricao || 'Sem descricao detalhada.'
          }))
        }
      }]
    });
  };

  const exportarNIS2PDF = () => {
    const evidencias = documentos
      .filter(doc => nis2.evidenciasIds.includes(doc.id))
      .map(doc => ({
        nome: doc.nome,
        categoria: categoriaDocumento(doc.categoria),
        estado: doc.estado || 'N/D'
      }));

    exportReportToPdf({
      title: 'Avaliacao NIS2',
      clientName: cliente?.nome,
      sections: [
        {
          title: 'Estado de conformidade',
          fields: [
            { label: 'Estado', value: estadoNIS2Label(nis2.estado) },
            { label: 'Percentagem', value: `${nis2.percentagem || 0}%` },
            { label: 'Score de seguranca', value: `${cliente?.score ?? 0}/100` }
          ],
          description: nis2.observacoes || 'A avaliacao NIS2 ainda nao tem observacoes.'
        },
        {
          title: 'Evidencias associadas',
          table: {
            columns: [
              { key: 'nome', label: 'Documento' },
              { key: 'categoria', label: 'Categoria' },
              { key: 'estado', label: 'Estado' }
            ],
            rows: evidencias
          }
        }
      ]
    });
  };

  const exportarIncidentesPDF = () => {
    exportReportToPdf({
      title: 'Incidentes',
      clientName: cliente?.nome,
      sections: [{
        title: 'Incidentes reportados',
        description: 'Registo dos incidentes submetidos pelo cliente e respetivo estado de acompanhamento.',
        table: {
          columns: [
            { key: 'tipo', label: 'Tipo' },
            { key: 'impacto', label: 'Impacto' },
            { key: 'data', label: 'Data/Hora' },
            { key: 'estado', label: 'Estado' },
            { key: 'descricao', label: 'Descricao' },
            { key: 'acoes', label: 'Acoes imediatas' }
          ],
          rows: incidentes.map(incidente => ({
            tipo: incidente.tipo,
            impacto: incidente.impacto,
            data: formatarData(incidente.dataOcorrencia),
            estado: incidente.estado,
            descricao: incidente.descricao,
            acoes: incidente.acoesImediatas || 'Sem acoes imediatas comunicadas.'
          }))
        }
      }]
    });
  };

  if (loading) return <div className="text-center text-white my-5">A carregar dados do cliente...</div>;
  if (erro) return <div className="alert alert-danger m-5 text-center">{erro}</div>;
  if (!cliente) return <div className="alert alert-warning m-5 text-center">Cliente nao encontrado.</div>;

  const risco = classificarRisco(cliente.score ?? 0);

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
        <p className="mb-0">
          Score de segurança: <strong>{cliente.score ?? 0}/100</strong> ·{' '}
          Risco: <strong className={risco.cor}>{risco.nivel}</strong>
        </p>
      </div>

      <ul className="nav nav-tabs border-secondary mb-4 manager-tabs-scroll">
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
        <li className="nav-item">
          <button
            className={`nav-link text-white border-0 ${abaAtiva === 'nis2' ? 'active bg-secondary fw-bold' : ''}`}
            onClick={() => setAbaAtiva('nis2')}
          >
            NIS2
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white border-0 ${abaAtiva === 'incidentes' ? 'active bg-secondary fw-bold' : ''}`}
            onClick={() => setAbaAtiva('incidentes')}
          >
            Incidentes ({incidentes.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white border-0 ${abaAtiva === 'pedidos' ? 'active bg-secondary fw-bold' : ''}`}
            onClick={() => setAbaAtiva('pedidos')}
          >
            Pedidos ({pedidos.length})
          </button>
        </li>
      </ul>

      {abaAtiva === 'ativos' && (
        <div className="card bg-dark border-secondary">
          <div className="card-header border-secondary d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <span className="text-info fw-bold">Ativos tecnologicos</span>
            <button type="button" className="btn btn-sm btn-info text-dark fw-bold" onClick={exportarAtivosPDF}>
              Exportar PDF
            </button>
          </div>
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
              <div className="col-md-2">
                <select
                  className="form-select form-select-sm bg-secondary text-white border-0"
                  value={categoriaDoc}
                  onChange={e => setCategoriaDoc(e.target.value)}
                >
                  <option value="Evidencia">Evidência</option>
                  <option value="Pen Test">Pen Test</option>
                  <option value="Documentacao">Documentação</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control form-control-sm bg-secondary text-white border-0"
                  placeholder="Nome do Documento *"
                  value={nomeDoc}
                  onChange={e => setNomeDoc(e.target.value)}
                />
              </div>

              <div className="col-md-3">
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

              {documentoErro && (
                <div className="col-12">
                  <div className="alert alert-danger py-2 small mb-0">{documentoErro}</div>
                </div>
              )}

              {documentoFeedback && (
                <div className="col-12">
                  <div className="alert alert-success py-2 small mb-0">{documentoFeedback}</div>
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
                      <th>Categoria</th>
                      <th>Tipo</th>
                      <th>Descricao</th>
                      <th>Estado</th>
                      <th className="text-end pe-4">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          Nenhum PDF ou relatorio associado a este cliente.
                        </td>
                      </tr>
                    ) : (
                      documentos.map(doc => (
                        <tr key={doc.id} className="border-secondary">
                          <td className="ps-4 fw-semibold">{doc.nome}</td>
                          <td><span className="badge bg-info text-dark">{categoriaDocumento(doc.categoria)}</span></td>
                          <td><span className="badge bg-danger text-white">{doc.tipo || 'PDF'}</span></td>
                          <td className="text-muted">{doc.descricao || 'Sem descricao fornecida.'}</td>
                          <td>
                            {['Evidencia', 'Pen Test', 'Documentacao', 'Outros'].includes(doc.categoria) ? (
                              <select
                                className="form-select form-select-sm bg-secondary text-white border-0"
                                value={doc.estado || 'Pendente'}
                                onChange={event => alterarEstadoDocumento(doc.id, event.target.value)}
                              >
                                <option value="Pendente">Pendente</option>
                                <option value="Em Analise">Em Análise</option>
                                <option value="Concluido">Concluído</option>
                              </select>
                            ) : (
                              <span className="badge bg-success">{doc.estado || 'Concluido'}</span>
                            )}
                          </td>
                          <td className="text-end pe-4">
                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                              <a
                                href={`${BACKEND_URL}${doc.caminho}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-info text-dark fw-bold"
                              >
                                Visualizar PDF
                              </a>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => eliminarDocumento(doc.id)}
                                disabled={documentoEliminandoId === doc.id}
                              >
                                {documentoEliminandoId === doc.id ? 'A eliminar...' : 'Eliminar'}
                              </button>
                            </div>
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

      {abaAtiva === 'nis2' && (
        <div className="card bg-dark border-secondary">
          <div className="card-header border-secondary d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <span className="text-info fw-bold">Avaliação de Conformidade NIS2</span>
            <button type="button" className="btn btn-sm btn-info text-dark fw-bold" onClick={exportarNIS2PDF}>
              Exportar PDF
            </button>
          </div>
          <div className="card-body row g-4">
            <div className="col-md-6">
              <label className="form-label text-white-50">Estado</label>
              <select
                className="form-select bg-secondary text-white border-0"
                value={nis2.estado}
                onChange={event => setNis2(prev => ({ ...prev, estado: event.target.value }))}
              >
                {ESTADOS_NIS2.map(([valor, label]) => <option key={valor} value={valor}>{label}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label text-white-50">Percentagem de conformidade</label>
              <div className="input-group">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control bg-secondary text-white border-0"
                  value={nis2.percentagem}
                  onChange={event => setNis2(prev => ({ ...prev, percentagem: Number(event.target.value) }))}
                />
                <span className="input-group-text">%</span>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label text-white-50">Observações</label>
              <textarea
                rows="4"
                className="form-control bg-secondary text-white border-0"
                value={nis2.observacoes}
                onChange={event => setNis2(prev => ({ ...prev, observacoes: event.target.value }))}
              />
            </div>
            <div className="col-12">
              <label className="form-label text-white-50 d-block">Evidências associadas</label>
              <div className="border border-secondary rounded p-3">
                {documentos.filter(doc => ['Evidencia', 'Pen Test', 'Documentacao', 'Outros'].includes(doc.categoria)).length === 0 ? (
                  <span className="text-white-50">Não existem documentos elegíveis.</span>
                ) : documentos
                  .filter(doc => ['Evidencia', 'Pen Test', 'Documentacao', 'Outros'].includes(doc.categoria))
                  .map(doc => (
                    <label key={doc.id} className="d-flex align-items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={nis2.evidenciasIds.includes(doc.id)}
                        onChange={() => alternarEvidenciaNIS2(doc.id)}
                      />
                      <span>{doc.nome} <small className="text-info">({categoriaDocumento(doc.categoria)})</small></span>
                    </label>
                  ))}
              </div>
            </div>
            {nis2Feedback && <div className="col-12"><div className="alert alert-success mb-0">{nis2Feedback}</div></div>}
            <div className="col-12">
              <button className="btn btn-info text-dark fw-bold" onClick={guardarNIS2}>
                Guardar Avaliação NIS2
              </button>
            </div>
          </div>
        </div>
      )}

      {abaAtiva === 'incidentes' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card bg-dark border-secondary">
              <div className="card-header border-secondary d-flex justify-content-between align-items-center gap-3 flex-wrap">
                <span className="text-info fw-bold">Incidentes reportados</span>
                <button type="button" className="btn btn-sm btn-info text-dark fw-bold" onClick={exportarIncidentesPDF}>
                  Exportar PDF
                </button>
              </div>
              <div className="list-group list-group-flush">
                {incidentes.length === 0 ? (
                  <div className="p-3 text-muted">Este cliente ainda nao submeteu incidentes.</div>
                ) : incidentes.map(incidente => (
                  <button
                    key={incidente.id}
                    type="button"
                    className={`list-group-item list-group-item-action border-secondary text-start ${incidenteAtivo?.id === incidente.id ? 'bg-secondary text-white' : 'bg-dark text-white'}`}
                    onClick={() => setIncidenteAtivoId(incidente.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <span className="fw-semibold">{incidente.tipo}</span>
                      <span className={`badge ${estadoBadgeClass(incidente.estado)}`}>{incidente.estado}</span>
                    </div>
                    <small className="text-white-50">
                      {incidente.impacto} | {formatarData(incidente.dataOcorrencia)}
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card bg-dark border-secondary" style={{ minHeight: 520 }}>
              {incidenteAtivo ? (
                <>
                  <div className="card-header border-secondary">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <div className="text-info small fw-bold mb-1">Relatorio CNCS #{incidenteAtivo.id}</div>
                        <h5 className="mb-1">{incidenteAtivo.tipo}</h5>
                        <p className="text-muted small mb-0">
                          Impacto {incidenteAtivo.impacto} | Ocorrencia: {formatarData(incidenteAtivo.dataOcorrencia)}
                        </p>
                      </div>
                      <select
                        className="form-select form-select-sm bg-secondary text-white border-0"
                        style={{ maxWidth: 180 }}
                        value={incidenteAtivo.estado}
                        onChange={event => alterarEstadoIncidente(event.target.value)}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Analise">Em Analise</option>
                        <option value="Resolvido">Resolvido</option>
                      </select>
                    </div>
                  </div>

                  <div className="card-body" style={{ background: '#101522' }}>
                    <div className="mb-4">
                      <div className="text-info small fw-bold mb-2">Descricao do incidente</div>
                      <div className="p-3 rounded-3 bg-dark border border-secondary text-white">
                        {incidenteAtivo.descricao}
                      </div>
                    </div>

                    <div>
                      <div className="text-info small fw-bold mb-2">Acoes imediatas comunicadas</div>
                      <div className="p-3 rounded-3 bg-dark border border-secondary text-white">
                        {incidenteAtivo.acoesImediatas || 'Sem acoes imediatas comunicadas.'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center text-muted" style={{ minHeight: 500 }}>
                  Selecione um incidente para ver o relatorio completo.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {abaAtiva === 'pedidos' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card bg-dark border-secondary">
              <div className="card-header border-secondary text-info fw-bold">
                Pedidos deste Cliente
              </div>
              <div className="list-group list-group-flush">
                {pedidos.length === 0 ? (
                  <div className="p-3 text-muted">Este cliente ainda nao abriu pedidos.</div>
                ) : pedidos.map(pedido => (
                  <button
                    key={pedido.id}
                    type="button"
                    className={`list-group-item list-group-item-action border-secondary text-start ${pedidoAtivo?.id === pedido.id ? 'bg-secondary text-white' : 'bg-dark text-white'}`}
                    onClick={() => setPedidoAtivoId(pedido.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <span className="fw-semibold">{pedido.titulo}</span>
                      <span className={`badge ${estadoBadgeClass(pedido.estado)}`}>{pedido.estado}</span>
                    </div>
                    <small className="text-white-50">{pedido.mensagens?.length || 0} mensagens</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card bg-dark border-secondary mobile-chat-card">
              {pedidoAtivo ? (
                <>
                  <div className="card-header border-secondary">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h5 className="mb-1">{pedidoAtivo.titulo}</h5>
                        <p className="text-muted small mb-0">{pedidoAtivo.descricao}</p>
                      </div>
                      <select
                        className="form-select form-select-sm bg-secondary text-white border-0"
                        style={{ maxWidth: 180 }}
                        value={pedidoAtivo.estado}
                        onChange={event => alterarEstadoPedido(event.target.value)}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Análise">Em Análise</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>
                  </div>

                  <div className="card-body d-flex flex-column mobile-chat-messages" style={{ background: '#101522' }}>
                    {(pedidoAtivo.mensagens || []).map(msg => {
                      const equipa = msg.enviadoPor === 'Gestor' || msg.enviadoPor === 'Admin';
                      return (
                        <div key={msg.id} className={`d-flex mb-3 ${equipa ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div className={`p-3 rounded-3 mobile-chat-bubble ${equipa ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{ maxWidth: '72%' }}>
                            <div className="small fw-bold mb-1">{msg.enviadoPor}</div>
                            <div>{msg.texto}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={responderPedido} className="card-footer border-secondary d-flex gap-2 mobile-chat-footer">
                    <input
                      className="form-control bg-secondary text-white border-0"
                      placeholder="Responder ao cliente..."
                      value={mensagemPedido}
                      onChange={event => setMensagemPedido(event.target.value)}
                    />
                    <button type="submit" className="btn btn-info text-dark fw-bold">Enviar</button>
                  </form>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center text-muted" style={{ minHeight: 560 }}>
                  Selecione um pedido para responder ao cliente.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalhesCliente;
