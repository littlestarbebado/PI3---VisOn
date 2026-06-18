const express = require('express');
const cors = require('cors'); 
const app = express();

// ==========================================
// 1. TOP0: Onde ficam todos os 'require'
// ==========================================
const dashboardRoutes = require('./routes/dashboardRoute');
const documentRoutes = require('./routes/documentRoute');
const incidentRoutes = require('./routes/incidentRoute'); // <-- ESTA É A NOVA LINHA DO TOPO!

app.set('port', process.env.PORT || 3000);

app.use(cors()); 
app.use(express.json());

// ==========================================
// 2. MEIO: Onde ativamos as rotas do projeto
// ==========================================
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/incidents', incidentRoutes); // <-- ESTA É A NOVA LINHA DO MEIO!

// ==========================================
// 3. FIM: Onde o servidor efetivamente arranca
// ==========================================
app.listen(app.get('port'), () => {
  console.log('Servidor a bombar na porta ' + app.get('port'));
});