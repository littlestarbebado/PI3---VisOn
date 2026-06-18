import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const vazio = { titulo: '', resumo: '', conteudo: '', autor: '', categoria: 'Geral', imagem: '', publicado: true };

export default function ArtigosAdmin() {
  const [artigos, setArtigos] = useState([]);
  const [form, setForm] = useState(vazio);
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState('');

  const carregar = () => api.get('/artigos/admin').then(r => setArtigos(r.data || [])).catch(e => setErro(e.response?.data?.erro || 'Erro ao carregar artigos.'));
  useEffect(() => {
    let ativo = true;

    const carregarInicial = async () => {
      try {
        const { data } = await api.get('/artigos/admin');
        if (!ativo) return;
        setArtigos(data || []);
      } catch (error) {
        if (!ativo) return;
        setErro(error.response?.data?.erro || 'Erro ao carregar artigos.');
      }
    };

    carregarInicial();

    return () => {
      ativo = false;
    };
  }, []);

  const guardar = async () => {
    if (!form.titulo.trim() || !form.conteudo.trim()) { setErro('Título e conteúdo são obrigatórios.'); return; }
    try {
      if (editId) await api.put(`/artigos/${editId}`, form);
      else await api.post('/artigos', form);
      setForm(vazio); setEditId(null); setErro(''); carregar();
    } catch (e) { setErro(e.response?.data?.erro || 'Erro ao guardar artigo.'); }
  };

  const editar = artigo => { setEditId(artigo.id); setForm({ ...vazio, ...artigo }); };
  const eliminar = async id => { if (!window.confirm('Eliminar este artigo?')) return; await api.delete(`/artigos/${id}`); carregar(); };

  return <div>
    <h3 className="fw-bold mb-3">Artigos</h3>
    {erro && <div className="alert alert-danger">{erro}</div>}
    <div className="card p-3 mb-4">
      <input className="form-control mb-2" placeholder="Título" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
      <input className="form-control mb-2" placeholder="Resumo" value={form.resumo || ''} onChange={e => setForm({ ...form, resumo: e.target.value })} />
      <textarea className="form-control mb-2" rows="5" placeholder="Conteúdo" value={form.conteudo} onChange={e => setForm({ ...form, conteudo: e.target.value })} />
      <div className="row g-2 mb-2"><div className="col"><input className="form-control" placeholder="Autor" value={form.autor || ''} onChange={e => setForm({ ...form, autor: e.target.value })} /></div><div className="col"><input className="form-control" placeholder="Categoria" value={form.categoria || ''} onChange={e => setForm({ ...form, categoria: e.target.value })} /></div></div>
      <input className="form-control mb-2" placeholder="URL da imagem" value={form.imagem || ''} onChange={e => setForm({ ...form, imagem: e.target.value })} />
      <label className="form-check mb-3"><input type="checkbox" className="form-check-input" checked={form.publicado} onChange={e => setForm({ ...form, publicado: e.target.checked })} /> Publicado</label>
      <div><button className="btn btn-dark me-2" onClick={guardar}>{editId ? 'Guardar Alterações' : 'Criar Artigo'}</button>{editId && <button className="btn btn-light" onClick={() => { setEditId(null); setForm(vazio); }}>Cancelar</button>}</div>
    </div>
    {artigos.map(artigo => <div key={artigo.id} className="card p-3 mb-2"><div className="d-flex justify-content-between"><div><strong>{artigo.titulo}</strong><div className="text-muted small">{artigo.autor || 'Sem autor'} · {artigo.publicado ? 'Publicado' : 'Rascunho'}</div></div><div><button className="btn btn-sm btn-outline-primary me-2" onClick={() => editar(artigo)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(artigo.id)}>Eliminar</button></div></div></div>)}
  </div>;
}
