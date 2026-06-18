import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    axios.get(`http://localhost:3000/api/documents/list?search=${search}`)
      .then(res => {
        if (res.data.success) setDocuments(res.data.documents);
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
    formData.append('title', title);
    formData.append('tag', tag);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    // Se preencheres o ID do Cliente, usa a rota: /clientes/:id/documentos
    const url = clienteId.trim() 
      ? `http://localhost:3000/api/documents/clientes/${clienteId}/documentos`
      : 'http://localhost:3000/api/documents/upload';

    axios.post(url, formData)
      .then(res => {
        alert(res.data.message);
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
      axios.delete(`http://localhost:3000/api/documents/delete/${id}`)
        .then(res => {
          alert(res.data.message);
          fetchDocuments(); 
        })
        .catch(err => alert("Erro ao eliminar o documento"));
    }
  };

  // Download real de documentos
  const handleDownload = (doc) => {
    window.open(`http://localhost:3000/uploads/${doc.title}`, '_blank');
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
                    {doc.title} 
                    <span className="badge bg-secondary ms-2">{doc.tag}</span>
                    {doc.clienteId && <span className="badge bg-info text-dark ms-2">Cliente ID: {doc.clienteId}</span>}
                  </h6>
                  <small className="text-muted">{doc.type} • {doc.size} • Enviado por: {doc.uploadedBy} em {doc.date}</small>
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