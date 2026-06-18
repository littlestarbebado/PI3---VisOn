const express = require('express');
const cors = require('cors'); 
const app = express();

// 1. IMPORTAR AS ROTAS (Fica no topo, junto aos outros 'require')
const dashboardRoutes = require('./routes/dashboardRoute');
const documentRoutes = require('./routes/documentRoute'); // <-- ADICIONA ESTA LINHA AQUI!

app.set('port', process.env.PORT || 3000);

app.use(cors()); 
app.use(express.json());

// 2. USAR AS ROTAS (Fica aqui no meio, antes do app.listen)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/documents', documentRoutes); // <-- ADICIONA ESTA LINHA AQUI!

// 3. ARRANCAR O SERVIDOR (Fica sempre no fim de tudo)
app.listen(app.get('port'), () => {
  console.log('Servidor a bombar na porta ' + app.get('port'));
});