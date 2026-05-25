import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ... dentro do teu componente de Login:
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    // Chamada direta à API de autenticação
    axios.post('http://localhost:5000/api/auth/login', { email, password })
      .then(res => {
        // Guardar o token e os dados no localStorage do browser
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        setLoading(false);
        // Login feito! Redireciona diretamente para o painel do Admin ou Gestor!
        navigate('/admin'); 
      })
      .catch(err => {
        setLoading(false);
        setErro(err.response?.data?.erro || 'Erro ao ligar ao servidor de autenticação.');
      });
  };

  return (
    // Garante que o teu <form onSubmit={handleLogin}> está a usar este handle
    // E que os teus <input> têm o value e o onChange ligados ao email e password!
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card bg-dark text-white p-4 border-secondary shadow">
        <h3 className="fw-bold text-center text-info mb-4">Entrar no VisOn</h3>
        
        {erro && <div className="alert alert-danger small py-2">{erro}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-muted small">E-mail</label>
            <input type="email" className="form-control bg-secondary text-white border-0" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@vison.pt" />
          </div>
          <div className="mb-4">
            <label className="form-label text-muted small">Password</label>
            <input type="password" className="form-control bg-secondary text-white border-0" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-info text-dark fw-bold w-100" disabled={loading}>
            {loading ? 'A verificar...' : 'Iniciar Sessão'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;