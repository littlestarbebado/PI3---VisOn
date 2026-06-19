import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

export default function ArtigoDetalhe() {
  const { slug } = useParams();
  const [artigo, setArtigo] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get(`/artigos/${slug}`).then(r => setArtigo(r.data)).catch(() => setErro('Artigo não encontrado.'));
  }, [slug]);

  return <><Navbar /><main className="section-white"><div className="container" style={{ maxWidth: 850 }}>
    <Link to="/artigos" className="btn btn-link px-0 mb-3">← Voltar aos artigos</Link>
    {erro ? <div className="alert alert-warning">{erro}</div> : !artigo ? <p>A carregar...</p> : <article>
      <h1 className="fw-bold">{artigo.titulo}</h1>
      <p className="text-muted">{artigo.autor || 'Redação VisOn'} · {artigo.dataPublicacao?.slice(0, 10)}</p>
      {artigo.imagem && <img src={artigo.imagem} alt={artigo.titulo} className="img-fluid rounded mb-4" />}
      <p className="lead">{artigo.resumo}</p>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{artigo.conteudo}</div>
    </article>}
  </div></main><Footer /></>;
}
