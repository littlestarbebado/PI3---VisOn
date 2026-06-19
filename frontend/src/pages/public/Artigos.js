import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { EmptyState } from '../../components/StatePanel';
import { brandText } from '../../utils/brand';

const CATEGORIAS = ['Regulamentação', 'Segurança Ofensiva', 'Governança', 'Incidentes', 'Boas Práticas', 'Tecnologia'];

const TAG_MAP = {
  'Regulamentação': 'tag-regulamentacao',
  'Segurança Ofensiva': 'tag-seguranca',
  'Governança': 'tag-governanca',
};

function tagClass(cat) { return TAG_MAP[cat] || 'tag-default'; }

export default function Artigos() {
  const [artigos, setArtigos] = useState([]);
  const [catAtiva, setCatAtiva] = useState('');
  const [email, setEmail] = useState('');
  const [subOk, setSubOk] = useState(false);
  const [subErro, setSubErro] = useState('');

  useEffect(() => {
    api.get('/artigos').then(r => setArtigos(r.data || [])).catch(() => setArtigos([]));
  }, []);

  const filtrados = catAtiva ? artigos.filter(a => a.categoria === catAtiva) : artigos;
  const [destaque, ...resto] = filtrados;

  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="container">
          <h1>Notícias e Artigos</h1>
          <p>Mantenha-se atualizado sobre as últimas tendências e desenvolvimentos em cibersegurança</p>
        </div>
      </section>

      <section className="section-white">
        <div className="container">

          {/* DESTAQUE */}
          {destaque && (
            <div className="artigo-destaque mb-5">
              <img src={destaque.imagem || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'} alt={destaque.titulo} style={{ width: '45%', objectFit: 'cover' }} />
              <div className="artigo-destaque-body">
                <div className="d-flex align-items-center gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                    <i className="bi bi-calendar3 me-1" />{destaque.dataPublicacao?.slice(0, 10)}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                    <i className="bi bi-person me-1" />{destaque.autor || 'Redação CyberBox'}
                  </span>
                  {destaque.categoria && (
                    <span className={`artigo-tag ${tagClass(destaque.categoria)}`}>{destaque.categoria}</span>
                  )}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: '#0d1117', marginBottom: '0.75rem' }}>{brandText(destaque.titulo)}</h2>
                <p style={{ color: '#64748b', marginBottom: '1.2rem', fontSize: '0.92rem' }}>{brandText(destaque.resumo)}</p>
                <Link to={`/artigos/${destaque.slug}`} className="btn-vison-dark" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>Ler Artigo Completo</Link>
              </div>
            </div>
          )}

          {/* ÚLTIMAS PUBLICAÇÕES */}
          {resto.length > 0 && (
            <>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0d1117', marginBottom: '1.5rem' }}>Últimas Publicações</h4>
              <div className="row g-4 mb-5">
                {resto.map(a => (
                  <div key={a.id} className="col-md-4">
                    <div className="artigo-card">
                      <img src={a.imagem || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80'} alt={a.titulo} />
                      <div className="artigo-card-body">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{a.dataPublicacao?.slice(0, 10)}</span>
                          {a.categoria && <span className={`artigo-tag ${tagClass(a.categoria)}`}>{a.categoria}</span>}
                        </div>
                        <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0d1117', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{brandText(a.titulo)}</h6>
                        <p style={{ color: '#64748b', fontSize: '0.83rem', marginBottom: '0.8rem' }}>{brandText(a.resumo)}</p>
                        <div className="d-flex align-items-center justify-content-between">
                          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}><i className="bi bi-person me-1" />{a.autor || 'Redação'}</span>
                          <Link to={`/artigos/${a.slug}`} style={{ color: '#3b82f6', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none' }}>Ler mais</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!destaque && <EmptyState icon="bi-journal-text" title="Ainda não existem artigos" description="Novos conteúdos de cibersegurança serão publicados aqui." />}

          {/* CATEGORIAS */}
          <div className="mb-5">
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0d1117', marginBottom: '1rem' }}>Categorias</h4>
            <div className="d-flex flex-wrap gap-2">
              <button onClick={() => setCatAtiva('')} style={{ background: catAtiva === '' ? '#0d1117' : '#f1f5f9', color: catAtiva === '' ? '#fff' : '#475569', border: 'none', borderRadius: 20, padding: '0.35rem 1rem', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer' }}>Todos</button>
              {CATEGORIAS.map(c => (
                <button key={c} onClick={() => setCatAtiva(c)} style={{ background: catAtiva === c ? '#0d1117' : '#f1f5f9', color: catAtiva === c ? '#fff' : '#475569', border: 'none', borderRadius: 20, padding: '0.35rem 1rem', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer' }}>{c}</button>
              ))}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div style={{ background: '#0d1117', borderRadius: 16, padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginBottom: '0.3rem' }}>Newsletter</h4>
            <p style={{ color: 'var(--vison-gray)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>Receba as últimas notícias e artigos diretamente no seu email</p>
            {subOk ? (
              <p style={{ color: '#10b981', fontWeight: 600 }}><i className="bi bi-check-circle me-2" />Subscrito com sucesso!</p>
            ) : (
              <div className="d-flex justify-content-center gap-2" style={{ maxWidth: 400, margin: '0 auto' }}>
                <input type="email" placeholder="o seu email" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.88rem' }} />
                <button onClick={async () => {
                  try {
                    await api.post('/artigos/newsletter', { email });
                    setSubOk(true);
                    setSubErro('');
                  } catch (error) {
                    setSubErro(error.response?.data?.erro || 'Não foi possível subscrever.');
                  }
                }} className="btn-vison-primary">Subscrever</button>
              </div>
            )}
            {subErro && <p style={{ color: '#f87171', marginTop: '0.75rem' }}>{subErro}</p>}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
