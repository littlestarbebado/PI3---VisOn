
const overlay   = document.getElementById('overlay');
const closeBtn  = document.getElementById('closeBtn');
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
  const nome     = document.getElementById('nome').value.trim();
  const email    = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !email) {
    alert('Por favor preenche os campos obrigatórios (Nome e Email).');
    return;
  }

  console.log('Novo Gestor:', { nome, email, telefone });
  overlay.style.display = 'none';
});