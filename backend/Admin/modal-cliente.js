const overlay  = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const submitBtn = document.getElementById('submitBtn');

closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.style.display = 'none';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') overlay.style.display = 'none';
});

submitBtn.addEventListener('click', () => {
  const empresaNome     = document.getElementById('empresaNome').value.trim();
  const clienteNome     = document.getElementById('clienteNome').value.trim();
  const clienteEmail    = document.getElementById('clienteEmail').value.trim();
  const clienteTelefone = document.getElementById('clienteTelefone').value.trim();

  if (!empresaNome || !clienteNome || !clienteEmail || !clienteTelefone) {
    alert('Por favor preenche todos os campos obrigatórios (*).');
    return;
  }

  const payload = {
    empresa: { nome: empresaNome },
    cliente: { nome: clienteNome, email: clienteEmail, telefone: clienteTelefone },
    seguranca: {
      nome:     document.getElementById('segNome').value.trim(),
      email:    document.getElementById('segEmail').value.trim(),
      telefone: document.getElementById('segTelefone').value.trim(),
    },
    contacto: {
      nome:     document.getElementById('contNome').value.trim(),
      email:    document.getElementById('contEmail').value.trim(),
      telefone: document.getElementById('contTelefone').value.trim(),
    },
  };

  console.log('Novo Cliente:', payload);
  overlay.style.display = 'none';
});