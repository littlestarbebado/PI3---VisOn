import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { brandText } from '../../utils/brand';

const SERVICOS_CARDS = [
  { icon: 'bi-cpu', color: 'icon-blue', title: 'Avaliação de Maturidade IT', desc: 'Análise completa do nível de maturidade da sua infraestrutura tecnológica e práticas de segurança.' },
  { icon: 'bi-bug', color: 'icon-cyan', title: 'Testes de Penetração (PenTest)', desc: 'Simulação de ataques reais para identificar vulnerabilidades antes dos atacantes.' },
  { icon: 'bi-file-earmark-check', color: 'icon-purple', title: 'Conformidade NIS I/II', desc: 'Apoio à implementação e manutenção da conformidade com as Diretivas NIS da União Europeia.' },
  { icon: 'bi-mortarboard', color: 'icon-green', title: 'Formação em Cibersegurança', desc: 'Programas de formação personalizados para capacitar eficazmente as suas equipas.' },
  { icon: 'bi-exclamation-triangle', color: 'icon-pink', title: 'Gestão de Incidentes', desc: 'Apoio na deteção, resposta e mitigação de incidentes de segurança.' },
  { icon: 'bi-search', color: 'icon-blue', title: 'Consultoria em Cibersegurança', desc: 'Acompanhamento especializado para definição e melhoria da sua política de segurança.' },
];

export default function Servicos() {
  const [servicos, setServicos] = useState(SERVICOS_CARDS);

  useEffect(() => {
    api.get('/conteudos').then(({ data }) => {
      if (data.servicos_json) setServicos(JSON.parse(data.servicos_json));
    }).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <h1>Serviços de Cibersegurança</h1>
          <p>Soluções completas para proteger a sua organização contra ameaças digitais</p>
        </div>
      </section>

      {/* CARDS GRID */}
      <section className="section-white">
        <div className="container">
          <div className="row g-4">
            {servicos.map((s, i) => (
              <div key={i} className="col-md-4">
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.6rem', height: '100%', transition: 'all .25s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; }}>
                  <div className={`icon-box ${s.color} mb-3`}><i className={`bi ${s.icon}`} /></div>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#0d1117', marginBottom: '0.5rem' }}>{brandText(s.title || s.titulo)}</h5>
                  <p style={{ color: '#64748b', fontSize: '0.87rem', marginBottom: '1rem' }}>{brandText(s.desc || s.descricao)}</p>
                  <a href="#detalhes" style={{ color: '#3b82f6', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none' }}>Saber Mais →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETALHES */}
      <section id="detalhes" className="section-dark">
        <div className="container">
          {servicos.map((d, i) => (
            <div key={i} className={`servico-detail ${i === 0 ? '' : ''}`} style={{ borderTop: i > 0 ? '1px solid var(--vison-border)' : 'none', paddingTop: i > 0 ? '2.5rem' : 0, marginTop: i > 0 ? '2.5rem' : 0 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.5rem' }}>{brandText(d.title || d.titulo)}</h3>
              <p style={{ color: 'var(--vison-gray)', marginBottom: '1rem', fontSize: '0.9rem' }}>{brandText(d.desc || d.descricao)}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {(d.items || []).map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#3b82f6', fontWeight: 700, marginTop: 1 }}>✓</span> {brandText(item)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-white">
        <div className="container">
          <div style={{ background: '#0d1117', borderRadius: 18, padding: '3rem 2rem', textAlign: 'center', border: '1px solid var(--vison-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Interessado nos Nossos Serviços?</h2>
            <p style={{ color: 'var(--vison-gray)', marginBottom: '1.5rem' }}>Entre em contacto para discutir como podemos ajudar a proteger a sua organização</p>
            <Link to="/contactos" className="btn-vison-primary" style={{ textDecoration: 'none' }}>Solicitar Orçamento</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
