import React, { useState } from "react";

function ConteudosArtigos() {
  const [artigos, setArtigos] = useState([
    {
      titulo: "NIS2: O que muda para as empresas portuguesas",
      descricao:
        "A Diretiva NIS2 traz novas obrigações para empresas de setores essenciais e importantes.",
      autor: "Dr. António Silva",
      data: "2024-03-15",
      tag: "Regulamentação",
    },
    {
      titulo: "Pentesting: Como proteger a sua infraestrutura",
      descricao:
        "Os testes de penetração são essenciais para identificar vulnerabilidades antes dos atacantes.",
      autor: "Eng. Maria Costa",
      data: "2024-03-10",
      tag: "Segurança Ofensiva",
    },
    {
      titulo: "Avaliação de Maturidade em Cibersegurança",
      descricao:
        "Conheça os níveis de maturidade e como evoluir a postura de segurança da sua organização.",
      autor: "Dr. João Pereira",
      data: "2024-03-05",
      tag: "Governança",
    },
  ]);

  const removerArtigo = (index) => {
    const novos = artigos.filter((_, i) => i !== index);
    setArtigos(novos);
  };

  const adicionarArtigo = () => {
    setArtigos([
      ...artigos,
      {
        titulo: "Novo Artigo",
        descricao: "",
        autor: "Autor",
        data: "2024-01-01",
        tag: "Categoria",
      },
    ]);
  };

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <h1>Gestão de Conteúdos</h1>
        <p style={{ color: "gray" }}>
          Gerir conteúdos do website institucional
        </p>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={styles.tab}>Empresa</button>
          <button style={styles.tab}>Serviços</button>
          <button style={styles.activeTab}>Artigos</button>
        </div>

        {/* Botão topo */}
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          <button style={styles.addBtn} onClick={adicionarArtigo}>
            + Novo Artigo
          </button>
        </div>

        {/* Lista de artigos */}
        <div style={styles.list}>
          {artigos.map((a, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.header}>
                <strong>{a.titulo}</strong>

                <div>
                  <button style={styles.iconBtn}>✏️</button>
                  <button
                    style={styles.iconBtn}
                    onClick={() => removerArtigo(i)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p style={{ margin: "8px 0", color: "#555" }}>
                {a.descricao}
              </p>

              <div style={styles.meta}>
                <span>
                  {a.autor} · {a.data}
                </span>

                <span style={styles.tag}>{a.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>VIS</h2>
      <div style={{ marginTop: "20px", lineHeight: "2", color: "#cbd5f5" }}>
        <p>Dashboard</p>
        <p style={{ color: "white", fontWeight: "bold" }}>
          Conteúdos
        </p>
        <p>Utilizadores</p>
        <p>Documentos</p>
        <p>Atividade</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    fontFamily: "Arial",
    background: "#f4f6f9",
  },
  sidebar: {
    width: "220px",
    background: "#0f172a",
    color: "white",
    height: "100vh",
    padding: "20px",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    margin: "15px 0",
  },
  tab: {
    padding: "8px 14px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  activeTab: {
    padding: "8px 14px",
    background: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },
  addBtn: {
    padding: "8px 12px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "12px",
    color: "gray",
  },
  tag: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
  },
  iconBtn: {
    marginLeft: "5px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
};

export default ConteudosArtigos;