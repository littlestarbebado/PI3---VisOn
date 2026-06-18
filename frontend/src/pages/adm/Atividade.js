import React from 'react';

export default function Atividade() {

  const atividades = [
    {
      nome: 'Gestor Silva',
      acao: 'Upload de Documento',
      descricao:
        'Carregou "Relatório de Avaliação de Risco - Q1 2024" para TechCorp Solutions',
      data: '2024-03-20 14:30:00'
    },
    {
      nome: 'João Cliente',
      acao: 'Criação de Pedido',
      descricao:
        'Criou novo pedido: "Dúvidas sobre relatório de risco"',
      data: '2024-03-19 10:15:00'
    },
    {
      nome: 'Administrador',
      acao: 'Criação de Utilizador',
      descricao:
        'Criou novo gestor: gestor2@cybersec.com',
      data: '2024-03-18 09:00:00'
    },
    {
      nome: 'João Cliente',
      acao: 'Report de Incidente',
      descricao:
        'Reportou incidente: "Email de Phishing Reportado"',
      data: '2024-03-20 11:45:00'
    }
  ];

  const stats = [
    {
      titulo: 'Total de Logs',
      valor: 4,
      icon: 'bi-activity'
    },
    {
      titulo: 'Hoje',
      valor: 12,
      icon: 'bi-calendar'
    },
    {
      titulo: 'Esta Semana',
      valor: 47,
      icon: 'bi-calendar-week'
    },
    {
      titulo: 'Este Mês',
      valor: 183,
      icon: 'bi-calendar3'
    }
  ];

  return (
    <div>

      {/* HEADER */}
      <div className="mb-4">

        <h2
  style={{
    fontWeight: 800,
    fontSize: '42px',
    color: '#111827',
    marginBottom: '6px'
  }}
>
          Monitorização de Atividade
        </h2>

        <p
          style={{
            color: '#6b7280',
            margin: 0
          }}
        >
          Logs e ações dos utilizadores do sistema
        </p>

      </div>

      {/* FILTROS */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}
      >

        <div className="row g-3">

          <div className="col-md-6">

            <label
  style={{
    fontWeight: 700,
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
    fontSize: '14px'
  }}
>
  Pesquisar
</label>

            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar logs..."
            />

          </div>

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Filtrar Utilizador
            </label>

            <select
              className="form-select"
            >
              <option>
                Todos os Utilizadores
              </option>

              <option>
                Administrador
              </option>

              <option>
                Gestor Silva
              </option>

              <option>
                João Cliente
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="row g-4 mb-4">

        {stats.map((item, index) => (

          <div
            key={index}
            className="col-md-6 col-lg-3"
          >

            <div
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                padding: '1.3rem'
              }}
            >

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.85rem',
                      marginBottom: '0.3rem'
                    }}
                  >
                    {item.titulo}
                  </p>

                  <h3
  style={{
    margin: 0,
    fontWeight: 800,
    color: '#111827'
  }}
>
                    {item.valor}
                  </h3>

                </div>

                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#eef4ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem'
                  }}
                >
                  <i className={`bi ${item.icon}`}></i>
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* LISTA */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '1.5rem'
        }}
      >

        <h5
          style={{
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          Atividade Recente
        </h5><h4
  style={{
    fontWeight: 700,
    color: '#111827',
    marginBottom: '20px'
  }}
>
  Atividade Recente
</h4>
        {atividades.map((item, index) => (

          <div
            key={index}
            style={{
              background: '#f8fafc',
border: '1px solid #f1f5f9',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >

            <div className="d-flex justify-content-between">

              {/* ESQUERDA */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem'
                }}
              >

                {/* ICON */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#eef4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb'
                  }}
                >
                  <i className="bi bi-activity"></i>
                </div>

                {/* INFO */}
                <div>

                  <div className="d-flex align-items-center gap-2">

                    <h6
  style={{
    margin: 0,
    fontWeight: 700,
    color: '#111827',
    fontSize: '15px'
  }}
>
                      {item.nome}
                    </h6>

                    <span
  style={{
    background: '#f3f4f6',
    color: '#374151',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '600'
  }}
>
  {item.acao}
</span>

                  </div>

                  <p
                    style={{
                      margin: '0.4rem 0 0',
                      color: '#6b7280'
                    }}
                  >
                    {item.descricao}
                  </p>

                </div>

              </div>

              {/* DATA */}
              <small
                style={{
                  color: '#9ca3af',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.data}
              </small>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}