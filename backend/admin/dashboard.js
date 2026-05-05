import React from "react";

const stats = [
  { label: "Clientes Ativos", value: 2 },
  { label: "Utilizadores", value: 8 },
  { label: "Documentos", value: 3 },
  { label: "Atividade (Hoje)", value: 12 },
];

const quickActions = [
  "Gerir Conteúdos do Site",
  "Criar Novo Utilizador",
  "Gerir Documentos",
  "Ver Logs de Atividade",
];

const recentClients = [
  {
    name: "TechCorp Solutions",
    email: "contact@techcorp.pt",
    score: 75,
    date: "2024-01-15",
  },
  {
    name: "Digital Innovations Lda",
    email: "info@digitalinnovations.pt",
    score: 62,
    date: "2024-02-20",
  },
];

const activity = [
  {
    user: "Gestor Silva",
    action: "Upload de Documento",
    desc: "Carregou 'Relatório de Avaliação de Risco - Q1 2024'",
    time: "2024-03-20 14:30:00",
  },
  {
    user: "João Cliente",
    action: "Criação de Pedido",
    desc: "Novo pedido: 'Dúvidas sobre relatório de risco'",
    time: "2024-03-19 10:15:00",
  },
  {
    user: "Administrador",
    action: "Criação de Utilizador",
    desc: "Criou novo gestor: gestor2@cybersec.com",
    time: "2024-03-18 09:00:00",
  },
];

function Dashboard() {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <h1>Dashboard Administrador</h1>
        <p style={{ color: "gray" }}>
          Visão geral do sistema e gestão
        </p>

        {/* Stats */}
        <div style={styles.stats}>
          {stats.map((s, i) => (
            <div key={i} style={styles.card}>
              <p>{s.label}</p>
              <h2>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Ações Rápidas</h3>
            {quickActions.map((a, i) => (
              <button key={i} style={styles.actionBtn}>
                {a}
              </button>
            ))}
          </div>

          <div style={styles.card}>
            <h3>Clientes Recentes</h3>
            {recentClients.map((c, i) => (
              <div key={i} style={styles.client}>
                <div>
                  <strong>{c.name}</strong>
                  <p>{c.email}</p>
                </div>
                <div style={{ textAlign: "right", color: "#2563eb" }}>
                  <span>Score: {c.score}</span>
                  <br />
                  <small>{c.date}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={styles.card}>
          <h3>Atividade Recente</h3>
          {activity.map((a, i) => (
            <div key={i} style={styles.activity}>
              <div style={styles.dot}></div>
              <div style={{ flex: 1 }}>
                <strong>{a.user}</strong>
                <p>{a.action}</p>
                <small>{a.desc}</small>
              </div>
              <span style={{ fontSize: "12px", color: "gray" }}>
                {a.time}
              </span>
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
        <p style={{ color: "white", fontWeight: "bold" }}>Dashboard</p>
        <p>Conteúdos</p>
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
  stats: {
    display: "flex",
    gap: "15px",
    margin: "20px 0",
  },
  grid: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
  },
  actionBtn: {
    display: "block",
    width: "100%",
    margin: "8px 0",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    background: "#f9fafb",
    cursor: "pointer",
  },
  client: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  activity: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
  dot: {
    width: "8px",
    height: "8px",
    background: "#2563eb",
    borderRadius: "50%",
  },
};

export default Dashboard;