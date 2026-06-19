# CyberBox Secur — Plataforma de Cibersegurança

## Estrutura do Projeto

```
cyberbox-secur/
├── backend/          ← API Express + Sequelize (SQLite)
│   ├── src/
│   │   ├── models/   ← Admin, Artigo, ConteudoInstitucional, MensagemContacto
│   │   ├── routes/   ← auth, conteudos, artigos, contacto
│   │   ├── middlewares/ ← auth.js (JWT)
│   │   └── server.js
│   └── package.json
│
└── frontend/         ← React + Bootstrap 5
    ├── src/
    │   ├── components/  ← Navbar, Footer, logótipo CyberBox
    │   ├── context/     ← AuthContext
    │   ├── services/    ← api.js (axios)
    │   ├── pages/
    │   │   ├── public/  ← Home, Sobre, Servicos, Artigos, Contactos, Login
    │   │   └── adm/     ← AdminLayout (Dashboard, Artigos, Conteúdos, Mensagens)
    │   ├── App.js
    │   └── App.css
    └── package.json
```

## Instalação e Arranque

### 1. Backend
```bash
cd backend
npm install
npm run dev
# Servidor na porta 5000
# Admin criado: admin@vison.pt / Admin@1234
```

### 2. Frontend (terminal separado)
```bash
cd frontend
npm install
npm start
# App na porta 3000
```

## Rotas Públicas
- `/` — Página Inicial
- `/sobre` — Sobre a CyberBox Secur (Missão, Visão, Valores)
- `/servicos` — Serviços de Cibersegurança
- `/artigos` — Notícias e Artigos
- `/contactos` — Formulário de Contacto
- `/login` — Área de Cliente (Admin/Gestor/Cliente)

## Área de Admin
- `/admin` — Dashboard
- `/admin/artigos` — Gerir artigos (CRUD)
- `/admin/conteudos` — Editar textos do site
- `/admin/mensagens` — Ver mensagens de contacto

## API Endpoints
```
POST   /api/auth/login
GET    /api/auth/me

GET    /api/conteudos           ← público
GET    /api/conteudos/list      ← admin
PUT    /api/conteudos/:id       ← admin
POST   /api/conteudos/seed      ← admin

GET    /api/artigos             ← público (só publicados)
GET    /api/artigos/admin       ← admin (todos)
GET    /api/artigos/:slug       ← público
POST   /api/artigos             ← admin
PUT    /api/artigos/:id         ← admin
DELETE /api/artigos/:id         ← admin

POST   /api/contacto            ← público
GET    /api/contacto            ← admin
PUT    /api/contacto/:id/lida   ← admin
DELETE /api/contacto/:id        ← admin
```
