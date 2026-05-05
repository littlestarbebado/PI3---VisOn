import React, { useState } from "react";

function NovoCliente({ onClose, onCreate }) {
  const [form, setForm] = useState({
    empresa: "",
    clienteNome: "",
    clienteEmail: "",
    clienteTelefone: "",
    respNome: "",
    respEmail: "",
    respTelefone: "",
    contNome: "",
    contEmail: "",
    contTelefone: "",
  });

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  const handleSubmit = () => {
    if (!form.empresa || !form.clienteNome || !form.clienteEmail) {
      alert("Preenche os campos obrigatórios");
      return;
    }

    onCreate({
      ...form,
      role: "Cliente",
    });

    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h3>Criar Novo Cliente</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Empresa */}
        <h4>Informações da Empresa</h4>
        <input
          style={styles.input}
          placeholder="Nome da Empresa *"
          value={form.empresa}
          onChange={(e) => handleChange("empresa", e.target.value)}
        />

        {/* Cliente */}
        <h4>Cliente (Acesso ao Portal)</h4>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Nome *"
            value={form.clienteNome}
            onChange={(e) => handleChange("clienteNome", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Email *"
            value={form.clienteEmail}
            onChange={(e) => handleChange("clienteEmail", e.target.value)}
          />
        </div>

        <input
          style={styles.input}
          placeholder="Telefone"
          value={form.clienteTelefone}
          onChange={(e) =>
            handleChange("clienteTelefone", e.target.value)
          }
        />

        {/* Responsável */}
        <h4>Responsável de Segurança</h4>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Nome"
            value={form.respNome}
            onChange={(e) => handleChange("respNome", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Email"
            value={form.respEmail}
            onChange={(e) => handleChange("respEmail", e.target.value)}
          />
        </div>

        <input
          style={styles.input}
          placeholder="Telefone"
          value={form.respTelefone}
          onChange={(e) =>
            handleChange("respTelefone", e.target.value)
          }
        />

        {/* Contacto */}
        <h4>Contacto Permanente</h4>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Nome"
            value={form.contNome}
            onChange={(e) => handleChange("contNome", e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Email"
            value={form.contEmail}
            onChange={(e) => handleChange("contEmail", e.target.value)}
          />
        </div>

        <input
          style={styles.input}
          placeholder="Telefone"
          value={form.contTelefone}
          onChange={(e) =>
            handleChange("contTelefone", e.target.value)
          }
        />

        {/* Submit */}
        <button style={styles.submitBtn} onClick={handleSubmit}>
          Criar Cliente
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
    width: "420px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  submitBtn: {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default NovoCliente;