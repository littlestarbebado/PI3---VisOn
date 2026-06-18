import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const STATS_DEFAULT = [
  { key: 'stat_clientes', num: '150+', label: 'Clientes Ativos', color: '', icon: 'bi-people' },
  { key: 'stat_pentests', num: '500+', label: 'PenTests Realizados', color: 'blue', icon: 'bi-shield-check' },
  { key: 'stat_satisfacao', num: '98%', label: 'Taxa de Satisfação', color: 'cyan', icon: 'bi-graph-up' },
  { key: 'stat_anos', num: '15+', label: 'Anos de Experiência', color: 'pink', icon: 'bi-award' },
];

const SERVICOS = [
  { icon: 'bi-cpu', color: 'icon-blue', title: 'Avaliação de Maturidade IT', desc: 'Análise completa do nível de maturidade da sua infraestrutura tecnológica e práticas de segurança.' },
  { icon: 'bi-bug', color: 'icon-cyan', title: 'Testes de Penetração', desc: 'Simulação de ataques reais para identificar vulnerabilidades antes dos atacantes.' },
  { icon: 'bi-file-earmark-check', color: 'icon-purple', title: 'Conformidade NIS I/II', desc: 'Apoio à implementação e manutenção da conformidade com as diretivas europeias.' },
];

export default function Home() {
  const [conteudos, setConteudos] = useState({});
  const [servicos, setServicos] = useState(SERVICOS);

  useEffect(() => {
    api.get('/conteudos').then(r => {
      setConteudos(r.data);
      if (r.data.servicos_json) setServicos(JSON.parse(r.data.servicos_json).slice(0, 3));
    }).catch(() => {});
  }, []);

  const heroTitle = conteudos.hero_titulo || 'Proteja o Futuro Digital da sua Organização';
  const heroSub = conteudos.hero_subtitulo || 'Soluções avançadas de cibersegurança para empresas que valorizam a proteção dos seus dados e sistemas.';

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero-home">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>Proteção 24/7 Ativa</span>
              </div>
              <h1>{heroTitle}</h1>
              <p>{heroSub}</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/contactos" className="btn-vison-primary" style={{ textDecoration: 'none' }}>
                  <i className="bi bi-chat-dots" /> Fale Connosco
                </Link>
                <Link to="/servicos" className="btn-vison-outline" style={{ textDecoration: 'none' }}>
                  Conheça os Serviços
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-white">
        <div className="container">
          <div className="row g-4 text-center">
            {STATS_DEFAULT.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <i className={`bi ${s.icon} mb-2`} style={{ fontSize: '1.6rem', color: s.color === 'blue' ? 'var(--vison-blue)' : s.color === 'cyan' ? 'var(--vison-cyan)' : s.color === 'pink' ? 'var(--vison-pink)' : '#64748b' }} />
                <div className={`stat-num ${s.color}`} style={{ color: s.color === 'blue' ? '#3b82f6' : s.color === 'cyan' ? '#06b6d4' : s.color === 'pink' ? '#ec4899' : '#0d1117' }}>
                  {conteudos[s.key] || s.num}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="section-dark">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Os Nossos Serviços</h2>
            <p className="section-sub">Oferecemos soluções completas de cibersegurança adaptadas às necessidades da sua organização</p>
          </div>
          <div className="row g-4">
            {servicos.map((s, i) => (
              <div key={i} className="col-md-4">
                <div className="vison-card h-100">
                  <div className={`icon-box ${s.color}`}><i className={`bi ${s.icon}`} /></div>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{s.title || s.titulo}</h5>
                  <p style={{ color: 'var(--vison-gray)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>{s.desc || s.descricao}</p>
                  <Link to="/servicos" style={{ color: 'var(--vison-blue)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                    Saber Mais →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/servicos" className="btn-vison-outline" style={{ textDecoration: 'none' }}>Ver Todos os Serviços</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container">
          <div className="cta-banner text-center">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.75rem' }}>
              Pronto para Proteger a sua Organização?
            </h2>
            <p style={{ color: 'var(--vison-gray)', maxWidth: 480, margin: '0 auto 1.5rem' }}>
              Entre em contacto connosco e descubra como podemos ajudar a fortalecer a sua postura de cibersegurança.
            </p>
            <Link to="/contactos" className="btn-vison-primary" style={{ textDecoration: 'none' }}>
              Solicitar Consultoria Gratuita
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
