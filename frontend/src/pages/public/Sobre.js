import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const VALORES = [
  { icon: 'bi-shield-check', color: 'icon-blue', title: 'Confiança', desc: 'Construímos relações baseadas na transparência e integridade.' },
  { icon: 'bi-star', color: 'icon-cyan', title: 'Excelência', desc: 'Comprometemo-nos com os mais altos padrões de qualidade e rigor técnico.' },
  { icon: 'bi-lightbulb', color: 'icon-purple', title: 'Inovação', desc: 'Mantemo-nos na vanguarda das tecnologias e práticas de cibersegurança.' },
  { icon: 'bi-heart', color: 'icon-pink', title: 'Responsabilidade', desc: 'Assumimos total compromisso com a proteção dos dados e sistemas dos nossos clientes.' },
];

const EQUIPA = [
  { icon: 'bi-patch-check', color: 'icon-blue', title: 'Certificações Internacionais', desc: 'CISSP, CEH, OSCP, ISO 27001' },
  { icon: 'bi-briefcase', color: 'icon-cyan', title: 'Experiência Comprovada', desc: 'Mais de 15 anos no mercado' },
  { icon: 'bi-book', color: 'icon-purple', title: 'Atualização Contínua', desc: 'Formação permanente' },
];

export default function Sobre() {
  const [conteudos, setConteudos] = useState({});

  useEffect(() => {
    api.get('/conteudos').then(r => setConteudos(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container">
          <h1>Sobre a <span style={{ color: 'var(--vison-blue)' }}>VisOn</span></h1>
          <p>Parceiro de confiança na proteção do futuro digital das organizações portuguesas</p>
        </div>
      </section>

      {/* MISSÃO & VISÃO */}
      <section className="section-white">
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon-box icon-blue"><i className="bi bi-bullseye" /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#0d1117', margin: 0 }}>Nossa Missão</h3>
              </div>
              <p style={{ color: '#374151', lineHeight: 1.7 }}>
                {conteudos.missao_texto || 'Proteger organizações contra ameaças cibernéticas através de soluções inovadoras e personalizadas, garantindo a continuidade e segurança dos seus negócios.'}
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="icon-box icon-purple"><i className="bi bi-eye" /></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#0d1117', margin: 0 }}>Nossa Visão</h3>
              </div>
              <p style={{ color: '#374151', lineHeight: 1.7 }}>
                {conteudos.visao_texto || 'Ser a referência nacional em cibersegurança, reconhecida pela excelência técnica e pela confiança dos nossos clientes.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="section-dark">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Nossos Valores</h2>
            <p className="section-sub">Princípios que guiam o nosso trabalho e relacionamento com os clientes</p>
          </div>
          <div className="row g-4">
            {VALORES.map((v, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="vison-card h-100 text-center">
                  <div className={`icon-box ${v.color} mx-auto`}><i className={`bi ${v.icon}`} /></div>
                  <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{v.title}</h6>
                  <p style={{ color: 'var(--vison-gray)', fontSize: '0.82rem', margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPA */}
      <section className="section-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title" style={{ color: '#0d1117' }}>Equipa Especializada</h2>
            <p className="section-sub-dark">Profissionais certificados e experientes ao seu serviço</p>
          </div>
          <div className="row g-4 justify-content-center">
            {EQUIPA.map((e, i) => (
              <div key={i} className="col-md-4 text-center">
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.6rem', color: '#3b82f6' }}>
                  <i className={`bi ${e.icon}`} />
                </div>
                <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0d1117', marginBottom: '0.3rem' }}>{e.title}</h6>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
