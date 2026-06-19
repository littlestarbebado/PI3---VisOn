import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function ServicosAdmin() {
  const [servicos, setServicos] = useState([]);
  const [registo, setRegisto] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        const { data } = await api.get('/conteudos/list');
        if (!ativo) return;

        const item = data.find(conteudo => conteudo.chave === 'servicos_json');
        setRegisto(item || null);
        if (item) setServicos(JSON.parse(item.valor));
      } catch (error) {
        if (!ativo) return;
        setFeedback(error.response?.data?.erro || 'Erro ao carregar serviços.');
      }
    };

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  const alterar = (index, campo, valor) => setServicos(lista => lista.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  const guardar = async () => {
    try {
      const valor = JSON.stringify(servicos);
      const resposta = registo
        ? await api.put(`/conteudos/${registo.id}`, { valor })
        : await api.post('/conteudos', { chave: 'servicos_json', valor, secao: 'servicos' });
      setRegisto(resposta.data);
      setFeedback('Serviços guardados.');
    } catch (error) { setFeedback(error.response?.data?.erro || 'Erro ao guardar serviços.'); }
  };

  return <div>
    <div className="d-flex justify-content-between mb-3"><h3 className="fw-bold">Serviços</h3><button className="btn btn-dark" onClick={() => setServicos([...servicos, { title: '', desc: '', icon: 'bi-shield-check', color: 'icon-blue' }])}>+ Novo Serviço</button></div>
    {servicos.map((item, index) => <div key={index} className="card p-3 mb-3"><input className="form-control mb-2" value={item.title || item.titulo || ''} onChange={e => alterar(index, 'title', e.target.value)} placeholder="Título" /><textarea className="form-control mb-2" value={item.desc || item.descricao || ''} onChange={e => alterar(index, 'desc', e.target.value)} placeholder="Descrição" /><button className="btn btn-sm btn-outline-danger align-self-start" onClick={() => setServicos(servicos.filter((_, i) => i !== index))}>Eliminar</button></div>)}
    {feedback && <div className="alert alert-info">{feedback}</div>}
    <button className="btn btn-dark" onClick={guardar}>Guardar Alterações</button>
  </div>;
}
