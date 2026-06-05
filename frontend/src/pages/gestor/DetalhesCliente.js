import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
  const [ficheiro, setFicheiro] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErro, setUploadErro] = useState(null);
  const [uploadSucesso, setUploadSucesso] = useState(false);

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

  useEffect(() => {
    carregarDetalhes();
    carregarPedidos();
    carregarIncidentes();
  }, [carregarDetalhes, carregarPedidos, carregarIncidentes]);

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

      {abaAtiva === 'incidentes' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card bg-dark border-secondary">
              <div className="card-header border-secondary text-info fw-bold">
                Incidentes reportados
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
            <div className="card bg-dark border-secondary" style={{ minHeight: 620 }}>
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

                  <div className="card-body d-flex flex-column" style={{ height: 500, overflowY: 'auto', background: '#101522' }}>
                    {(pedidoAtivo.mensagens || []).map(msg => {
                      const equipa = msg.enviadoPor === 'Gestor' || msg.enviadoPor === 'Admin';
                      return (
                        <div key={msg.id} className={`d-flex mb-3 ${equipa ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div className={`p-3 rounded-3 ${equipa ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{ maxWidth: '72%' }}>
                            <div className="small fw-bold mb-1">{msg.enviadoPor}</div>
                            <div>{msg.texto}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={responderPedido} className="card-footer border-secondary d-flex gap-2">
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
