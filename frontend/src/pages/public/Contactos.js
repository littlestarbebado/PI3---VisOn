import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

export default function Contactos() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', empresa: '', mensagem: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.nome || !form.email || !form.mensagem) { setStatus('erro'); return; }
    setLoading(true);
    try {
      await api.post('/contacto', form);
      setStatus('ok');
      setForm({ nome: '', email: '', telefone: '', empresa: '', mensagem: '' });
    } catch { setStatus('erro'); }
    finally { setLoading(false); }
  };

  const INFO = [
    { icon: 'bi-envelope', color: 'icon-blue', title: 'Email', lines: ['info@cyberboxsecur.pt', 'comercial@cyberboxsecur.pt'] },
    { icon: 'bi-telephone', color: 'icon-cyan', title: 'Telefone', lines: ['+351 210 123 456', '+351 960 000 000'] },
    { icon: 'bi-geo-alt', color: 'icon-purple', title: 'Morada', lines: ['Jugueiros, 123', '3500-000 Viseu', 'Portugal'] },
    { icon: 'bi-clock', color: 'icon-green', title: 'Horário de Atendimento', lines: ['Segunda a Sexta: 09:00 - 18:00', 'Sábado: 10:00 - 14:00', 'Domingo: Encerrado'] },
  ];

  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="container">
          <h1>Entre em Contacto</h1>
          <p>Estamos prontos para ajudar a proteger a sua organização. Fale connosco!</p>
        </div>
      </section>

      <section className="section-white">
        <div className="container">
          <div className="row g-5">

            {/* CONTACT INFO */}
            <div className="col-md-5">
              {INFO.map((item, i) => (
                <div key={i} className="contact-info-card">
                  <div className={`contact-icon ${item.color}`}><i className={`bi ${item.icon}`} /></div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0d1117', fontSize: '0.88rem', marginBottom: '0.25rem' }}>{item.title}</p>
                    {item.lines.map((l, j) => <p key={j} style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{l}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* FORM */}
            <div className="col-md-7">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0d1117', marginBottom: '1.5rem' }}>Envie-nos uma Mensagem</h3>
              <div className="vison-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label>Nome *</label>
                    <input name="nome" value={form.nome} onChange={handle} className="form-control" placeholder="O seu nome" />
                  </div>
                  <div className="col-md-6">
                    <label>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} className="form-control" placeholder="email@exemplo.com" />
                  </div>
                  <div className="col-md-6">
                    <label>Telefone</label>
                    <input name="telefone" value={form.telefone} onChange={handle} className="form-control" placeholder="+351 960 000 000" />
                  </div>
                  <div className="col-md-6">
                    <label>Empresa</label>
                    <input name="empresa" value={form.empresa} onChange={handle} className="form-control" placeholder="Nome da empresa" />
                  </div>
                  <div className="col-12">
                    <label>Mensagem *</label>
                    <textarea name="mensagem" value={form.mensagem} onChange={handle} className="form-control" rows={4} placeholder="Descreva como podemos ajudar..." />
                  </div>
                </div>

                {status === 'ok' && (
                  <div style={{ background: '#d1fae5', borderRadius: 8, padding: '0.75rem 1rem', marginTop: '1rem', color: '#065f46', fontSize: '0.88rem', fontWeight: 500 }}>
                    <i className="bi bi-check-circle me-2" />Mensagem enviada com sucesso! Entraremos em contacto brevemente.
                  </div>
                )}
                {status === 'erro' && (
                  <div style={{ background: '#fee2e2', borderRadius: 8, padding: '0.75rem 1rem', marginTop: '1rem', color: '#991b1b', fontSize: '0.88rem' }}>
                    <i className="bi bi-exclamation-triangle me-2" />Por favor preencha todos os campos obrigatórios.
                  </div>
                )}

                <button onClick={submit} disabled={loading} className="btn-vison-dark w-100 mt-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {loading ? <><span className="spinner-border spinner-border-sm" />A enviar...</> : <><i className="bi bi-send" /> Enviar Mensagem</>}
                </button>
              </div>
            </div>
          </div>

          {/* MAPA */}
          <div className="mt-5">
            <div className="map-placeholder">
              <iframe
                title="Localização CyberBox Secur"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48399.05820654638!2d-7.970060!3d40.656540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd23393cbab8a7d3%3A0x500ef868479a0c0!2sViseu!5e0!3m2!1spt!2spt!4v1709899200000"
                width="100%" height="260" style={{ border: 0 }} allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
