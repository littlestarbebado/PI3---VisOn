import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VisonLogo from '../../components/VisonLogo';
import api from '../../services/api';

// ─────────────────────────────── SIDEBAR ───────────────────────────────
function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const items = [
    { icon: 'bi-speedometer2', label: 'Dashboard', path: '/admin' },
    { icon: 'bi-file-earmark-text', label: 'Artigos', path: '/admin/artigos' },
    { icon: 'bi-type', label: 'Conteúdos', path: '/admin/conteudos' },
    { icon: 'bi-envelope', label: 'Mensagens', path: '/admin/mensagens' },
  ];

  return (
    <div className="admin-sidebar">
      <div style={{ padding: '0 1.4rem 1.5rem', borderBottom: '1px solid var(--vison-border)' }}>
        <VisonLogo size="sm" dark />
        <p style={{ color: 'var(--vison-gray)', fontSize: '0.72rem', marginTop: '0.3rem', marginBottom: 0 }}>Painel de Administração</p>
      </div>
      <div style={{ paddingTop: '1rem' }}>
        {items.map(item => (
          <Link key={item.path} to={item.path} className={`admin-nav-item ${loc.pathname === item.path ? 'active' : ''}`}>
            <i className={`bi ${item.icon}`} />{item.label}
          </Link>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0 }}>
        <button onClick={() => { logout(); nav('/'); }} className="admin-nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
          <i className="bi bi-box-arrow-left" />Sair
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────── DASHBOARD ───────────────────────────────
function DashboardHome() {
  const [stats, setStats] = useState({ artigos: 0, mensagens: 0, naoLidas: 0 });

  useEffect(() => {
    Promise.all([api.get('/artigos/admin'), api.get('/contacto')]).then(([a, m]) => {
      setStats({ artigos: a.data.length, mensagens: m.data.length, naoLidas: m.data.filter(x => !x.lida).length });
    }).catch(() => {});
  }, []);

  const cards = [
    { icon: 'bi-file-earmark-text', label: 'Artigos', value: stats.artigos, color: 'var(--vison-blue)' },
    { icon: 'bi-envelope', label: 'Mensagens', value: stats.mensagens, color: 'var(--vison-cyan)' },
    { icon: 'bi-bell', label: 'Não Lidas', value: stats.naoLidas, color: 'var(--vison-pink)' },
  ];

  return (
    <div>
      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '1.5rem' }}>Dashboard</h4>
      <div className="row g-4">
        {cards.map((c, i) => (
          <div key={i} className="col-md-4">
            <div className="admin-card d-flex align-items-center gap-3">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: c.color }}>
                <i className={`bi ${c.icon}`} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{c.value}</div>
                <div style={{ color: 'var(--vison-gray)', fontSize: '0.82rem' }}>{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-card mt-4">
        <p style={{ color: 'var(--vison-gray)', fontSize: '0.88rem', margin: 0 }}>
          <i className="bi bi-info-circle me-2" />Use o menu lateral para gerir artigos, conteúdos institucionais e mensagens de contacto.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────── ARTIGOS ───────────────────────────────
function AdminArtigos() {
  const [artigos, setArtigos] = useState([]);
  const [form, setForm] = useState({ titulo: '', resumo: '', conteudo: '', publicado: false });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/artigos/admin').then(r => setArtigos(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) await api.put(`/artigos/${editing}`, form);
    else await api.post('/artigos', form);
    setShowForm(false); setEditing(null); setForm({ titulo: '', resumo: '', conteudo: '', publicado: false });
    load();
  };

  const del = async id => { if (window.confirm('Eliminar?')) { await api.delete(`/artigos/${id}`); load(); } };

  const edit = a => { setEditing(a.id); setForm({ titulo: a.titulo, resumo: a.resumo || '', conteudo: a.conteudo, publicado: a.publicado }); setShowForm(true); };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, margin: 0 }}>Artigos</h4>
        <button className="btn-vison-primary" onClick={() => { setShowForm(true); setEditing(null); setForm({ titulo: '', resumo: '', conteudo: '', publicado: false }); }}>
          <i className="bi bi-plus" /> Novo Artigo
        </button>
      </div>

      {showForm && (
        <div className="admin-card mb-4">
          <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem' }}>{editing ? 'Editar Artigo' : 'Novo Artigo'}</h6>
          <div className="vison-form row g-3">
            <div className="col-12">
              <label>Título *</label>
              <input className="form-control" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
            </div>
            <div className="col-12">
              <label>Resumo</label>
              <input className="form-control" value={form.resumo} onChange={e => setForm(f => ({ ...f, resumo: e.target.value }))} />
            </div>
            <div className="col-12">
              <label>Conteúdo *</label>
              <textarea className="form-control" rows={6} value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} />
            </div>
            <div className="col-12">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.publicado} onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))} />
                Publicar imediatamente
              </label>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn-vison-primary" onClick={save}><i className="bi bi-floppy" /> Guardar</button>
              <button className="btn-vison-outline" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Título</th><th>Estado</th><th>Data</th><th>Ações</th></tr></thead>
          <tbody>
            {artigos.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--vison-gray)' }}>Nenhum artigo encontrado</td></tr>}
            {artigos.map(a => (
              <tr key={a.id}>
                <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{a.titulo}</td>
                <td><span className={a.publicado ? 'badge-publicado' : 'badge-rascunho'}>{a.publicado ? 'Publicado' : 'Rascunho'}</span></td>
                <td>{a.dataPublicacao ? new Date(a.dataPublicacao).toLocaleDateString('pt-PT') : '—'}</td>
                <td>
                  <button onClick={() => edit(a)} style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', marginRight: 6, fontSize: '0.8rem' }}>
                    <i className="bi bi-pencil" />
                  </button>
                  <button onClick={() => del(a.id)} style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <i className="bi bi-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────── CONTEÚDOS ───────────────────────────────
function AdminConteudos() {
  const [conteudos, setConteudos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [valor, setValor] = useState('');
  const [saved, setSaved] = useState(null);

  const load = () => api.get('/conteudos/list').then(r => setConteudos(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (id) => {
    await api.put(`/conteudos/${id}`, { valor });
    setSaved(id); setTimeout(() => setSaved(null), 2000);
    setEditing(null); load();
  };

  const seed = async () => {
    await api.post('/conteudos/seed');
    load();
  };

  const grouped = conteudos.reduce((acc, c) => { if (!acc[c.secao]) acc[c.secao] = []; acc[c.secao].push(c); return acc; }, {});

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, margin: 0 }}>Conteúdos Institucionais</h4>
        <button className="btn-vison-outline" onClick={seed}><i className="bi bi-database" /> Inicializar Defaults</button>
      </div>

      {Object.entries(grouped).map(([secao, items]) => (
        <div key={secao} className="admin-card mb-4">
          <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--vison-blue)', marginBottom: '1rem', textTransform: 'capitalize' }}>{secao}</h6>
          {items.map(c => (
            <div key={c.id} style={{ borderBottom: '1px solid var(--vison-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--vison-gray)', marginBottom: '0.3rem', fontFamily: 'monospace' }}>{c.chave}</p>
                  {editing === c.id ? (
                    <div className="vison-form">
                      <textarea className="form-control" rows={3} value={valor} onChange={e => setValor(e.target.value)} style={{ marginBottom: '0.5rem' }} />
                      <div className="d-flex gap-2">
                        <button className="btn-vison-primary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }} onClick={() => save(c.id)}>
                          {saved === c.id ? <><i className="bi bi-check" /> Guardado!</> : <><i className="bi bi-floppy" /> Guardar</>}
                        </button>
                        <button className="btn-vison-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }} onClick={() => setEditing(null)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: '#e2e8f0', fontSize: '0.88rem', margin: 0 }}>{c.valor}</p>
                  )}
                </div>
                {editing !== c.id && (
                  <button onClick={() => { setEditing(c.id); setValor(c.valor); }} style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: 6, padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    <i className="bi bi-pencil me-1" />Editar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {conteudos.length === 0 && (
        <div className="admin-card text-center" style={{ padding: '3rem' }}>
          <i className="bi bi-database" style={{ fontSize: '2rem', color: 'var(--vison-gray)', marginBottom: '0.75rem', display: 'block' }} />
          <p style={{ color: 'var(--vison-gray)' }}>Sem conteúdos. Clique em "Inicializar Defaults" para criar os textos padrão.</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────── MENSAGENS ───────────────────────────────
function AdminMensagens() {
  const [msgs, setMsgs] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => api.get('/contacto').then(r => setMsgs(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const marcarLida = async id => { await api.put(`/contacto/${id}/lida`); load(); };
  const del = async id => { if (window.confirm('Eliminar?')) { await api.delete(`/contacto/${id}`); setSelected(null); load(); } };

  return (
    <div>
      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '1.5rem' }}>Mensagens de Contacto</h4>
      <div className="row g-4">
        <div className="col-md-5">
          <div className="admin-card" style={{ padding: '0.5rem' }}>
            {msgs.length === 0 && <p style={{ color: 'var(--vison-gray)', textAlign: 'center', padding: '2rem', margin: 0 }}>Sem mensagens</p>}
            {msgs.map(m => (
              <div key={m.id} onClick={() => { setSelected(m); if (!m.lida) marcarLida(m.id); }}
                style={{ padding: '0.9rem 1rem', borderRadius: 8, cursor: 'pointer', borderBottom: '1px solid var(--vison-border)', background: selected?.id === m.id ? 'rgba(59,130,246,0.08)' : 'transparent' }}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.88rem' }}>{m.nome}</span>
                  {!m.lida && <span className="badge-nao-lida">Nova</span>}
                </div>
                <p style={{ color: 'var(--vison-gray)', fontSize: '0.8rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.mensagem}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-7">
          {selected ? (
            <div className="admin-card">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h6 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{selected.nome}</h6>
                  <p style={{ color: 'var(--vison-gray)', fontSize: '0.82rem', margin: 0 }}>{selected.email} {selected.telefone && `· ${selected.telefone}`}</p>
                  {selected.empresa && <p style={{ color: 'var(--vison-gray)', fontSize: '0.82rem', margin: 0 }}>{selected.empresa}</p>}
                </div>
                <button onClick={() => del(selected.id)} style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <i className="bi bi-trash" />
                </button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {selected.mensagem}
              </div>
              <p style={{ color: 'var(--vison-gray)', fontSize: '0.78rem', marginTop: '0.75rem', marginBottom: 0 }}>
                <i className="bi bi-clock me-1" />{new Date(selected.createdAt).toLocaleString('pt-PT')}
              </p>
            </div>
          ) : (
            <div className="admin-card text-center" style={{ padding: '3rem' }}>
              <i className="bi bi-envelope-open" style={{ fontSize: '2rem', color: 'var(--vison-gray)', marginBottom: '0.5rem', display: 'block' }} />
              <p style={{ color: 'var(--vison-gray)', margin: 0 }}>Selecione uma mensagem para ver o conteúdo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────── LAYOUT ADMIN ───────────────────────────────
export default function AdminLayout() {
  const { admin, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => { if (!loading && !admin) nav('/login'); }, [admin, loading, nav]);
  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--vison-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner-border text-light" /></div>;

  let Content = DashboardHome;
  if (loc.pathname === '/admin/artigos') Content = AdminArtigos;
  else if (loc.pathname === '/admin/conteudos') Content = AdminConteudos;
  else if (loc.pathname === '/admin/mensagens') Content = AdminMensagens;

  return (
    <div className="admin-layout" style={{ position: 'relative' }}>
      <Sidebar />
      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--vison-gray)', fontSize: '0.85rem' }}><i className="bi bi-person-circle me-2" />{admin?.nome}</span>
        </div>
        <Content />
      </main>
    </div>
  );
}
