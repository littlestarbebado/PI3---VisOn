import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import CarregarDocumentoModal from './CarregarDocumentoModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export default function Documentos() {
  const [showModal, setShowModal] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [docs, listaClientes] = await Promise.all([
        api.get('/documentos'),
        api.get('/clientes')
      ]);
      setDocumentos(docs.data || []);
      setClientes(listaClientes.data || []);
      setErro('');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Nao foi possivel carregar os documentos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const eliminar = async (id) => {
    if (!window.confirm('Eliminar este documento?')) return;

    setEliminandoId(id);
    setErro('');
    setSucesso('');

    try {
      await api.delete(`/documentos/${id}`);
      setDocumentos(lista => lista.filter(doc => doc.id !== id));
      setSucesso('Documento eliminado com sucesso.');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao eliminar documento.');
    } finally {
      setEliminandoId(null);
    }
  };

  const handleUploaded = async () => {
    setSucesso('Documento carregado com sucesso.');
    await carregar();
  };

  return (
    <div>
      <CarregarDocumentoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        clientes={clientes}
        onUploaded={handleUploaded}
      />

      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4">
        <div>
          <h2 className="fw-bold mb-1">Gestao de Documentos</h2>
          <p className="text-muted mb-0">Carregar e gerir documentos de clientes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-dark">
          <i className="bi bi-upload me-2" />Carregar Documento
        </button>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white fw-bold">Documentos ({documentos.length})</div>
        <div className="list-group list-group-flush">
          {carregando ? (
            <div className="p-4 text-muted">A carregar documentos...</div>
          ) : documentos.length === 0 ? (
            <div className="p-4 text-muted">Nenhum documento encontrado.</div>
          ) : documentos.map(doc => (
            <div key={doc.id} className="list-group-item d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <div style={{ minWidth: 0 }}>
                <div className="fw-bold">{doc.nome}</div>
                <small className="text-muted">
                  {doc.cliente?.nome || 'Sem cliente'} - {doc.tipo || 'Ficheiro'} - {doc.estado || 'Sem estado'} - {new Date(doc.createdAt).toLocaleDateString('pt-PT')}
                </small>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {doc.caminho && (
                  <a className="btn btn-sm btn-outline-primary" href={`${BACKEND_URL}${doc.caminho}`} target="_blank" rel="noreferrer">
                    Descarregar
                  </a>
                )}
                <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(doc.id)} disabled={eliminandoId === doc.id}>
                  {eliminandoId === doc.id ? 'A eliminar...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
