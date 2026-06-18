import React, { useState } from 'react';
import api from '../../services/api';

export default function CarregarDocumentoModal({ show, onClose, clientes, onUploaded }) {
  const [ficheiro, setFicheiro] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);

  if (!show) return null;

  const carregar = async () => {
    if (!ficheiro || !clienteId) {
      setErro('Selecione um ficheiro e um cliente.');
      return;
    }

    const dados = new FormData();
    dados.append('ficheiro', ficheiro);
    dados.append('nome', nome);
    dados.append('descricao', descricao);
    dados.append('ClienteId', clienteId);

    setAEnviar(true);
    setErro('');
    try {
      await api.post('/documentos', dados, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFicheiro(null);
      setNome('');
      setDescricao('');
      setClienteId('');
      onUploaded();
      onClose();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao carregar documento.');
    } finally {
      setAEnviar(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ width: 520, background: '#fff', borderRadius: 14, padding: 20, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: 16, top: 12, border: 0, background: 'transparent', fontSize: 22 }}>×</button>
        <h3 className="fw-bold mb-3">Carregar Novo Documento</h3>
        {erro && <div className="alert alert-danger py-2">{erro}</div>}
        <input type="file" className="form-control mb-3" onChange={e => setFicheiro(e.target.files?.[0] || null)} />
        <input type="text" className="form-control mb-3" placeholder="Nome do documento" value={nome} onChange={e => setNome(e.target.value)} />
        <textarea className="form-control mb-3" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <select className="form-select mb-3" value={clienteId} onChange={e => setClienteId(e.target.value)}>
          <option value="">Selecione o cliente</option>
          {clientes.map(cliente => <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>)}
        </select>
        <button onClick={carregar} disabled={aEnviar} className="btn btn-dark w-100">
          {aEnviar ? 'A carregar...' : 'Carregar'}
        </button>
      </div>
    </div>
  );
}
