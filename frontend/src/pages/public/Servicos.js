import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const SERVICOS_CARDS = [
  { icon: 'bi-cpu', color: 'icon-blue', title: 'Avaliação de Maturidade IT', desc: 'Análise completa do nível de maturidade da sua infraestrutura tecnológica e práticas de segurança.' },
  { icon: 'bi-bug', color: 'icon-cyan', title: 'Testes de Penetração (PenTest)', desc: 'Simulação de ataques reais para identificar vulnerabilidades antes dos atacantes.' },
  { icon: 'bi-file-earmark-check', color: 'icon-purple', title: 'Conformidade NIS I/II', desc: 'Apoio à implementação e manutenção da conformidade com as Diretivas NIS da União Europeia.' },
  { icon: 'bi-mortarboard', color: 'icon-green', title: 'Formação em Cibersegurança', desc: 'Programas de formação personalizados para capacitar eficazmente as suas equipas.' },
  { icon: 'bi-exclamation-triangle', color: 'icon-pink', title: 'Gestão de Incidentes', desc: 'Apoio na deteção, resposta e mitigação de incidentes de segurança.' },
  { icon: 'bi-search', color: 'icon-blue', title: 'Consultoria em Cibersegurança', desc: 'Acompanhamento especializado para definição e melhoria da sua política de segurança.' },
];

const DETALHES = [
  {
    title: 'Avaliação de Maturidade IT',
    desc: 'A nossa avaliação de maturidade em cibersegurança permite compreender o nível atual de segurança da sua organização e identificar áreas de melhoria prioritárias.',
    items: ['Análise de processos e políticas de segurança', 'Avaliação da infraestrutura tecnológica', 'Identificação de falhas com priorização', 'Roadmap de melhorias com priorização', 'Comparação com standards internacionais'],
  },
  {
    title: 'Testes de Penetração (PenTest)',
    desc: 'Simulamos ataques à sua infraestrutura para identificar vulnerabilidades antes que sejam exploradas por utilizadores maliciosos.',
    items: ['PenTest de aplicações web e mobile', 'PenTest de infraestrutura de rede', 'PenTest de engenharia social', 'PenTest de APIs e serviços', 'Relatórios detalhados com remediações'],
  },
  {
    title: 'Conformidade NIS I e NIS II',
    desc: 'Apoiamos a sua organização na implementação e manutenção da conformidade com as Diretivas NIS I e NIS II da União Europeia.',
    items: ['Gap analysis face aos requisitos NIS', 'Implementação de medidas de segurança', 'Processos de notificação de incidentes', 'Planos de conformidade e manutenção', 'Apoio contínuo e manutenção'],
  },
];

export default function Servicos() {
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
            {SERVICOS_CARDS.map((s, i) => (
              <div key={i} className="col-md-4">
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.6rem', height: '100%', transition: 'all .25s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; }}>
                  <div className={`icon-box ${s.color} mb-3`}><i className={`bi ${s.icon}`} /></div>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#0d1117', marginBottom: '0.5rem' }}>{s.title}</h5>
                  <p style={{ color: '#64748b', fontSize: '0.87rem', marginBottom: '1rem' }}>{s.desc}</p>
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
          {DETALHES.map((d, i) => (
            <div key={i} className={`servico-detail ${i === 0 ? '' : ''}`} style={{ borderTop: i > 0 ? '1px solid var(--vison-border)' : 'none', paddingTop: i > 0 ? '2.5rem' : 0, marginTop: i > 0 ? '2.5rem' : 0 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.5rem' }}>{d.title}</h3>
              <p style={{ color: 'var(--vison-gray)', marginBottom: '1rem', fontSize: '0.9rem' }}>{d.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {d.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#3b82f6', fontWeight: 700, marginTop: 1 }}>✓</span> {item}
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
