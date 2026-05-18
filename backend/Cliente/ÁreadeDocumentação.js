import { Search, Download, FileText } from 'lucide-react';

const ListaDocumentacao = () => {
  const docs = [
    { title: "Relatório de Avaliação de Risco - Q1 2024", tag: "Relatório", color: "primary", date: "2024-03-20" },
    { title: "Política de Segurança da Informação", tag: "Documentação", color: "success", date: "2024-03-18" }
  ];

  return (
    <Container className="py-4">
      <h3 className="fw-bold">Documentação</h3>
      <p className="text-muted">Consulte e descarregue documentos disponibilizados</p>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="d-flex align-items-center bg-light rounded">
          <Search size={18} className="text-muted me-2" />
          <input type="text" className="form-control border-0 bg-transparent" placeholder="Pesquisar por nome..." />
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h6 className="fw-bold mb-3">Seus Documentos ({docs.length})</h6>
          {docs.map((doc, index) => (
            <div key={index} className="d-flex align-items-center justify-content-between p-3 border rounded mb-3">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 bg-primary bg-opacity-10 rounded text-primary"><FileText /></div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold">{doc.title}</span>
                    <span className={`badge bg-${doc.color} bg-opacity-10 text-${doc.color} small`}>{doc.tag}</span>
                  </div>
                  <small className="text-muted">PDF • 2.4 MB • Carregado em {doc.date}</small>
                </div>
              </div>
              <Button variant="outline-dark" size="sm" className="d-flex align-items-center gap-1">
                <Download size={14}/> Descarregar
              </Button>
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};