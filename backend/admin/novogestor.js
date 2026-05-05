import React, { useState } from "react";

function NovoGestor({ onClose, onCreate }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  const handleSubmit = () => {
    if (!form.nome || !form.email) {
      alert("Nome e Email são obrigatórios");
      return;
    }

    onCreate({
      ...form,
      role: "Gestor",
    });

    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h3>Criar Novo Gestor</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Form */}
        <div>
          <label>Nome *</label>
          <input
            style={styles.input}
            value={form.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
          />

          <label>Email *</label>
          <input
            style={styles.input}
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <label>Telefone</label>
          <input
            style={styles.input}
            value={form.telefone}
            onChange={(e) => handleChange("telefone", e.target.value)}
          />
        </div>

        {/* Footer */}
        <button style={styles.submitBtn} onClick={handleSubmit}>
          Criar Gestor
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "350px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0 12px 0",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  submitBtn: {
    width: "100%",
    padding: "10px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default NovoGestor;