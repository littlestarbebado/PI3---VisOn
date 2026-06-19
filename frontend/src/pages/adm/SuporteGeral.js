import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import socket from '../../services/socket';

const ESTADOS_API = ['Pendente', 'Em Análise', 'Concluído'];

const estadoLabels = {
  Pendente: 'Pendente',
  'Em Análise': 'Em Analise',
  'Concluído': 'Concluido'
};

const estadoStyles = {
  Pendente: { background: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  'Em Análise': { background: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
  'Concluído': { background: '#dcfce7', color: '#166534', border: '#bbf7d0' }
};

function formatarData(valor) {
  if (!valor) return 'Sem data';

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(valor));
}

function EstadoBadge({ estado }) {
  const style = estadoStyles[estado] || {
    background: '#e5e7eb',
    color: '#374151',
    border: '#d1d5db'
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        border: `1px solid ${style.border}`,
        background: style.background,
        color: style.color,
        fontSize: '0.78rem',
        fontWeight: 700,
        padding: '0.25rem 0.65rem',
        whiteSpace: 'nowrap'
      }}
    >
      {estadoLabels[estado] || estado}
    </span>
  );
}

export default function SuporteGeral() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoAtivoId, setPedidoAtivoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const pedidoAtivo = useMemo(
    () => pedidos.find(pedido => pedido.id === pedidoAtivoId) || null,
    [pedidos, pedidoAtivoId]
  );

  const adicionarMensagemPedido = useCallback((pedidoId, novaMensagem) => {
    setPedidos(prev => prev.map(pedido => {
      if (Number(pedido.id) !== Number(pedidoId)) return pedido;

      const mensagens = pedido.mensagens || [];
      const jaExiste = mensagens.some(msg => Number(msg.id) === Number(novaMensagem.id));
      if (jaExiste) return pedido;

      return {
        ...pedido,
        updatedAt: novaMensagem.updatedAt || new Date().toISOString(),
        mensagens: [...mensagens, novaMensagem]
      };
    }));
  }, []);

  const carregarPedidos = () => {
    setLoading(true);
    api.get('/pedidos')
      .then(response => {
        const lista = response.data || [];
        setPedidos(lista);
        setPedidoAtivoId(prev => (
          lista.some(pedido => pedido.id === prev) ? prev : lista[0]?.id || null
        ));
        setErro('');
      })
      .catch(error => {
        setErro(error.response?.data?.erro || 'Nao foi possivel carregar os pedidos de suporte.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  useEffect(() => {
    if (!pedidoAtivo?.id) return undefined;

    socket.emit('join_pedido', pedidoAtivo.id);

    const receberMensagem = (novaMensagem) => {
      adicionarMensagemPedido(novaMensagem.PedidoId || pedidoAtivo.id, novaMensagem);
    };

    socket.on('receber_mensagem', receberMensagem);

    return () => {
      socket.off('receber_mensagem', receberMensagem);
      socket.emit('leave_pedido', pedidoAtivo.id);
    };
  }, [adicionarMensagemPedido, pedidoAtivo?.id]);

  const selecionarPedido = (pedido) => {
    setPedidoAtivoId(pedido.id);
    setErro('');
  };

  const alterarEstado = (estado) => {
    if (!pedidoAtivo) return;

    api.put(`/pedidos/${pedidoAtivo.id}/estado`, { estado })
      .then(response => {
        setPedidos(prev => prev.map(pedido => (
          pedido.id === pedidoAtivo.id
            ? { ...pedido, estado: response.data.estado }
            : pedido
        )));
        setErro('');
      })
      .catch(error => {
        setErro(error.response?.data?.erro || 'Nao foi possivel alterar o estado do pedido.');
      });
  };

  const enviarMensagem = (event) => {
    event.preventDefault();
    if (!pedidoAtivo || !mensagem.trim() || enviando) return;

    setEnviando(true);
    api.post(`/pedidos/${pedidoAtivo.id}/mensagens`, {
      texto: mensagem,
      enviadoPor: 'Admin'
    })
      .then(response => {
        adicionarMensagemPedido(pedidoAtivo.id, response.data);
        setMensagem('');
        setErro('');
      })
      .catch(error => {
        setErro(error.response?.data?.erro || 'Nao foi possivel enviar a mensagem.');
      })
      .finally(() => setEnviando(false));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 style={{ fontWeight: 800, marginBottom: '0.35rem', color: '#111827' }}>
            Pedidos de Suporte
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Acompanhar pedidos abertos pelos clientes e responder diretamente no chat.
          </p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={carregarPedidos}
          style={{
            background: '#050b23',
            color: '#fff',
            borderRadius: 8,
            padding: '0.6rem 1rem',
            fontWeight: 700
          }}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Atualizar
        </button>
      </div>

      {erro && <div className="alert alert-danger py-2">{erro}</div>}

      <div className="row g-4">
        <div className="col-xl-7">
          <div
            style={{
              background: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)'
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="admin-table-dark-head" style={{ background: '#050b23', color: '#fff' }}>
                  <tr>
                    <th className="ps-4 py-3">ID</th>
                    <th>Cliente</th>
                    <th>Titulo</th>
                    <th>Estado</th>
                    <th className="pe-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        A carregar pedidos...
                      </td>
                    </tr>
                  ) : pedidos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        Ainda nao existem pedidos de suporte.
                      </td>
                    </tr>
                  ) : pedidos.map(pedido => (
                    <tr
                      key={pedido.id}
                      onClick={() => selecionarPedido(pedido)}
                      style={{
                        cursor: 'pointer',
                        background: pedidoAtivo?.id === pedido.id ? '#eff6ff' : '#fff'
                      }}
                    >
                      <td className="ps-4 fw-bold text-dark">#{pedido.id}</td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {pedido.cliente?.nome || 'Cliente sem nome'}
                        </div>
                        <small className="text-muted">{pedido.cliente?.email || 'Sem email'}</small>
                      </td>
                      <td className="fw-semibold text-dark">{pedido.titulo}</td>
                      <td><EstadoBadge estado={pedido.estado} /></td>
                      <td className="pe-4 text-muted">{formatarData(pedido.updatedAt || pedido.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div
            style={{
              minHeight: 680,
              background: '#0f172a',
              color: '#fff',
              borderRadius: 8,
              border: '1px solid #1f2937',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)'
            }}
          >
            {pedidoAtivo ? (
              <>
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid #243044',
                    background: '#111827'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <div className="text-info small fw-bold mb-1">
                        Pedido #{pedidoAtivo.id} - {pedidoAtivo.cliente?.nome || 'Cliente'}
                      </div>
                      <h5 className="mb-1 fw-bold">{pedidoAtivo.titulo}</h5>
                      <p className="text-white-50 small mb-0">{pedidoAtivo.descricao}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={() => setPedidoAtivoId(null)}
                      title="Fechar chat"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>

                  <select
                    className="form-select form-select-sm bg-dark text-white border-secondary"
                    value={pedidoAtivo.estado}
                    onChange={event => alterarEstado(event.target.value)}
                  >
                    {ESTADOS_API.map(estado => (
                      <option key={estado} value={estado}>{estadoLabels[estado]}</option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.25rem',
                    background: '#0b1120'
                  }}
                >
                  {(pedidoAtivo.mensagens || []).length === 0 ? (
                    <div className="text-center text-white-50 mt-5">
                      Este pedido ainda nao tem mensagens.
                    </div>
                  ) : (pedidoAtivo.mensagens || []).map(msg => {
                    const equipa = msg.enviadoPor === 'Admin' || msg.enviadoPor === 'Gestor';

                    return (
                      <div
                        key={msg.id}
                        className={`d-flex mb-3 ${equipa ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div
                          style={{
                            maxWidth: '78%',
                            borderRadius: 8,
                            padding: '0.85rem 1rem',
                            background: equipa ? '#2563eb' : '#e5e7eb',
                            color: equipa ? '#fff' : '#111827',
                            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)'
                          }}
                        >
                          <div className="small fw-bold mb-1">
                            {equipa ? msg.enviadoPor : 'Cliente'}
                          </div>
                          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.texto}</div>
                          <div
                            className="small mt-2"
                            style={{ color: equipa ? '#bfdbfe' : '#6b7280' }}
                          >
                            {formatarData(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={enviarMensagem}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderTop: '1px solid #243044',
                    background: '#111827'
                  }}
                >
                  <input
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Responder ao cliente..."
                    value={mensagem}
                    onChange={event => setMensagem(event.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-info text-dark fw-bold"
                    disabled={enviando || !mensagem.trim()}
                  >
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-white-50 p-4 text-center">
                Selecione um pedido da lista para abrir o chat lateral.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
