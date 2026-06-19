require('dotenv').config();

const bcrypt = require('bcryptjs');
const {
  sequelize,
  Cliente,
  AtivoTecnologico,
  Incidente,
  Documento,
  Pedido,
  MensagemPedido,
  Artigo
} = require('../src/models');

const DEMO_PASSWORD = 'CyberDemo@2026';

const clientes = [
  ['Atlantic Health Systems', 'seguranca@atlantic-health.example', '+351 211 450 101', 82, 'Marta Varela'],
  ['Lusitania Logistics', 'it@lusitania-logistics.example', '+351 229 310 220', 64, 'Rui Mendonca'],
  ['NovaGrid Energy', 'soc@novagrid-energy.example', '+351 213 880 340', 91, 'Ines Carvalho'],
  ['BlueHarbor Finance', 'security@blueharbor-finance.example', '+351 210 740 115', 73, 'Miguel Serra'],
  ['VerdeCampo Foods', 'infra@verdecampo-foods.example', '+351 234 620 410', 57, 'Ana Pires'],
  ['Orion Public Services', 'ciso@orion-services.example', '+351 218 990 620', 88, 'Tiago Matos'],
  ['MedCore Diagnostics', 'sistemas@medcore-diagnostics.example', '+351 239 510 305', 69, 'Sofia Almeida'],
  ['NorthWave Telecom', 'cyber@northwave-telecom.example', '+351 225 770 880', 94, 'Diogo Neves'],
  ['UrbanKey Properties', 'tecnologia@urbankey-properties.example', '+351 214 330 715', 48, 'Carla Faria'],
  ['EduSphere Academy', 'informatica@edusphere-academy.example', '+351 232 105 490', 76, 'Pedro Lopes']
];

const ativos = [
  ['Cluster HIS Producao', 'Servidor Linux', 'Critica', 'Cluster que suporta o sistema clinico e os registos de pacientes.'],
  ['Gateway Imagiologia', 'Appliance DICOM', 'Alta', 'Gateway de integracao com equipamentos de diagnostico.'],
  ['ERP Logistico Central', 'Aplicacao Web', 'Critica', 'Planeamento de rotas, armazens e expedicoes nacionais.'],
  ['Firewall Porto', 'Firewall Next-Gen', 'Alta', 'Perimetro principal do centro operacional do Porto.'],
  ['SCADA Subestacao Norte', 'Sistema OT', 'Critica', 'Supervisao e controlo de equipamentos da rede eletrica.'],
  ['Historian Industrial', 'Base de Dados', 'Alta', 'Repositorio de telemetria e eventos operacionais.'],
  ['Core Banking API', 'API', 'Critica', 'Servicos transacionais consumidos pelos canais digitais.'],
  ['Data Warehouse Risco', 'Base de Dados', 'Alta', 'Informacao financeira e modelos internos de risco.'],
  ['ERP Fabril', 'Aplicacao Empresarial', 'Alta', 'Gestao de producao, stocks e fornecedores.'],
  ['Rede IoT Frio', 'IoT', 'Alta', 'Sensores de temperatura da cadeia de frio.'],
  ['Portal do Cidadao', 'Aplicacao Web', 'Critica', 'Prestacao digital de servicos publicos.'],
  ['Identity Provider', 'Servico IAM', 'Critica', 'Autenticacao central de colaboradores e parceiros.'],
  ['LIMS Laboratorial', 'Aplicacao Clinica', 'Critica', 'Gestao de amostras e resultados laboratoriais.'],
  ['Servidor Integracoes HL7', 'Servidor Windows', 'Alta', 'Integracao entre sistemas clinicos e administrativos.'],
  ['SBC Voz Empresarial', 'Telecomunicacoes', 'Critica', 'Controlo e protecao de sessoes de voz.'],
  ['Plataforma OSS', 'Aplicacao Empresarial', 'Alta', 'Operacao e monitorizacao da rede de telecomunicacoes.'],
  ['CRM Imobiliario', 'SaaS', 'Media', 'Gestao comercial, contratos e dados de clientes.'],
  ['NAS Projetos', 'Armazenamento', 'Alta', 'Documentacao tecnica, plantas e contratos.'],
  ['LMS Academico', 'Aplicacao Web', 'Alta', 'Plataforma de aprendizagem e avaliacao online.'],
  ['Microsoft 365 Tenant', 'Cloud SaaS', 'Alta', 'Email, colaboracao e identidade dos utilizadores.']
];

const incidentes = [
  ['Phishing dirigido', 'Medio', 'Mensagem falsa de renovacao de credenciais enviada a profissionais clinicos.', 'Bloqueio do dominio, reset das contas afetadas e pesquisa de indicadores.', 'Resolvido'],
  ['Ransomware', 'Critico', 'Tentativa de cifragem detetada num servidor do armazem secundario.', 'Isolamento do segmento, recolha forense e restauracao a partir de backup.', 'Em Analise'],
  ['Acesso nao autorizado', 'Alto', 'Conta de manutencao OT utilizada fora da janela autorizada.', 'Conta suspensa, chaves rodadas e revisao dos acessos privilegiados.', 'Em Analise'],
  ['Exposicao de dados', 'Alto', 'Bucket de exportacoes financeiras ficou acessivel por configuracao incorreta.', 'Acesso removido, logs preservados e analise de dados potencialmente consultados.', 'Resolvido'],
  ['Malware em endpoint', 'Medio', 'EDR bloqueou um loader num portatil da equipa comercial.', 'Endpoint isolado, imagem forense recolhida e credenciais alteradas.', 'Resolvido'],
  ['Ataque DDoS', 'Alto', 'Pico de trafego afetou temporariamente o portal de servicos.', 'Ativacao de mitigacao no fornecedor e reforco das regras de rate limiting.', 'Resolvido'],
  ['Credenciais comprometidas', 'Alto', 'Login anomalo numa conta com acesso ao sistema laboratorial.', 'Revogacao de sessoes, MFA reposto e auditoria dos acessos recentes.', 'Em Analise'],
  ['Indisponibilidade de servico', 'Medio', 'Falha de configuracao interrompeu parte da plataforma OSS.', 'Rollback da alteracao e abertura de analise de causa raiz.', 'Resolvido'],
  ['Perda de equipamento', 'Medio', 'Portatil corporativo perdido durante deslocacao profissional.', 'Remote wipe solicitado, tokens revogados e incidente comunicado.', 'Pendente'],
  ['Business Email Compromise', 'Alto', 'Pedido fraudulento de alteracao de IBAN recebido pela tesouraria.', 'Pagamento bloqueado, remetente isolado e equipa financeira alertada.', 'Resolvido']
];

const documentos = [
  [0, 'Relatorio de Avaliacao de Vulnerabilidades Q2', 'Pen Test', 'Concluido', 'Resultados tecnicos e recomendacoes priorizadas.'],
  [0, 'Politica de Controlo de Acessos Clinicos', 'Documentacao', 'Concluido', 'Politica aprovada para acessos a sistemas de saude.'],
  [1, 'Evidencias de Segmentacao de Rede', 'Evidencia', 'Em Analise', 'Capturas e configuracoes da segmentacao dos armazens.'],
  [1, 'Plano de Continuidade Logistica', 'Documento', 'Concluido', 'Procedimentos de continuidade para operacoes criticas.'],
  [2, 'Pentest Perimetro OT', 'Pen Test', 'Em Analise', 'Teste controlado aos ativos expostos da rede industrial.'],
  [2, 'Inventario de Sistemas Essenciais', 'Evidencia', 'Concluido', 'Inventario validado dos sistemas essenciais NIS2.'],
  [3, 'Relatorio de Risco de Terceiros', 'Documento', 'Pendente', 'Avaliacao preliminar de fornecedores tecnologicos.'],
  [3, 'Norma de Gestao Criptografica', 'Documentacao', 'Concluido', 'Requisitos para chaves, certificados e algoritmos.'],
  [4, 'Evidencias de Backup e Restauro', 'Evidencia', 'Em Analise', 'Testes trimestrais de recuperacao de dados.'],
  [4, 'Relatorio de Hardening do ERP', 'Documento', 'Concluido', 'Configuracoes de seguranca aplicadas ao ERP fabril.'],
  [5, 'Plano de Resposta a Incidentes', 'Documentacao', 'Concluido', 'Papeis, contactos e playbooks operacionais.'],
  [6, 'Pentest Portal de Resultados', 'Pen Test', 'Pendente', 'Ambito e resultados do teste ao portal externo.'],
  [7, 'Arquitetura Zero Trust', 'Outros', 'Em Analise', 'Desenho de referencia para evolucao da rede corporativa.'],
  [8, 'Registo de Formacao de Colaboradores', 'Evidencia', 'Concluido', 'Evidencias da campanha anual de sensibilizacao.'],
  [9, 'Relatorio de Configuracao Microsoft 365', 'Documento', 'Concluido', 'Baseline de seguranca e recomendacoes de melhoria.']
];

const pedidos = [
  ['Validacao de plano de remediacao', 'Solicitamos revisao das medidas propostas para as vulnerabilidades criticas.', 'Em Análise'],
  ['Apoio na segmentacao do armazem', 'Necessitamos de recomendacoes para separar equipamentos operacionais da rede administrativa.', 'Pendente'],
  ['Revisao de acessos privilegiados OT', 'Pretendemos validar as contas e os perfis com acesso aos sistemas SCADA.', 'Em Análise'],
  ['Esclarecimento sobre evidencias NIS2', 'Que evidencias devem ser anexadas ao controlo de gestao de fornecedores?', 'Concluído'],
  ['Priorizacao de correcoes EDR', 'Solicitamos apoio para priorizar as recomendacoes identificadas pelo EDR.', 'Pendente'],
  ['Teste ao plano de continuidade', 'Pretendemos agendar um exercicio de indisponibilidade do portal do cidadao.', 'Em Análise'],
  ['Analise de alerta no LIMS', 'Foi observado um login fora do horario habitual e precisamos de apoio na analise.', 'Concluído'],
  ['Revisao de regras de firewall', 'Solicitamos validacao das regras entre a rede de gestao e a plataforma OSS.', 'Pendente'],
  ['Apoio na politica de backups', 'Precisamos de definir retencao e testes de restauro para documentacao de projetos.', 'Em Análise'],
  ['Configuracao segura de Microsoft 365', 'Solicitamos revisao de MFA, acesso condicional e partilha externa.', 'Concluído']
];

const artigos = [
  ['NIS2: cinco prioridades para a gestao de topo', 'nis2-cinco-prioridades-gestao-topo', 'Regulamentação', 'Um guia executivo para transformar obrigacoes NIS2 num programa de melhoria continua.', 'A conformidade NIS2 exige mais do que documentacao. A gestao deve conhecer os servicos essenciais, os riscos, as dependencias externas, os mecanismos de resposta e a forma como a eficacia dos controlos e medida. Comece por definir responsabilidades, inventariar ativos criticos, avaliar fornecedores, testar a resposta a incidentes e reunir evidencias auditaveis.'],
  ['Como preparar um exercicio de resposta a ransomware', 'preparar-exercicio-resposta-ransomware', 'Incidentes', 'Passos praticos para testar equipas, processos e decisoes durante um incidente grave.', 'Um exercicio eficaz combina um cenario realista, objetivos mensuraveis e participantes das areas tecnicas, juridicas e de comunicacao. A organizacao deve testar isolamento, recuperacao, comunicacao, preservacao de evidencia e criterios de escalamento. O relatorio final deve converter observacoes em acoes com responsaveis e prazos.'],
  ['Inventario de ativos: a base de uma boa gestao de risco', 'inventario-ativos-gestao-risco', 'Governança', 'Porque nao e possivel proteger sistemas que a organizacao nao conhece.', 'O inventario deve identificar proprietario, finalidade, localizacao, criticidade, dependencias, versao e exposicao de cada ativo. A informacao precisa de ser revista regularmente e ligada aos processos de vulnerabilidades, continuidade e resposta a incidentes. Automatizacao ajuda, mas a validacao pelos responsaveis de negocio continua essencial.'],
  ['Pentest ou analise de vulnerabilidades: qual escolher?', 'pentest-ou-analise-vulnerabilidades', 'Segurança Ofensiva', 'Diferencas de objetivo, profundidade e momento de utilizacao de cada abordagem.', 'A analise de vulnerabilidades procura fragilidades conhecidas de forma ampla e repetivel. O pentest explora caminhos de ataque de forma controlada para demonstrar impacto real. As duas abordagens sao complementares: scans frequentes apoiam a higiene tecnica e pentests periodicos validam os riscos mais relevantes.'],
  ['Seguranca Microsoft 365: controlos essenciais', 'seguranca-microsoft-365-controlos-essenciais', 'Boas Práticas', 'Uma baseline objetiva para reduzir compromissos de identidade e fuga de informacao.', 'Ative MFA resistente a phishing para perfis criticos, bloqueie autenticacao legada, aplique acesso condicional, controle consentimentos de aplicacoes e reveja partilhas externas. Centralize logs, crie alertas para comportamentos anormais e teste regularmente os procedimentos de resposta a contas comprometidas.']
];

async function findOrCreate(Model, where, defaults, transaction) {
  const [record, created] = await Model.findOrCreate({ where, defaults, transaction });
  return { record, created };
}

async function seed() {
  await sequelize.authenticate();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const totals = { clientes: 0, ativos: 0, incidentes: 0, documentos: 0, pedidos: 0, artigos: 0 };

  await sequelize.transaction(async transaction => {
    const empresas = [];

    for (const [nome, email, telefone, score, responsavel] of clientes) {
      const { record, created } = await findOrCreate(Cliente, { email }, {
        nome,
        email,
        telefone,
        password: passwordHash,
        score,
        status: true,
        respSegurancaNome: responsavel,
        respSegurancaEmail: email,
        respSegurancaTelefone: telefone
      }, transaction);
      empresas.push(record);
      if (created) totals.clientes++;
    }

    for (let index = 0; index < ativos.length; index++) {
      const [nome, tipo, criticidade, descricao] = ativos[index];
      const ClienteId = empresas[Math.floor(index / 2)].id;
      const { created } = await findOrCreate(AtivoTecnologico, { nome, ClienteId }, {
        nome, tipo, criticidade, descricao, ClienteId
      }, transaction);
      if (created) totals.ativos++;
    }

    for (let index = 0; index < incidentes.length; index++) {
      const [tipo, impacto, descricao, acoesImediatas, estado] = incidentes[index];
      const ClienteId = empresas[index].id;
      const existente = await Incidente.findOne({ where: { ClienteId, descricao }, transaction });
      if (!existente) {
        await Incidente.create({
          tipo,
          impacto,
          descricao,
          acoesImediatas,
          estado,
          dataOcorrencia: new Date(Date.UTC(2026, 3, 4 + index, 8 + (index % 6), 30)),
          ClienteId
        }, { transaction });
        totals.incidentes++;
      }
    }

    for (const [clienteIndex, nome, categoria, estado, descricao] of documentos) {
      const ClienteId = empresas[clienteIndex].id;
      const { created } = await findOrCreate(Documento, { nome, ClienteId }, {
        nome,
        categoria,
        estado,
        descricao,
        tipo: 'PDF',
        caminho: null,
        ClienteId
      }, transaction);
      if (created) totals.documentos++;
    }

    for (let index = 0; index < pedidos.length; index++) {
      const [titulo, descricao, estado] = pedidos[index];
      const ClienteId = empresas[index].id;
      const { record: pedido, created } = await findOrCreate(Pedido, { titulo, ClienteId }, {
        titulo, descricao, estado, ClienteId
      }, transaction);
      if (created) totals.pedidos++;

      await findOrCreate(MensagemPedido, {
        PedidoId: pedido.id,
        enviadoPor: 'Cliente',
        texto: descricao
      }, { PedidoId: pedido.id, enviadoPor: 'Cliente', texto: descricao }, transaction);
    }

    for (const [titulo, slug, categoria, resumo, conteudo] of artigos) {
      const { created } = await findOrCreate(Artigo, { slug }, {
        titulo,
        slug,
        categoria,
        resumo,
        conteudo,
        autor: 'Equipa CyberBox Secur',
        publicado: true,
        dataPublicacao: new Date(Date.UTC(2026, 4, 5 + totals.artigos, 9, 0)),
        imagem: null
      }, transaction);
      if (created) totals.artigos++;
    }
  });

  console.log('Seed de demonstracao concluido sem remover ou alterar dados existentes.');
  console.table(totals);
  console.log(`Password dos novos clientes: ${DEMO_PASSWORD}`);
}

seed()
  .catch(error => {
    console.error('Falha ao criar dados de demonstracao:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
