import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import socket from '../../services/socket';

const estados = {
  Pendente: 'bg-danger',
  'Em Análise': 'bg-primary',
  Concluído: 'bg-success'
};

function EstadoBadge({ estado }) {
  return <span className={`badge ${estados[estado] || 'bg-secondary'}`}>{estado}</span>;
}

export default function PedidosChat() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoAtivoId, setPedidoAtivoId] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const pedidoAtivo = useMemo(
    () => pedidos.find(pedido => pedido.id === pedidoAtivoId) || pedidos[0],
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
      .then(res => {
        setPedidos(res.data || []);
        setErro('');
      })
      .catch(() => setErro('Nao foi possivel carregar os pedidos.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  useEffect(() => {
    if (!pedidoAtivoId && pedidos.length > 0) setPedidoAtivoId(pedidos[0].id);
  }, [pedidoAtivoId, pedidos]);

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

  const abrirPedido = async (event) => {
    event.preventDefault();
    setErro('');

    if (!titulo.trim() || !descricao.trim()) {
      setErro('Preencha o titulo e a descricao do pedido.');
      return;
    }

    try {
      const { data } = await api.post('/pedidos', { titulo, descricao });
      setPedidos(prev => [data, ...prev]);
      setPedidoAtivoId(data.id);
      setTitulo('');
      setDescricao('');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao abrir pedido.');
    }
  };

  const enviarMensagem = async (event) => {
    event.preventDefault();
    if (!pedidoAtivo || !mensagem.trim()) return;

    try {
      const { data } = await api.post(`/pedidos/${pedidoAtivo.id}/mensagens`, { texto: mensagem });
      adicionarMensagemPedido(pedidoAtivo.id, data);
      setMensagem('');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao enviar mensagem.');
    }
  };

  return (
    <div className="min-vh-100 p-4 text-white" style={{ background: '#080b12' }}>
      <div className="d-flex gap-2 mb-4">
        <Link to="/cliente" className="btn btn-outline-light btn-sm">Dashboard</Link>
        <Link to="/cliente/submissoes" className="btn btn-outline-light btn-sm">Submissões</Link>
      </div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold mb-1">Pedidos de Esclarecimento</h2>
          <p className="text-secondary mb-0">Abra pedidos e acompanhe as respostas do gestor.</p>
        </div>
      </div>

      {erro && <div className="alert alert-danger py-2">{erro}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <form onSubmit={abrirPedido} className="card bg-dark border-secondary mb-4">
            <div className="card-header border-secondary fw-bold text-info">Abrir Novo Pedido</div>
            <div className="card-body">
              <input
                className="form-control bg-secondary text-white border-0 mb-3"
                placeholder="Titulo"
                value={titulo}
                onChange={event => setTitulo(event.target.value)}
              />
              <textarea
                className="form-control bg-secondary text-white border-0 mb-3"
                rows="4"
                placeholder="Descreva o esclarecimento necessario"
                value={descricao}
                onChange={event => setDescricao(event.target.value)}
              />
              <button className="btn btn-info text-dark fw-bold w-100" type="submit">
                Abrir Pedido
              </button>
            </div>
          </form>

          <div className="card bg-dark border-secondary">
            <div className="card-header border-secondary fw-bold">Os Meus Pedidos</div>
            <div className="list-group list-group-flush">
              {loading ? (
                <div className="p-3 text-secondary">A carregar pedidos...</div>
              ) : pedidos.length === 0 ? (
                <div className="p-3 text-secondary">Ainda nao existem pedidos.</div>
              ) : pedidos.map(pedido => (
                <button
                  key={pedido.id}
                  type="button"
                  className={`list-group-item list-group-item-action border-secondary text-start ${pedidoAtivo?.id === pedido.id ? 'bg-secondary text-white' : 'bg-dark text-white'}`}
                  onClick={() => setPedidoAtivoId(pedido.id)}
                >
                  <div className="d-flex justify-content-between gap-2 align-items-center">
                    <span className="fw-semibold">{pedido.titulo}</span>
                    <EstadoBadge estado={pedido.estado} />
                  </div>
                  <small className="text-white-50">{pedido.mensagens?.length || 0} mensagens</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card bg-dark border-secondary h-100" style={{ minHeight: 620 }}>
            {pedidoAtivo ? (
              <>
                <div className="card-header border-secondary d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{pedidoAtivo.titulo}</h5>
                    <small className="text-secondary">{pedidoAtivo.descricao}</small>
                  </div>
                  <EstadoBadge estado={pedidoAtivo.estado} />
                </div>
                <div className="card-body d-flex flex-column" style={{ height: 500, overflowY: 'auto', background: '#101522' }}>
                  {(pedidoAtivo.mensagens || []).map(msg => {
                    const minha = msg.enviadoPor === 'Cliente';
                    return (
                      <div key={msg.id} className={`d-flex mb-3 ${minha ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`p-3 rounded-3 ${minha ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{ maxWidth: '72%' }}>
                          <div className="small fw-bold mb-1">{msg.enviadoPor}</div>
                          <div>{msg.texto}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={enviarMensagem} className="card-footer border-secondary d-flex gap-2">
                  <input
                    className="form-control bg-secondary text-white border-0"
                    placeholder="Escrever mensagem..."
                    value={mensagem}
                    onChange={event => setMensagem(event.target.value)}
                  />
                  <button className="btn btn-info text-dark fw-bold" type="submit">Enviar</button>
                </form>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-secondary">
                Selecione ou abra um pedido para iniciar o chat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
