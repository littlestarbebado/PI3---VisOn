import React, { useState } from "react";

function Conteudos() {
  const [valores, setValores] = useState([
    { titulo: "Confiança", descricao: "" },
    { titulo: "Excelência", descricao: "" },
    { titulo: "Inovação", descricao: "" },
    { titulo: "Responsabilidade", descricao: "" },
  ]);

  const adicionarValor = () => {
    setValores([...valores, { titulo: "", descricao: "" }]);
  };

  const atualizarValor = (index, campo, valor) => {
    const novos = [...valores];
    novos[index][campo] = valor;
    setValores(novos);
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
          <button style={styles.activeTab}>Empresa</button>
          <button style={styles.tab}>Serviços</button>
          <button style={styles.tab}>Artigos</button>
        </div>

        <div style={styles.card}>
          <h3>Informações da Empresa</h3>

          <label>Missão</label>
          <textarea style={styles.input} />

          <label>Visão</label>
          <textarea style={styles.input} />

          <label>Valores</label>

          {valores.map((v, i) => (
            <div key={i} style={styles.valorCard}>
              <input
                style={styles.input}
                placeholder="Título do valor"
                value={v.titulo}
                onChange={(e) =>
                  atualizarValor(i, "titulo", e.target.value)
                }
              />
              <textarea
                style={styles.input}
                placeholder="Descrição do valor"
                value={v.descricao}
                onChange={(e) =>
                  atualizarValor(i, "descricao", e.target.value)
                }
              />
            </div>
          ))}

          <button style={styles.addBtn} onClick={adicionarValor}>
            + Adicionar Valor
          </button>

          <button style={styles.saveBtn}>
            Guardar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>VIS</h2>
      <div style={styles.menu}>
        <p>Dashboard</p>
        <p style={{ fontWeight: "bold" }}>Conteúdos</p>
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
  menu: {
    marginTop: "20px",
    lineHeight: "2",
    color: "#cbd5f5",
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
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0 15px 0",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  valorCard: {
    border: "1px solid #eee",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  addBtn: {
    padding: "8px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  saveBtn: {
    marginTop: "15px",
    padding: "10px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Conteudos;