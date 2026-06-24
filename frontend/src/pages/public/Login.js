import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VisonLogo from '../../components/VisonLogo';

function getHomeForRole(role) {
  if (role === 'Admin') return '/admin';
  if (role === 'Gestor') return '/gestor';
  if (role === 'Cliente') return '/cliente';
  return '/login';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const data = await login(email, password);
      nav(getHomeForRole(data?.role), { replace: true });
    } catch (error) {
      setErro(error.response?.data?.erro || 'Credenciais invalidas. Verifique o email e a palavra-passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="text-center mb-4">
        <VisonLogo size="lg" dark />
        <p style={{ color: 'var(--vison-gray)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Portal seguro CyberBox Secur
        </p>
      </div>

      <div className="login-card">
        <form onSubmit={handleLogin}>
          <h2>Iniciar Sessao</h2>

          <div className="mb-3">
            <label className="d-block mb-1" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>
              Email
            </label>
            <div className="input-icon-wrap">
              <i className="bi bi-envelope" />
              <input
                type="email"
                className="form-control"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="d-block mb-1" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>
              Palavra-passe
            </label>
            <div className="input-icon-wrap">
              <i className="bi bi-lock" />
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {erro && (
            <div style={{ background: '#fee2e2', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.83rem', color: '#991b1b', marginBottom: '0.75rem' }}>
              <i className="bi bi-exclamation-triangle me-2" />
              {erro}
            </div>
          )}

          <p style={{ color: '#667085', fontSize: '0.82rem', marginBottom: '0.9rem' }}>
            Esqueceu a palavra-passe? Contacte o administrador da plataforma para receber uma password temporaria.
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#0d1117', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? <><span className="spinner-border spinner-border-sm" />A entrar...</> : 'Entrar'}
          </button>
        </form>
      </div>

      <Link to="/" className="login-back"><i className="bi bi-arrow-left" /> Voltar ao site institucional</Link>
    </div>
  );
}
