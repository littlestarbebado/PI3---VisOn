export default function Contactos() {

  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    carregarMensagens();
  }, []);

  const carregarMensagens = async () => {
    const res = await api.get('/contacto');
    setMensagens(res.data);
  };

  const apagarMensagem = async (id) => {
    await api.delete(`/contacto/${id}`);
    carregarMensagens();
  };

  return (
    <div>

      <h2>Mensagens de Contacto</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Assunto</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          {mensagens.map((msg) => (
            <tr key={msg.id}>

              <td>{msg.nome}</td>
              <td>{msg.email}</td>
              <td>{msg.assunto}</td>

              <td>

                <button>
                  Ver
                </button>

                <button
                  onClick={() => apagarMensagem(msg.id)}
                >
                  Apagar
                </button>

              </td>

            </tr>
          ))}

        </tbody>
      </table>

    </div>
  );
}