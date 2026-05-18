// scripts/script.js — Helper para verificar a estrutura do projeto
const fs = require('fs');
const path = require('path');

function checkExists(p) {
  return fs.existsSync(p) ? '✅' : '❌';
}

const base = path.join(__dirname, '..');
const checks = [
  ['backend/src/server.js', 'Backend server'],
  ['backend/src/models/index.js', 'Models index'],
  ['backend/src/models/Admin.js', 'Model Admin'],
  ['backend/src/models/Artigo.js', 'Model Artigo'],
  ['backend/src/models/ConteudoInstitucional.js', 'Model Conteudo'],
  ['backend/src/models/MensagemContacto.js', 'Model Mensagem'],
  ['backend/src/routes/auth.js', 'Route auth'],
  ['backend/src/routes/artigos.js', 'Route artigos'],
  ['backend/src/routes/conteudos.js', 'Route conteudos'],
  ['backend/src/routes/contacto.js', 'Route contacto'],
  ['frontend/src/App.js', 'Frontend App'],
  ['frontend/src/App.css', 'Frontend CSS'],
  ['frontend/src/pages/public/Home.js', 'Page Home'],
  ['frontend/src/pages/public/Sobre.js', 'Page Sobre'],
  ['frontend/src/pages/public/Servicos.js', 'Page Servicos'],
  ['frontend/src/pages/public/Artigos.js', 'Page Artigos'],
  ['frontend/src/pages/public/Contactos.js', 'Page Contactos'],
  ['frontend/src/pages/public/Login.js', 'Page Login'],
  ['frontend/src/pages/adm/AdminLayout.js', 'Admin Layout'],
];

console.log('\n🔍 Verificação da estrutura do projeto VisOn:\n');
checks.forEach(([file, label]) => {
  console.log(`  ${checkExists(path.join(base, file))} ${label} — ${file}`);
});
console.log('\n💡 Para iniciar:\n  cd backend && npm install && npm run dev\n  cd frontend && npm install && npm start\n');
