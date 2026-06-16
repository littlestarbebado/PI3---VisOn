import React, { useState } from 'react';

import Empresa from './Empresa';
import ServicosAdmin from './ServicosAdmin';
import ArtigosAdmin from './ArtigosAdmin';

export default function Conteudos() {

  const [tab, setTab] = useState('empresa');

  return (
    <div>

      <h2
        style={{
          fontWeight: 800,
          marginBottom: '0.3rem'
        }}
      >
        Gestão de Conteúdos
      </h2>

      <p
        style={{
          color: '#6b7280',
          marginBottom: '1.5rem'
        }}
      >
        Gerir conteúdos do site institucional
      </p>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '2rem'
        }}
      >

        <button
          onClick={() => setTab('empresa')}
          className={`btn ${tab === 'empresa' ? 'btn-dark' : 'btn-light'}`}
        >
          Empresa
        </button>

        <button
          onClick={() => setTab('servicos')}
          className={`btn ${tab === 'servicos' ? 'btn-dark' : 'btn-light'}`}
        >
          Serviços
        </button>

        <button
          onClick={() => setTab('artigos')}
          className={`btn ${tab === 'artigos' ? 'btn-dark' : 'btn-light'}`}
        >
          Artigos
        </button>

      </div>

      {tab === 'empresa' && <Empresa />}
      {tab === 'servicos' && <ServicosAdmin />}
      {tab === 'artigos' && <ArtigosAdmin />}

    </div>
  );
}