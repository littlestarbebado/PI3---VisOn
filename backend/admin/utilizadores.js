import React, { useState } from "react";
import NovoGestor from "./novogestor";
import NovoCliente from "./novocliente";

function Utilizadores() {
  const [users, setUsers] = useState([
    {
      nome: "Administrador",
      email: "admin@cybersec.com",
      role: "Admin",
      telefone: "",
      empresa: "",
    },
    {
      nome: "Gestor Silva",
      email: "gestor@cybersec.com",
      role: "Gestor",
      telefone: "+351 912 345 678",
    },
    {
      nome: "João Cliente",
      email: "cliente@empresa.com",
      role: "Cliente",
      telefone: "+351 913 456 789",
      empresa: "TechCorp Solutions",
    },
  ]);

  // 🔥 estados dos modais
  const [showGestor, setShowGestor] = useState(false);
  const [showCliente, setShowCliente] = useState(false);

  const removerUser = (index) => {
    const novos = users.filter((_, i) => i !== index);
    setUsers(novos);
  };

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <h1>Gestão de Utilizadores</h1>
        <p style={{ color: "gray" }}>
          Criar e gerir utilizadores do sistema
        </p>

        {/* BOTÕES */}
        <div style={{ margin: "15px 0" }}>
          <button
            style={styles.primaryBtn}
            onClick={() => setShowGestor(true)}
          >
            + Criar Gestor
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => setShowCliente(true)}
          >
            + Criar Cliente
          </button>
        </div>

        {/* LISTA */}
        <div style={styles.card}>
          <h3>Utilizadores Registados</h3>

          {users.map((u, i) => (
            <div key={i} style={styles.userCard}>
              <div>
                <strong>
                  {u.nome}{" "}
                  <span style={getRoleStyle(u.role)}>
                    {u.role}
                  </span>
                </strong>

                <p style={{ margin: "5px 0", color: "#555" }}>
                  {u.email}
                </p>

                {u.telefone && (
                  <p style={{ fontSize: "12px", color: "gray" }}>
                    {u.telefone}
                  </p>
                )}

                {u.empresa && (
                  <p style={{ fontSize: "12px", color: "#2563eb" }}>
                    {u.empresa}
                  </p>
                )}
              </div>

              <div>
                <button style={styles.iconBtn}>🔒</button>
                <button
                  style={styles.iconBtn}
                  onClick={() => removerUser(i)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 MODAIS (AQUI NO FIM) */}
      {showGestor && (
        <NovoGestor
          onClose={() => setShowGestor(false)}
          onCreate={(novo) => setUsers([...users, novo])}
        />
      )}

      {showCliente && (
        <NovoCliente
          onClose={() => setShowCliente(false)}
          onCreate={(novo) => setUsers([...users, novo])}
        />
      )}
    </div>
  );
}

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>VIS</h2>
      <div style={{ marginTop: "20px", lineHeight: "2", color: "#cbd5f5" }}>
        <p>Dashboard</p>
        <p>Conteúdos</p>
        <p style={{ color: "white", fontWeight: "bold" }}>
          Utilizadores
        </p>
        <p>Documentos</p>
        <p>Atividade</p>
      </div>
    </div>
  );
}

const getRoleStyle = (role) => {
  const base = {
    marginLeft: "8px",
    padding: "2px 6px",
    borderRadius: "6px",
    fontSize: "11px",
    color: "white",
  };

  if (role === "Admin") return { ...base, background: "#dc2626" };
  if (role === "Gestor") return { ...base, background: "#2563eb" };
  return { ...base, background: "#6b7280" };
};

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
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
  },
  userCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "8px",
    marginTop: "10px",
  },
  primaryBtn: {
    padding: "8px 12px",
    marginRight: "10px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "8px 12px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  iconBtn: {
    marginLeft: "5px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
};

export default Utilizadores;