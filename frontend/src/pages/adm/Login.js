import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado do formulário com useState
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      // Usa o AuthContext (que já trata o token e o axios internamente)
      const data = await login(email, password);

      // Redirecionar conforme o role do utilizador
      const role = data?.role;
      if (role === 'Gestor') {
        navigate('/gestor');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Credenciais inválidas. Verifique o email e a password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card bg-dark text-white p-4 border-secondary shadow">

        <h3 className="fw-bold text-center text-info mb-4">Entrar no VisOn</h3>

        {erro && (
          <div className="alert alert-danger small py-2">{erro}</div>
        )}

        <form onSubmit={handleLogin}>

          <div className="mb-3">
            <label className="form-label text-muted small">E-mail</label>
            <input
              type="email"
              className="form-control bg-secondary text-white border-0"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@vison.pt"
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-muted small">Password</label>
            <input
              type="password"
              className="form-control bg-secondary text-white border-0"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-info text-dark fw-bold w-100"
            disabled={loading}
          >
            {loading ? 'A verificar...' : 'Iniciar Sessão'}
          </button>

        </form>

        <div className="text-center mt-3">
          <Link to="/" style={{ color: '#6b7280', fontSize: '0.83rem', textDecoration: 'none' }}>
            ← Voltar ao site institucional
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
