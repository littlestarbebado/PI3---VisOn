import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Empresa() {

  // Estado para os campos carregados da API
  const [conteudos, setConteudos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  // Campos editáveis mapeados por chave
  const [missao, setMissao] = useState('');
  const [visao, setVisao] = useState('');
  const [valores, setValores] = useState('');
  const [heroTitulo, setHeroTitulo] = useState('');
  const [heroSub, setHeroSub] = useState('');

  // Carregar conteúdos da API ao montar o componente
  useEffect(() => {
    api.get('/conteudos/list')
      .then(res => {
        const dados = res.data;
        setConteudos(dados);

        // Preencher cada campo com o valor vindo da base de dados
        dados.forEach(c => {
          if (c.chave === 'missao_texto') setMissao(c.valor);
          if (c.chave === 'visao_texto') setVisao(c.valor);
          if (c.chave === 'valores_texto') setValores(c.valor);
          if (c.chave === 'hero_titulo') setHeroTitulo(c.valor);
          if (c.chave === 'hero_subtitulo') setHeroSub(c.valor);
        });
      })
      .catch(err => {
        console.error('Erro ao carregar conteúdos:', err);
        setMensagem({ tipo: 'erro', texto: 'Erro ao carregar conteúdos.' });
      })
      .finally(() => setCarregando(false));
  }, []);

  // Atualizar um campo na API pelo seu id
  function atualizarCampo(chave, novoValor) {
    const conteudo = conteudos.find(c => c.chave === chave);
    if (!conteudo) return Promise.resolve();
    return api.put(`/conteudos/${conteudo.id}`, { valor: novoValor });
  }

  // Guardar todas as alterações
  function guardar() {
    setGuardando(true);
    setMensagem(null);

    Promise.all([
      atualizarCampo('hero_titulo', heroTitulo),
      atualizarCampo('hero_subtitulo', heroSub),
      atualizarCampo('missao_texto', missao),
      atualizarCampo('visao_texto', visao),
      atualizarCampo('valores_texto', valores),
    ])
      .then(() => {
        setMensagem({ tipo: 'sucesso', texto: 'Alterações guardadas com sucesso!' });
      })
      .catch(err => {
        console.error('Erro ao guardar:', err);
        setMensagem({ tipo: 'erro', texto: 'Erro ao guardar alterações.' });
      })
      .finally(() => setGuardando(false));
  }

  if (carregando) {
    return <p style={{ color: '#6b7280' }}>A carregar conteúdos...</p>;
  }

  return (
    <div>

      <h2 style={{ fontWeight: 800, marginBottom: '0.3rem' }}>
        Empresa
      </h2>

      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Gerir informações institucionais — as alterações refletem-se no site público
      </p>

      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          maxWidth: '900px'
        }}
      >

        {/* HERO */}
        <h5 style={{ fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>
          Página Inicial
        </h5>

        <div className="mb-4">
          <label style={{ fontWeight: 600, marginBottom: '0.6rem', display: 'block' }}>
            Título Principal (Hero)
          </label>
          <input
            type="text"
            className="form-control"
            value={heroTitulo}
            onChange={e => setHeroTitulo(e.target.value)}
            style={{ background: '#f9fafb' }}
          />
        </div>

        <div className="mb-4">
          <label style={{ fontWeight: 600, marginBottom: '0.6rem', display: 'block' }}>
            Subtítulo (Hero)
          </label>
          <textarea
            className="form-control"
            rows={2}
            value={heroSub}
            onChange={e => setHeroSub(e.target.value)}
            style={{ background: '#f9fafb' }}
          />
        </div>

        <hr style={{ margin: '1.5rem 0', borderColor: '#e5e7eb' }} />

        {/* MISSÃO / VISÃO / VALORES */}
        <h5 style={{ fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>
          Página Sobre
        </h5>

        <div className="mb-4">
          <label style={{ fontWeight: 600, marginBottom: '0.6rem', display: 'block' }}>
            Missão
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={missao}
            onChange={e => setMissao(e.target.value)}
            style={{ background: '#f9fafb' }}
          />
        </div>

        <div className="mb-4">
          <label style={{ fontWeight: 600, marginBottom: '0.6rem', display: 'block' }}>
            Visão
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={visao}
            onChange={e => setVisao(e.target.value)}
            style={{ background: '#f9fafb' }}
          />
        </div>

        <div className="mb-4">
          <label style={{ fontWeight: 600, marginBottom: '0.6rem', display: 'block' }}>
            Valores
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={valores}
            onChange={e => setValores(e.target.value)}
            style={{ background: '#f9fafb' }}
          />
        </div>

        {/* MENSAGENS DE FEEDBACK */}
        {mensagem && (
          <div
            className={`alert ${mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-danger'} py-2`}
            style={{ fontSize: '0.9rem' }}
          >
            {mensagem.texto}
          </div>
        )}

        {/* BOTÃO GUARDAR */}
        <button
          onClick={guardar}
          disabled={guardando}
          className="btn"
          style={{
            background: '#050b23',
            color: '#fff',
            borderRadius: '10px',
            padding: '0.7rem 1.3rem',
            fontWeight: 600
          }}
        >
          {guardando ? 'A guardar...' : 'Guardar Alterações'}
        </button>

      </div>

    </div>
  );
}