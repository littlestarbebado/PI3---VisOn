import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const CHAVES = ['missao_texto', 'visao_texto', 'valores_texto'];

export default function Empresa() {
  const [registos, setRegistos] = useState({});
  const [dados, setDados] = useState({ missao_texto: '', visao_texto: '', valores_texto: '' });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let ativo = true;

    api.get('/conteudos/list').then(({ data }) => {
      if (!ativo) return;

      const mapa = Object.fromEntries(data.map(item => [item.chave, item]));
      setRegistos(mapa);
      setDados(prev => ({ ...prev, ...Object.fromEntries(data.map(item => [item.chave, item.valor])) }));
    }).catch(error => setFeedback(error.response?.data?.erro || 'Erro ao carregar conteúdos.'));
    return () => {
      ativo = false;
    };
  }, []);

  const guardar = async () => {
    try {
      await Promise.all(CHAVES.map(chave => registos[chave]
        ? api.put(`/conteudos/${registos[chave].id}`, { valor: dados[chave] })
        : api.post('/conteudos', { chave, valor: dados[chave], secao: 'sobre' })
      ));
      setFeedback('Alterações guardadas.');
    } catch (error) {
      setFeedback(error.response?.data?.erro || 'Erro ao guardar conteúdos.');
    }
  };

  return <div className="card p-4">
    <h3 className="fw-bold mb-4">Informações da Empresa</h3>
    <label className="fw-semibold mb-2">Missão</label>
    <textarea className="form-control mb-3" rows="4" value={dados.missao_texto} onChange={e => setDados({ ...dados, missao_texto: e.target.value })} />
    <label className="fw-semibold mb-2">Visão</label>
    <textarea className="form-control mb-3" rows="4" value={dados.visao_texto} onChange={e => setDados({ ...dados, visao_texto: e.target.value })} />
    <label className="fw-semibold mb-2">Valores</label>
    <textarea className="form-control mb-3" rows="3" placeholder="Separados por vírgulas" value={dados.valores_texto} onChange={e => setDados({ ...dados, valores_texto: e.target.value })} />
    {feedback && <div className="alert alert-info py-2">{feedback}</div>}
    <button className="btn btn-dark align-self-start" onClick={guardar}>Guardar Alterações</button>
  </div>;
}
