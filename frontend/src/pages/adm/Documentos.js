import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import CarregarDocumentoModal from './CarregarDocumentoModal';

export default function Documentos() {
  const [showModal, setShowModal] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      const [docs, listaClientes] = await Promise.all([
        api.get('/documentos'),
        api.get('/clientes')
      ]);
      setDocumentos(docs.data || []);
      setClientes(listaClientes.data || []);
      setErro('');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível carregar os documentos.');
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const eliminar = async (id) => {
    if (!window.confirm('Eliminar este documento?')) return;
    try {
      await api.delete(`/documentos/${id}`);
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao eliminar documento.');
    }
  };

  return (
    <div>
      <CarregarDocumentoModal show={showModal} onClose={() => setShowModal(false)} clientes={clientes} onUploaded={carregar} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="fw-bold mb-1">Gestão de Documentos</h2><p className="text-muted mb-0">Carregar e gerir documentos de clientes</p></div>
        <button onClick={() => setShowModal(true)} className="btn btn-dark"><i className="bi bi-upload me-2" />Carregar Documento</button>
      </div>
      {erro && <div className="alert alert-danger">{erro}</div>}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white fw-bold">Documentos ({documentos.length})</div>
        <div className="list-group list-group-flush">
          {documentos.length === 0 ? <div className="p-4 text-muted">Nenhum documento encontrado.</div> : documentos.map(doc => (
            <div key={doc.id} className="list-group-item d-flex justify-content-between align-items-center gap-3">
              <div><div className="fw-bold">{doc.nome}</div><small className="text-muted">{doc.cliente?.nome || 'Sem cliente'} · {doc.tipo || 'Ficheiro'} · {new Date(doc.createdAt).toLocaleDateString('pt-PT')}</small></div>
              <div className="d-flex gap-2">
                {doc.caminho && <a className="btn btn-sm btn-outline-primary" href={`http://localhost:5000${doc.caminho}`} target="_blank" rel="noreferrer">Descarregar</a>}
                <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(doc.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
