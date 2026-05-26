import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VisonLogo from '../../components/VisonLogo';

export default function Login() {
  const [role, setRole] = useState(null); // null | 'admin' | 'gestor' | 'cliente'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleLogin = async () => {
    setErro('');
    setLoading(true);
    try {
      const data = await login(email, password);
      const userRole = data.admin?.role || data.user?.role || data.cliente?.role;
      if (userRole === 'Gestor') nav('/gestor');
      else if (userRole === 'Cliente') nav('/cliente');
      else nav('/admin');
    } catch {
      setErro('Credenciais inválidas. Verifique o email e a palavra-passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LOGO */}
      <div className="text-center mb-4">
        <VisonLogo size="lg" dark />
        <p style={{ color: 'var(--vison-gray)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Portal de Acesso de Clientes</p>
      </div>

      <div className="login-card">
        {!role ? (
          /* SELECTOR DE ROLE */
          <>
            <h2>Iniciar Sessão</h2>
            {['Admin', 'Gestor', 'Cliente'].map(r => (
              <button key={r} className="login-role-btn" onClick={() => { setRole(r.toLowerCase()); if (r === 'Admin') setEmail('admin@vison.pt'); }}>
                {r}
              </button>
            ))}
          </>
        ) : (
          /* FORMULÁRIO */
          <>
            <div className="d-flex align-items-center gap-2 mb-3">
              <button onClick={() => { setRole(null); setErro(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.85rem', padding: 0 }}>
                <i className="bi bi-arrow-left me-1" />Voltar
              </button>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>/ <span style={{ color: '#0d1117', fontWeight: 600, textTransform: 'capitalize' }}>{role}</span></span>
            </div>
            <h2>Iniciar Sessão</h2>

            <div className="mb-3">
              <label className="d-block mb-1" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Email</label>
              <div className="input-icon-wrap">
                <i className="bi bi-envelope" />
                <input type="email" className="form-control" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="mb-3">
              <label className="d-block mb-1" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Palavra-passe</label>
              <div className="input-icon-wrap">
                <i className="bi bi-lock" />
                <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mb-3">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#374151', cursor: 'pointer' }}>
                <input type="checkbox" checked={lembrar} onChange={e => setLembrar(e.target.checked)} /> Lembrar-me
              </label>
              <a href="#!" style={{ color: '#3b82f6', fontSize: '0.83rem', textDecoration: 'none' }}>Esqueceu a palavra-passe?</a>
            </div>

            {erro && (
              <div style={{ background: '#fee2e2', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.83rem', color: '#991b1b', marginBottom: '0.75rem' }}>
                <i className="bi bi-exclamation-triangle me-2" />{erro}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#0d1117', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><span className="spinner-border spinner-border-sm" />A entrar...</> : 'Entrar'}
            </button>

            {role === 'admin' && (
              <div className="demo-box">
                <p><strong>Credenciais de Demonstração:</strong></p>
                <p><strong>Admin:</strong> admin@vison.pt / Admin@1234</p>
              </div>
            )}
          </>
        )}
      </div>

      <Link to="/" className="login-back"><i className="bi bi-arrow-left" /> Voltar ao site institucional</Link>
    </div>
  );
}
