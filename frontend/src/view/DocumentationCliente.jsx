import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export default function Documentos() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  
  // Estados para o formulário de novos uploads
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Geral');
  const [clienteId, setClienteId] = useState(''); 
  const [selectedFile, setSelectedFile] = useState(null);

  // Função para ir buscar a lista de documentos à Base de Dados
  const fetchDocuments = () => {
    api.get('/documentos')
      .then(res => {
        const termo = search.trim().toLowerCase();
        setDocuments((res.data || []).filter(doc => !termo || doc.nome.toLowerCase().includes(termo)));
      })
      .catch(err => console.error("Erro ao carregar documentos:", err));
  };

  useEffect(() => {
    fetchDocuments();
  }, [search]);

  // Enviar ficheiro (Geral ou direcionado a um Cliente específico)
  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nome', title);
    formData.append('descricao', tag);
    formData.append('ClienteId', clienteId);
    if (selectedFile) {
      formData.append('ficheiro', selectedFile);
    }

    // Se preencheres o ID do Cliente, usa a rota: /clientes/:id/documentos
    api.post('/documentos', formData)
      .then(res => {
        alert('Documento carregado com sucesso.');
        setTitle('');
        setClienteId('');
        setSelectedFile(null);
        fetchDocuments(); 
      })
      .catch(err => alert("Erro ao fazer upload do documento"));
  };

  // Remoção de documentos
  const handleDelete = (id) => {
    if (window.confirm("Tem a certeza que deseja eliminar este documento?")) {
      api.delete(`/documentos/${id}`)
        .then(res => {
          alert(res.data.message);
          fetchDocuments(); 
        })
        .catch(err => alert("Erro ao eliminar o documento"));
    }
  };

  // Download real de documentos
  const handleDownload = (doc) => {
    window.open(`${BACKEND_URL}${doc.caminho}`, '_blank');
  };

  return (
    <div className="container py-4">
      
      {/* CABEÇALHO DO TEU MÓDULO */}
      <div className="mb-4 p-4 bg-dark text-white rounded shadow-sm">
        <h2 className="fw-bold m-0">📂 Gestão de Documentos</h2>
        <p className="text-muted small mb-0">Área de Trabalho — Gabriel</p>
      </div>

      {/* FORMULÁRIO DE UPLOAD */}
      <div className="card p-4 border-0 shadow-sm mb-4 bg-white">
        <h5 className="fw-bold mb-3 h6 text-primary">➕ Carregar Novo Documento (Global ou Gestor para Cliente)</h5>
        <form onSubmit={handleUpload}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold">Título do Documento</label>
              <input type="text" className="form-control" placeholder="Ex: Relatório de Auditoria" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">ID do Cliente (Opcional)</label>
              <input type="text" className="form-control" placeholder="Vazio = Documento Global" value={clienteId} onChange={(e) => setClienteId(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold">Categoria (Tag)</label>
              <select className="form-select" value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="Geral">Geral</option>
                <option value="Relatório">Relatório</option>
                <option value="Contrato">Contrato</option>
                <option value="Auditoria">Auditoria</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold">Ficheiro</label>
              <input type="file" className="form-control" onChange={(e) => setSelectedFile(e.target.files[0])} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm mt-3 fw-bold px-4">Fazer Upload</button>
        </form>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="mb-3">
        <input type="text" className="form-control shadow-sm" placeholder="🔍 Pesquisar documentos..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* LISTAGEM DE DOCUMENTOS */}
      <div className="card p-4 border-0 shadow-sm bg-white">
        <h5 className="fw-bold mb-3 h6 text-secondary">Documentos no Sistema</h5>
        
        {documents.length === 0 ? (
          <p className="text-muted small my-3">Nenhum documento encontrado.</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {documents.map((doc) => (
              <div key={doc.id} className="p-3 border rounded bg-light d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="m-0 fw-bold text-dark">
                    {doc.nome}
                    <span className="badge bg-secondary ms-2">{doc.tipo || 'Documento'}</span>
                    {doc.ClienteId && <span className="badge bg-info text-dark ms-2">Cliente ID: {doc.ClienteId}</span>}
                  </h6>
                  <small className="text-muted">{doc.descricao || 'Sem descrição'} · {new Date(doc.createdAt).toLocaleDateString('pt-PT')}</small>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-success" onClick={() => handleDownload(doc)}>📥 Download</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(doc.id)}>🗑️ Apagar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
