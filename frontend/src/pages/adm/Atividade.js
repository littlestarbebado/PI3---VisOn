import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

export default function Atividade() {
  const [atividades, setAtividades] = useState([]);
  const [stats, setStats] = useState({ total: 0, atividadeHoje: 0, estaSemana: 0, esteMes: 0 });
  const [pesquisa, setPesquisa] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    Promise.all([api.get('/logs'), api.get('/logs/stats')])
      .then(([logs, resumo]) => { setAtividades(logs.data || []); setStats(resumo.data); })
      .catch(error => setErro(error.response?.data?.erro || 'Não foi possível carregar a atividade.'));
  }, []);

  const filtradas = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) return atividades;
    return atividades.filter(item => [item.utilizador, item.acao, item.detalhes].some(valor => String(valor || '').toLowerCase().includes(termo)));
  }, [atividades, pesquisa]);

  const cards = [
    ['Total de Logs', stats.total], ['Hoje', stats.atividadeHoje],
    ['Esta Semana', stats.estaSemana], ['Este Mês', stats.esteMes]
  ];

  return (
    <div>
      <h2 className="fw-bold">Monitorização de Atividade</h2>
      <p className="text-muted mb-4">Logs e ações dos utilizadores do sistema</p>
      {erro && <div className="alert alert-danger">{erro}</div>}
      <input className="form-control mb-4" placeholder="Pesquisar logs..." value={pesquisa} onChange={e => setPesquisa(e.target.value)} />
      <div className="row g-3 mb-4">{cards.map(([titulo, valor]) => <div key={titulo} className="col-md-3"><div className="card p-3"><small className="text-muted">{titulo}</small><h3 className="mb-0">{valor || 0}</h3></div></div>)}</div>
      <div className="card border-0 shadow-sm"><div className="card-header bg-white fw-bold">Atividade Recente</div>
        <div className="list-group list-group-flush">{filtradas.length === 0 ? <div className="p-4 text-muted">Nenhuma atividade encontrada.</div> : filtradas.map(item => (
          <div key={item.id} className="list-group-item py-3"><div className="d-flex justify-content-between gap-3"><div><strong>{item.utilizador}</strong> · {item.acao}<div className="text-muted small">{item.detalhes}</div></div><small className="text-muted text-nowrap">{new Date(item.createdAt).toLocaleString('pt-PT')}</small></div></div>
        ))}</div>
      </div>
    </div>
  );
}
