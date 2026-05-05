import React, { useState } from "react";

function ConteudoServicos() {
  const [servicos, setServicos] = useState([
    {
      titulo: "Avaliação de Maturidade IT",
      descricao:
        "Análise completa do nível de maturidade da sua infraestrutura tecnológica e práticas de segurança.",
    },
    {
      titulo: "Testes de Penetração (PenTest)",
      descricao:
        "Simulação de ataques reais para identificar vulnerabilidades antes dos atacantes.",
    },
    {
      titulo: "Conformidade NIS II",
      descricao:
        "Apoio à implementação e manutenção da conformidade com as diretivas europeias de cibersegurança.",
    },
    {
      titulo: "Formação em Cibersegurança",
      descricao:
        "Programas de formação personalizados para equipas técnicas e utilizadores finais.",
    },
    {
      titulo: "Gestão de Incidentes",
      descricao:
        "Apoio na deteção, resposta e recuperação de incidentes de segurança.",
    },
    {
      titulo: "Consultoria em Cibersegurança",
      descricao:
        "Aconselhamento estratégico para definição e implementação de políticas de segurança.",
    },
  ]);

  const removerServico = (index) => {
    const novos = servicos.filter((_, i) => i !== index);
    setServicos(novos);
  };

  const adicionarServico = () => {
    setServicos([
      ...servicos,
      { titulo: "Novo Serviço", descricao: "" },
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
          <button style={styles.activeTab}>Serviços</button>
          <button style={styles.tab}>Artigos</button>
        </div>

        {/* Botão topo */}
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          <button style={styles.addBtn} onClick={adicionarServico}>
            + Novo Serviço
          </button>
        </div>

        {/* Grid serviços */}
        <div style={styles.grid}>
          {servicos.map((s, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardHeader}>
                <strong>{s.titulo}</strong>

                <div>
                  <button style={styles.iconBtn}>✏️</button>
                  <button
                    style={styles.iconBtn}
                    onClick={() => removerServico(i)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p style={{ marginTop: "10px", color: "#555" }}>
                {s.descricao}
              </p>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: "5px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
};

export default ConteudoServicos;