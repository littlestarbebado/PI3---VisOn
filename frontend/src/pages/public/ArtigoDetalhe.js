import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { LoadingState } from '../../components/StatePanel';
import { brandText } from '../../utils/brand';

export default function ArtigoDetalhe() {
  const { slug } = useParams();
  const [artigo, setArtigo] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get(`/artigos/${slug}`).then(r => setArtigo(r.data)).catch(() => setErro('Artigo não encontrado.'));
  }, [slug]);

  return <><Navbar /><main className="section-white"><div className="container" style={{ maxWidth: 850 }}>
    <Link to="/artigos" className="btn btn-link px-0 mb-3">← Voltar aos artigos</Link>
    {erro ? <div className="alert alert-warning">{erro}</div> : !artigo ? <LoadingState compact label="A carregar artigo…" /> : <article>
      <h1 className="fw-bold">{brandText(artigo.titulo)}</h1>
      <p className="text-muted">{artigo.autor || 'Redação CyberBox'} · {artigo.dataPublicacao?.slice(0, 10)}</p>
      {artigo.imagem && <img src={artigo.imagem} alt={artigo.titulo} className="img-fluid rounded mb-4" />}
      <p className="lead">{brandText(artigo.resumo)}</p>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{brandText(artigo.conteudo)}</div>
    </article>}
  </div></main><Footer /></>;
}
