import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ArtigosAdmin() {

  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  // Estado do formulário de novo artigo
  const [form, setForm] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    autor: '',
    categoria: 'Regulamentação',
    publicado: false
  });

  const CATEGORIAS = ['Regulamentação', 'Segurança Ofensiva', 'Governança', 'Incidentes', 'Boas Práticas', 'Tecnologia'];

  // Carregar artigos da API
  function carregarArtigos() {
    setCarregando(true);
    api.get('/artigos/admin')
      .then(res => setArtigos(res.data))
      .catch(err => {
        console.error('Erro ao carregar artigos:', err);
        setMensagem({ tipo: 'erro', texto: 'Erro ao carregar artigos.' });
      })
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregarArtigos();
  }, []);

  // Atualizar campo do formulário
  function handleForm(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  // Criar novo artigo
  function criarArtigo() {
    if (!form.titulo || !form.conteudo) {
      setMensagem({ tipo: 'erro', texto: 'Título e conteúdo são obrigatórios.' });
      return;
    }

    setGuardando(true);
    setMensagem(null);

    api.post('/artigos', form)
      .then(() => {
        setMensagem({ tipo: 'sucesso', texto: 'Artigo criado com sucesso!' });
        setForm({ titulo: '', resumo: '', conteudo: '', autor: '', categoria: 'Regulamentação', publicado: false });
        setMostrarForm(false);
        carregarArtigos();
      })
      .catch(err => {
        console.error('Erro ao criar artigo:', err);
        setMensagem({ tipo: 'erro', texto: 'Erro ao criar artigo.' });
      })
      .finally(() => setGuardando(false));
  }

  // Apagar artigo
  function apagarArtigo(id) {
    if (!window.confirm('Tens a certeza que queres eliminar este artigo?')) return;

    api.delete(`/artigos/${id}`)
      .then(() => {
        setMensagem({ tipo: 'sucesso', texto: 'Artigo eliminado.' });
        carregarArtigos();
      })
      .catch(err => {
        console.error('Erro ao apagar artigo:', err);
        setMensagem({ tipo: 'erro', texto: 'Erro ao eliminar artigo.' });
      });
  }

  // Publicar / despublicar artigo
  function togglePublicado(artigo) {
    api.put(`/artigos/${artigo.id}`, { ...artigo, publicado: !artigo.publicado })
      .then(() => carregarArtigos())
      .catch(() => setMensagem({ tipo: 'erro', texto: 'Erro ao atualizar artigo.' }));
  }

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 style={{ fontWeight: 800, marginBottom: '0.3rem' }}>Artigos</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Gerir artigos técnicos do site público</p>
        </div>

        <button
          onClick={() => { setMostrarForm(!mostrarForm); setMensagem(null); }}
          className="btn"
          style={{ background: '#050b23', color: '#fff', borderRadius: '10px', fontWeight: 600 }}
        >
          <i className={`bi ${mostrarForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
          {mostrarForm ? 'Cancelar' : 'Novo Artigo'}
        </button>

      </div>

      {/* MENSAGEM FEEDBACK */}
      {mensagem && (
        <div
          className={`alert ${mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'} py-2 mb-3`}
          style={{ fontSize: '0.9rem', maxWidth: '900px' }}
        >
          {mensagem.texto}
        </div>
      )}

      {/* FORMULÁRIO NOVO ARTIGO */}
      {mostrarForm && (
        <div
          style={{
            background: '#fff',
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            maxWidth: '900px',
            marginBottom: '1.5rem'
          }}
        >
          <h5 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Novo Artigo</h5>

          <div className="row g-3">

            <div className="col-12">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Título *</label>
              <input
                name="titulo"
                type="text"
                className="form-control"
                value={form.titulo}
                onChange={handleForm}
              />
            </div>

            <div className="col-md-6">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Autor</label>
              <input
                name="autor"
                type="text"
                className="form-control"
                value={form.autor}
                onChange={handleForm}
              />
            </div>

            <div className="col-md-6">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Categoria</label>
              <select
                name="categoria"
                className="form-control"
                value={form.categoria}
                onChange={handleForm}
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Resumo</label>
              <textarea
                name="resumo"
                className="form-control"
                rows={2}
                value={form.resumo}
                onChange={handleForm}
              />
            </div>

            <div className="col-12">
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Conteúdo *</label>
              <textarea
                name="conteudo"
                className="form-control"
                rows={5}
                value={form.conteudo}
                onChange={handleForm}
              />
            </div>

            <div className="col-12 d-flex align-items-center gap-2">
              <input
                type="checkbox"
                name="publicado"
                id="publicado"
                checked={form.publicado}
                onChange={handleForm}
              />
              <label htmlFor="publicado" style={{ fontWeight: 600, margin: 0 }}>
                Publicar imediatamente
              </label>
            </div>

            <div className="col-12">
              <button
                onClick={criarArtigo}
                disabled={guardando}
                className="btn"
                style={{ background: '#050b23', color: '#fff', borderRadius: '10px', fontWeight: 600, padding: '0.65rem 1.3rem' }}
              >
                {guardando ? 'A guardar...' : 'Criar Artigo'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LISTA DE ARTIGOS */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '1rem',
          maxWidth: '900px'
        }}
      >

        {carregando && (
          <p style={{ color: '#6b7280', padding: '0.5rem' }}>A carregar artigos...</p>
        )}

        {!carregando && artigos.length === 0 && (
          <p style={{ color: '#6b7280', padding: '0.5rem' }}>Nenhum artigo encontrado.</p>
        )}

        {/* key usa o id real da base de dados */}
        {artigos.map(artigo => (
          <div
            key={artigo.id}
            style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >

            <div className="d-flex justify-content-between mb-2">

              <div className="d-flex align-items-center gap-2">
                <h5 style={{ fontWeight: 700, margin: 0, fontSize: '0.97rem' }}>
                  {artigo.titulo}
                </h5>
                <span
                  style={{
                    background: artigo.publicado ? '#d1fae5' : '#fef3c7',
                    color: artigo.publicado ? '#065f46' : '#92400e',
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                    fontWeight: 600
                  }}
                >
                  {artigo.publicado ? 'Publicado' : 'Rascunho'}
                </span>
              </div>

              <div className="d-flex gap-2">

                {/* Publicar / Despublicar */}
                <button
                  onClick={() => togglePublicado(artigo)}
                  title={artigo.publicado ? 'Despublicar' : 'Publicar'}
                  style={{ border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer' }}
                >
                  <i className={`bi ${artigo.publicado ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>

                {/* Apagar */}
                <button
                  onClick={() => apagarArtigo(artigo.id)}
                  style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                >
                  <i className="bi bi-trash"></i>
                </button>

              </div>

            </div>

            <p style={{ color: '#6b7280', fontSize: '0.87rem', margin: '0 0 0.5rem' }}>
              {artigo.resumo}
            </p>

            <div className="d-flex gap-3 align-items-center">

              <small style={{ color: '#9ca3af' }}>
                <i className="bi bi-person me-1"></i>{artigo.autor || 'Redação'}
              </small>

              <small style={{ color: '#9ca3af' }}>
                <i className="bi bi-calendar3 me-1"></i>
                {artigo.dataPublicacao ? artigo.dataPublicacao.slice(0, 10) : artigo.createdAt?.slice(0, 10)}
              </small>

              {artigo.categoria && (
                <span
                  style={{
                    background: '#dbeafe',
                    color: '#2563eb',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  {artigo.categoria}
                </span>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}